# Blog Management App: Database Migration and Deployment Guide

এই guide-টি এই repository-র বর্তমান code দেখে লেখা। Project-টি একটি monorepo:

```text
frontend/   -> Next.js 16
backend/    -> Express 5 + Sequelize 6 + MySQL
```

এই documentation-এর জন্য তৈরি Git branch:

```text
deployment-database-guide
```

`main` branch-এর application code পরিবর্তন করা হয়নি।

## সংক্ষিপ্ত সিদ্ধান্ত

এই project live করার সবচেয়ে সহজ এবং কম-risk architecture:

```text
Browser
   |
   v
Vercel (frontend/)
   |
   v
Render Web Service (backend/)
   |
   v
Render PostgreSQL
```

**Recommendation: PostgreSQL ব্যবহার করুন।** কারণ বর্তমান backend Sequelize-ভিত্তিক relational application। MySQL থেকে PostgreSQL-এ গেলে বেশির ভাগ model, association, controller এবং service একই রাখা যায়।

MongoDB ব্যবহার করা সম্ভব, তবে শুধু `.env` বদলালেই হবে না। Sequelize model ও query-গুলো Mongoose/MongoDB অনুযায়ী rewrite করতে হবে।

| Option | Code change | Existing API একই রাখা | এই project-এর জন্য |
|---|---:|---:|---|
| Render PostgreSQL | কম | প্রায় পুরোপুরি সম্ভব | **Recommended** |
| MongoDB Atlas | বেশি | careful rewrite করলে সম্ভব | শেখা/requirement থাকলে |
| Cloud MySQL | খুব কম | হ্যাঁ | MySQL রাখলে |

**DBeaver server নয়।** এটি শুধু database দেখার ও data transfer করার desktop client। DBeaver বন্ধ বা uninstall থাকলেও deployed application চলবে। Live application-এর জন্য একটি cloud database দরকার।

## জরুরি security কাজ

এই chat-এ একটি real-looking Gmail App Password দেয়া হয়েছে। এটিকে exposed/compromised ধরে নিন। কাজ শুরুর আগে:

1. Google Account থেকে পুরনো Gmail App Password revoke করুন।
2. একটি নতুন App Password তৈরি করুন।
3. Render dashboard-এ নতুন value দিন।
4. নতুন, random `SECRET_KEY` ব্যবহার করুন। যেমন:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

5. Production admin password পরিবর্তন করুন।
6. `.env` GitHub-এ commit করবেন না এবং Vercel frontend-এ backend secrets দেবেন না।
7. Production-এ `NODE_ENV=production` দিন এবং `DEV_OTP` দেবেন না।

বর্তমান `backend/.gitignore` already `backend/.env` ignore করে। তবুও commit-এর আগে চালান:

```powershell
git status --short
git grep -n "GMAIL_APP_PASSWORD\|SECRET_KEY\|DB_PASSWORD\|OPENAI_API_KEY"
```

## Branch workflow

বর্তমান documentation branch verify করতে:

```powershell
git branch --show-current
```

Database migration implement করার সময় চাইলে এখান থেকে আলাদা implementation branch করুন:

```powershell
# PostgreSQL implementation
git switch -c feature/postgresql-deployment

# অথবা main থেকে MongoDB implementation
git switch main
git switch -c feature/mongodb-migration
```

একই branch-এ PostgreSQL এবং MongoDB দুটো implementation mix করবেন না। আলাদা database এবং আলাদা deployment service দিয়ে test করুন। Git branch code rollback করতে পারে, কিন্তু database-এ migrate করা data নিজে rollback করে না—migration-এর আগে backup রাখুন।

---

# Option A — PostgreSQL + Render + Vercel (Recommended)

## কেন PostgreSQL সবচেয়ে সহজ

বর্তমান code-এ এগুলো Sequelize ব্যবহার করছে:

- `backend/models/user.model.js`
- `backend/models/blog.model.js`
- `backend/models/otp.model.js`
- `backend/models/PasswordResetToken.model.js`
- `backend/models/association.js`
- `backend/services/*.js`

Sequelize 6 MySQL এবং PostgreSQL দুটোই support করে। PostgreSQL driver হিসেবে `pg` এবং `pg-hstore` লাগবে। Sequelize-এর stable v6 guide-এও এই driver pair দেয়া আছে: [Sequelize v6 getting started](https://sequelize.org/docs/v6/getting-started/).

## 1. PostgreSQL dependency বসান

Implementation branch-এ:

```powershell
cd backend
npm uninstall mysql2
npm install pg pg-hstore
```

## 2. Database config পরিবর্তন করুন

Production-এ আলাদা পাঁচটি `DB_*` variable-এর বদলে একটি `DATABASE_URL` ব্যবহার করা সহজ। `backend/config/db.js`-এর intended shape:

```js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
```

Local PostgreSQL example:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dbblog
```

Render backend ও Render Postgres একই account এবং region-এ রাখলে database-এর **Internal Database URL** ব্যবহার করুন। Render-এর documentation অনুযায়ী internal URL same-region Render service-এর জন্য কম latency দেয়: [Create and connect to Render Postgres](https://render.com/docs/postgresql-creating-connecting).

## 3. PostgreSQL-specific code check

Current `backend/services/blog.service.js` title search-এ `Op.like` ব্যবহার করে। PostgreSQL-এ case-insensitive search রাখতে:

```js
where.blogTitle = {
  [Op.iLike]: `%${title}%`
};
```

বাকি model definitions এবং associations সাধারণভাবে একই থাকতে পারে। তবে migration-এর পরে এগুলো test করুন:

- `role` enum creation
- `email` unique constraint
- `userId` foreign keys এবং cascade delete
- `createAt`/`updateAt` timestamp field names
- admin/user ID numeric থাকা

Current `sequelize.sync()` demo বা প্রথম empty deployment-এ table বানাবে। Long-term production changes-এর জন্য `sync({ alter: true })` বা destructive sync ব্যবহার না করে Sequelize migrations ব্যবহার করা উচিত।

## 4. Existing MySQL data PostgreSQL-এ নেবেন কীভাবে

### ছোট assignment/demo এবং পুরনো data দরকার নেই

সবচেয়ে clean উপায়:

1. Empty Render PostgreSQL তৈরি করুন।
2. Backend first start করে Sequelize-কে table তৈরি করতে দিন।
3. `npm run seed:admin` চালান।
4. নতুন test users/blogs তৈরি করুন।

### পুরনো data রাখতে হলে DBeaver দিয়ে

DBeaver database-to-database table transfer করতে পারে: [DBeaver Data Migration](https://dbeaver.com/docs/dbeaver/Data-migration/).

1. MySQL-এর full backup নিন।
2. DBeaver-এ source MySQL এবং target PostgreSQL—দুই connection তৈরি করুন।
3. Backend একবার চালিয়ে target schema/table তৈরি করুন, তারপর backend বন্ধ করুন।
4. Transfer order রাখুন:
   - `users`
   - `blogs`
   - `otp_verifications` (সাধারণত expired হওয়ায় skip করা যায়)
   - `password_reset_tokens` (সাধারণত skip করা যায়)
5. Source table select করে **Export Data → Database/Table** target দিন।
6. Column mapping review করুন; `id` এবং `userId` preserve করুন।
7. Transfer চলার সময় source data পরিবর্তন করবেন না।
8. Row counts, sample users, blog-author relation এবং login verify করুন।
9. Explicit numeric IDs import করলে PostgreSQL auto-increment sequences max ID-এর পরে আছে কি না check/fix করুন।

Passwords copy করার সময় hash-গুলো 그대로 রাখবেন; plain password-এ convert করবেন না।

## 5. Render PostgreSQL তৈরি করুন

1. Render Dashboard → **New → PostgreSQL**.
2. Backend-এর কাছাকাছি একটি region নিন।
3. Database তৈরি হলে **Internal Database URL** copy করুন।
4. Backend Web Service-এ `DATABASE_URL` হিসেবে দিন।
5. External URL শুধু local DBeaver/migration-এর জন্য ব্যবহার করুন; কাজ শেষে external access restrict করুন।

---

# Option B — MongoDB Atlas + Render + Vercel

## গুরুত্বপূর্ণ: এটি env-only change নয়

MongoDB নিলে নিচের code-level changes লাগবে:

| Current Sequelize code | MongoDB/Mongoose replacement |
|---|---|
| `sequelize.authenticate()` | `mongoose.connect(MONGO_URI)` |
| `sequelize.sync()` | Schema/index initialization |
| `DataTypes.*` models | `mongoose.Schema` models |
| `findByPk(id)` | `findById(id)` |
| `findOne({ where: ... })` | `findOne({ ... })` |
| `findAndCountAll` | `countDocuments` + `find/skip/limit` |
| `include` association | `populate()` বা aggregation |
| `destroy({ where })` | `deleteMany()` |
| instance `.destroy()` | `deleteOne()` |
| `Op.like` | escaped regex অথবা Atlas Search |
| integer `id` validation | MongoDB ObjectId validation |

## 1. Dependencies

```powershell
cd backend
npm uninstall sequelize mysql2
npm install mongoose
```

## 2. MongoDB connection

`backend/config/db.js`-এর intended shape:

```js
import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required.");
  }

  await mongoose.connect(process.env.MONGO_URI);
}
```

`server.js`-এ `sequelize.authenticate()` এবং `sequelize.sync()` বাদ দিয়ে `await connectDB()` করতে হবে।

## 3. কোন files rewrite হবে

কমপক্ষে:

```text
backend/config/db.js
backend/models/user.model.js
backend/models/blog.model.js
backend/models/otp.model.js
backend/models/PasswordResetToken.model.js
backend/models/association.js
backend/services/auth.service.js
backend/services/user.service.js
backend/services/blog.service.js
backend/services/otp.service.js
backend/middleware/auth.middleware.js
backend/controller/user.controller.js
backend/controller/blog.controller.js
backend/server.js
backend/seedAdmin.js
backend/package.json
```

Recommended MongoDB relationships:

```text
users._id                  ObjectId
blogs.userId               ObjectId -> users._id
otp_verifications.userId   ObjectId -> users._id
password_reset_tokens.userId ObjectId -> users._id
```

`Blog` queries-এ author data পাওয়ার জন্য `populate("userId", "firstname lastname profilePicture")` ব্যবহার করা যাবে। Existing frontend যেন `author` object এবং `id` পেতে থাকে, তার জন্য API response mapping/virtuals দিতে হবে।

Current controllers শুধু numeric ID নেয়:

```js
/^\d+$/
```

MongoDB-তে এটি `mongoose.isValidObjectId(id)` দিয়ে বদলাতে হবে। JWT-তে ObjectId string রাখা যাবে। Ownership compare করার সময় `existingBlog.userId.toString() === userId.toString()` করুন।

Required indexes:

- `users.email`: unique
- `password_reset_tokens.tokenHash`: unique
- OTP/token expiry cleanup-এর জন্য TTL index optional
- `blogs.userId`
- title/category search-এর উপযুক্ত index

TTL cleanup সাথে সাথে নাও হতে পারে, তাই authentication logic-এ বর্তমানের মতো application-level expiry check রাখুন।

## 4. MongoDB Atlas setup

1. MongoDB Atlas-এ project এবং cluster তৈরি করুন।
2. **Database Access** থেকে application database user তৈরি করুন। Atlas user এবং database user আলাদা।
3. **Network Access**-এ backend-এর access allow করুন। Atlas connection-এর জন্য IP access list এবং database user দুটোই দরকার: [Connect to an Atlas cluster](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).
4. Driver connection string নিন:

   ```env
   MONGO_URI=mongodb+srv://APP_USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER/dbblog?retryWrites=true&w=majority
   ```

5. Password-এ special character থাকলে URL-encode করুন।
6. URI GitHub বা Vercel frontend-এ দেবেন না; শুধু Render backend environment-এ দিন।

Demo-র জন্য `0.0.0.0/0` network access ব্যবহার করলে strong unique credential ব্যবহার করুন। Production-এ সম্ভব হলে static outbound IP/private networking দিয়ে access আরও restrict করুন।

## 5. Existing MySQL data MongoDB-তে নেবেন কীভাবে

### Recommended: MongoDB Relational Migrator

MongoDB Relational Migrator MySQL 5.7+ source এবং Atlas/self-managed MongoDB target support করে: [Relational Migrator overview](https://www.mongodb.com/docs/relational-migrator/getting-started/).

High-level steps:

1. MySQL backup নিন এবং writes সাময়িকভাবে বন্ধ করুন।
2. Relational Migrator install/open করুন।
3. New Project → source হিসেবে MySQL connection দিন।
4. Target হিসেবে Atlas `MONGO_URI` দিন।
5. Mapping rules-এ `users`, `blogs`, OTP এবং reset tokens map করুন।
6. `userId` relationship ObjectId reference হবে নাকি old integer ID থাকবে—code rewrite-এর সাথে মিলিয়ে সিদ্ধান্ত নিন। ObjectId reference recommended।
7. Snapshot migration চালান।
8. **Verify migrated data** enable করুন। Migration job source/target connect, mapping এবং verification support করে: [Create a migration job](https://www.mongodb.com/docs/relational-migrator/jobs/creating-jobs/).
9. Document counts, email uniqueness, blog authors এবং login flow test করুন।
10. তারপরই Render backend-কে MongoDB branch-এ switch করুন।

### DBeaver JSON export দিয়ে

DBeaver থেকে JSON export করা যায়, কিন্তু relational foreign key-কে MongoDB ObjectId reference-এ safely convert করা one-click নয়। ছোট disposable demo data ছাড়া এই route avoid করুন। Custom import script হলে পুরনো MySQL `users.id` → নতুন MongoDB `_id` mapping table রাখতে হবে, তারপর প্রতিটি blog/token-এর `userId` rewrite করতে হবে।

Data migrate করলেও Sequelize application নিজে MongoDB-compatible হয় না। **আগে code rewrite এবং test, তারপর data cutover** করতে হবে।

---

# Render-এ backend deploy

Render monorepo-র একটি subdirectory-কে service root করতে পারে: [Render monorepo support](https://render.com/docs/monorepo-support).

## 1. Web Service settings

Render Dashboard → **New → Web Service**:

| Setting | Value |
|---|---|
| Repository | এই Git repository |
| Branch | tested implementation branch; final হলে production branch |
| Root Directory | `backend` |
| Language | `Node` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/` |

Current `/` route already `200` JSON response দেয়, তাই health check হিসেবে ব্যবহার করা যাবে।

Current server `process.env.PORT` পড়ে—এটাই ঠিক pattern। Render নিজে `PORT` দেয় এবং service-কে `0.0.0.0`-এ bind করতে বলে: [Render Web Services](https://render.com/docs/web-services).

Safer server listen code:

```js
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at ${PORT}`);
});
```

Render-এ `PORT=5000` manually দেয়া বাধ্যতামূলক নয়। Local `.env`-এ `PORT=5000` রাখা যাবে। `Docker.PORT=5000` নামে কোনো valid syntax নেই।

## 2. Production backend environment — PostgreSQL

Render Dashboard → backend service → **Environment**:

```env
NODE_ENV=production
DATABASE_URL=<Render PostgreSQL internal URL>
SECRET_KEY=<new long random value>
JWT_EXPIRES_IN=24h
GMAIL=<sender Gmail address>
GMAIL_APP_PASSWORD=<new rotated app password>
RESET_TOKEN_EXPIRES_MINUTES=20
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=<private admin email>
ADMIN_PASSWORD=<strong unique admin password>
```

Production-এ দেবেন না:

```env
DEV_OTP=123456
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dbblog
DB_USER=root
DB_PASSWORD=<local MySQL password>
```

## 3. Production backend environment — MongoDB

```env
NODE_ENV=production
MONGO_URI=<MongoDB Atlas connection string>
SECRET_KEY=<new long random value>
JWT_EXPIRES_IN=24h
GMAIL=<sender Gmail address>
GMAIL_APP_PASSWORD=<new rotated app password>
RESET_TOKEN_EXPIRES_MINUTES=20
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=<private admin email>
ADMIN_PASSWORD=<strong unique admin password>
```

Render environment variables source code-এ secret commit না করে dashboard-এ রাখা যায়: [Render environment variables and secrets](https://render.com/docs/configure-environment-variables).

## 4. CORS production fix

Current `app.use(cors())` সব origin allow করে। Production implementation-এ:

```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-use-test-otp"],
}));
```

Production-এ `x-use-test-otp` ব্যবহার হয় না; compatibility দরকার না হলে allowed headers থেকে এটিও বাদ দিন। Vercel preview URL আলাদা হওয়ায় preview testing-এর জন্য explicit allowlist logic লাগতে পারে—blind wildcard ব্যবহার করবেন না।

## 5. Profile uploads-এর production সমস্যা

বর্তমান app profile images এখানে save করে:

```text
backend/uploads/profile/
```

Render-এর default filesystem ephemeral; restart/redeploy হলে নতুন uploaded files হারিয়ে যাবে। Persistent disk শুধু paid services-এ attach করা যায়: [Render Persistent Disks](https://render.com/docs/disks).

দুটি সমাধান:

1. **Recommended:** Cloudinary/S3-compatible object storage-এ upload করে database-এ full URL save করুন। এটি horizontally scalable এবং frontend-এর `getAssetUrl` absolute URL already handle করে।
2. Paid Render persistent disk attach করুন এবং application-এর upload path সেই mounted directory-তে configure করুন। এক service instance-এর সীমাবদ্ধতা মাথায় রাখুন।

Database live হলেও এই upload issue fix না করলে profile picture production-safe হবে না।

## 6. Admin seed

Database table/collection ready হওয়ার পরে একবার:

```powershell
npm run seed:admin
```

Render Shell available থাকলে service shell থেকে চালান। না থাকলে controlled one-off process ব্যবহার করুন। Seeder বারবার deploy start command-এর অংশ করবেন না।

---

# Vercel-এ frontend deploy

Vercel একই repository থেকে `frontend` subdirectory deploy করতে পারে। Monorepo import-এ Root Directory select করা যায়: [Vercel monorepos](https://vercel.com/docs/monorepos).

## 1. Project settings

1. Vercel Dashboard → **Add New Project**.
2. এই repository import করুন।
3. **Root Directory = `frontend`**.
4. Framework preset Next.js auto-detect হতে দিন।
5. Build command default `next build` রাখুন।
6. প্রথমে branch preview deploy করুন; test pass হলে production branch/domain দিন।

## 2. Frontend environment

Vercel Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com
```

শেষে `/api` দেবেন না, কারণ frontend service methods route-এর `/api` বা `/auth` নিজেই যোগ করে।

`NEXT_PUBLIC_*` browser bundle-এ public হয়। তাই নিচের কোনোটিই Vercel frontend-এ দেবেন না:

- database URL/password
- Gmail App Password
- JWT secret
- OpenAI API key
- admin password

Environment variable add/change করার পরে redeploy দরকার; নতুন value পুরনো deployment-এ apply হয় না: [Vercel environment variables](https://vercel.com/docs/environment-variables).

## 3. Final URL loop ঠিক করুন

Recommended order:

1. Database তৈরি করুন।
2. Render backend deploy করুন।
3. Render URL নিয়ে Vercel-এ `NEXT_PUBLIC_API_URL` দিন।
4. Vercel frontend deploy করুন।
5. Final Vercel URL নিয়ে Render-এ `FRONTEND_URL` update করুন।
6. Render backend redeploy করুন।
7. Forgot-password email link এবং CORS test করুন।

---

# Docker লাগবে কি?

**এই project Render-এ deploy করতে Docker বাধ্যতামূলক নয়।** Render-এর native Node runtime দিয়ে দ্রুত deploy করা যাবে। Render নিজেও Node app-এর জন্য native runtime-কে সহজ starting point হিসেবে উল্লেখ করে; reproducible build বা OS package দরকার হলে Docker useful: [Docker on Render](https://render.com/docs/docker).

Docker ব্যবহার করলে সম্ভাব্য `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
```

`backend/.dockerignore`:

```text
node_modules
npm-debug.log
.env
uploads
```

Local build/run:

```powershell
cd backend
docker build -t blog-backend .
docker run --env-file .env -p 5000:5000 blog-backend
```

মনে রাখুন:

- `EXPOSE 5000` শুধু image metadata; এটি Render-এর `PORT` set করে না।
- App-কে সবসময় `process.env.PORT` পড়তে হবে।
- Secret কখনো Dockerfile-এর `ENV` বা image build argument-এ hardcode করবেন না।
- Docker container-এর local upload directory-ও persistent নয়, যদি volume/object storage না থাকে।

---

# AI integration: Blog Summary এবং আরও feature

AI feature database migration-এর পরে আলাদা ছোট feature branch-এ করা ভালো। প্রথম feature হিসেবে **Generate Summary** সবচেয়ে useful এবং সহজ।

## Recommended features

1. 2–3 sentence blog summary
2. Suggested category এবং tags
3. Better title suggestions
4. SEO meta description
5. Bangla ↔ English translation
6. Writing clarity/grammar suggestions

AI যেন user-এর blog silently overwrite না করে। Suggestion দেখিয়ে user approval-এর পরে save করুন।

## নিরাপদ architecture

```text
Frontend button
   |
   v
Protected Express endpoint
   |
   v
OpenAI Responses API
   |
   v
summary returned/saved
```

OpenAI call শুধু backend থেকে করবেন। `OPENAI_API_KEY` কখনো `NEXT_PUBLIC_*` variable বা frontend code-এ দেবেন না। Official OpenAI documentation নতুন text-generation integration-এর জন্য Responses API দেখায়: [OpenAI text generation guide](https://developers.openai.com/api/docs/guides/text).

## Implementation outline

```powershell
cd backend
npm install openai
```

Render-only secrets/config:

```env
OPENAI_API_KEY=<secret key>
OPENAI_MODEL=<text model available to this OpenAI project>
```

Service example:

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeBlog({ title, content }) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL,
    instructions:
      "Summarize the blog accurately in 2 or 3 short sentences. " +
      "Do not invent facts. Return only the summary.",
    input: `Title: ${title}\n\nBlog:\n${content}`,
  });

  return response.output_text.trim();
}
```

Possible protected endpoint:

```http
POST /api/blogs/:id/summary
Authorization: Bearer <token>
```

Production checklist:

- শুধু blog owner/admin endpoint call করতে পারবে
- input size limit দিন
- endpoint rate-limit করুন
- request timeout এবং clean error response দিন
- একই content বারবার summarize না করে summary cache/save করুন
- blog update হলে old summary stale mark/regenerate করুন
- password, OTP, reset token বা private profile data model-এ পাঠাবেন না
- generated text user-editable রাখুন
- prompt/model behavior-এর tests রাখুন

Blog schema-এ optional fields দেয়া যায়:

```text
summary
summaryUpdatedAt
aiModel
```

AI feature ছাড়াও application পুরোপুরি কাজ করবে—AI API failure blog create/read flow block করা উচিত নয়।

---

# Production env templates

## Local backend — PostgreSQL

```env
NODE_ENV=development
PORT=5000
DEV_OTP=123456
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dbblog
SECRET_KEY=replace_with_a_long_random_secret
JWT_EXPIRES_IN=24h
GMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_new_app_password
RESET_TOKEN_EXPIRES_MINUTES=20
FRONTEND_URL=http://localhost:3000
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_me
```

## Local backend — MongoDB

```env
NODE_ENV=development
PORT=5000
DEV_OTP=123456
MONGO_URI=mongodb://127.0.0.1:27017/dbblog
SECRET_KEY=replace_with_a_long_random_secret
JWT_EXPIRES_IN=24h
GMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_new_app_password
RESET_TOKEN_EXPIRES_MINUTES=20
FRONTEND_URL=http://localhost:3000
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_me
```

## Local frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

প্রতিটি variable আলাদা line-এ থাকবে। যেমন `ADMIN_EMAIL=... ADMIN_PASSWORD=...` একই line-এ লিখলে password আলাদা variable হবে না। Markdown link syntax-ও `.env`-এ ব্যবহার করবেন না; সরাসরি URL লিখবেন।

---

# Go-live test checklist

## Backend

- [ ] `GET https://YOUR-BACKEND.onrender.com/` returns `200`
- [ ] Register works
- [ ] Login sends a real OTP in production
- [ ] Fixed `DEV_OTP` production-এ কাজ করে না
- [ ] OTP verification returns JWT
- [ ] Forgot/reset password URL final Vercel domain-এ যায়
- [ ] Normal user অন্য user's blog edit/delete করতে পারে না
- [ ] Admin user list/status update করতে পারে
- [ ] Search এবং category filter কাজ করে
- [ ] Database restart/redeploy-এর পর data থাকে

## Frontend

- [ ] Vercel build passes
- [ ] `NEXT_PUBLIC_API_URL` Render HTTPS URL
- [ ] Browser console-এ CORS/mixed-content error নেই
- [ ] Login refresh-এর পর authentication expectedভাবে থাকে
- [ ] Blog details/create/edit/delete কাজ করে
- [ ] Absolute profile image URL load হয়

## Storage এবং security

- [ ] Gmail App Password rotate করা হয়েছে
- [ ] Strong JWT secret ব্যবহার হয়েছে
- [ ] Strong admin password ব্যবহার হয়েছে
- [ ] `.env`/secret Git history-তে নেই
- [ ] MongoDB/PostgreSQL public access minimum করা হয়েছে
- [ ] Profile upload persistent disk/object storage-এ যায়
- [ ] Logs-এ password, token, OTP বা connection URI print হয় না

## AI (যদি যোগ করা হয়)

- [ ] OpenAI API key শুধু Render backend-এ
- [ ] Endpoint authenticated এবং rate-limited
- [ ] Long input limit করা
- [ ] Failure হলে normal blog flow কাজ করে
- [ ] Summary factual এবং user-editable

## Final recommendation

Assignment দ্রুত live করার practical order:

1. Exposed Gmail App Password rotate করুন।
2. `feature/postgresql-deployment` branch-এ PostgreSQL conversion করুন।
3. Render PostgreSQL + Render backend deploy করুন।
4. Profile upload-এর জন্য object storage অথবা paid persistent disk ঠিক করুন।
5. Vercel frontend deploy করে URL দুদিকে wire করুন।
6. Full Postman/browser test করুন।
7. তারপর আলাদা branch-এ AI summary যোগ করুন।

MongoDB যদি instructor/client requirement হয়, আলাদা `feature/mongodb-migration` branch-এ full Mongoose rewrite করুন। শুধু deployment সহজ করার জন্য MongoDB-তে যাওয়া এই codebase-এ প্রয়োজন নেই; PostgreSQL কম change এবং কম regression risk দেয়।
