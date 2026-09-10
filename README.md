# Blog Management Application

A full-stack blog management platform built with Next.js, Express.js, Sequelize, and MySQL. Guests can discover and read published articles, authenticated users can manage their own blogs and profiles, and administrators can manage all blogs and user accounts.

The frontend consumes the real REST API from this repository. No mock users, hardcoded blog lists, or direct frontend database access are used.

## Main Features

### Guest

- Browse all published blogs
- Search blogs by title
- Filter blogs by category
- Combine title search and category filtering
- Read complete blog details
- Register, log in with OTP verification, and recover a forgotten password

### User

- Persistent JWT-based authentication
- Protected dashboard and account routes
- View dashboard statistics and recent blogs
- View, search, and filter only their own blogs under **My Blogs**
- Create, edit, and delete their own blogs
- View and update profile information
- Upload a profile image with immediate navbar updates
- Change password and log out

### Admin

- View platform statistics from the admin dashboard
- View, search, and filter every user's blog under **All Blogs**
- Create blogs and edit or delete any blog
- View all users with pagination
- View individual user details
- Activate or deactivate user accounts
- Access profile, avatar, password, and logout features
- Backend authorization protects admin-only operations; the UI is not the only security boundary

## Authentication and OTP

Login uses two steps:

1. The user submits a valid email and password.
2. The backend creates a six-digit OTP and the user verifies it before receiving a JWT.

OTP protections currently include:

- Random six-digit OTPs for normal email delivery
- Hashed OTP storage instead of storing the plain OTP
- Two-minute expiry
- Previous OTP invalidation when a new OTP is generated
- Maximum of five incorrect attempts per OTP
- OTP deletion after successful verification
- Login/OTP-request rate limit: five requests per IP every 15 minutes
- OTP-verification rate limit: ten requests per IP every 10 minutes

In development mode, the seeded admin uses `DEV_OTP`. Production mode ignores this fixed development OTP and sends a randomly generated OTP by email.

## Demo Admin Account

The default development values in `backend/.env.example` are intended only for local evaluation:

| Field | Development value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `12345` |
| OTP | `123456` |

Create the admin after the database tables have been initialized:

```bash
cd backend
npm run seed:admin
```

> These are demonstration credentials, not production credentials. Replace them before deploying the application and never reuse a real password.

## Technologies

### Frontend

- Next.js 16 with the App Router
- React 19
- Tailwind CSS 4
- Context API for authentication state
- Reusable service layer for REST API communication

### Backend

- Node.js and Express.js 5
- MySQL with Sequelize ORM
- JSON Web Tokens for protected API access
- bcryptjs for password hashing
- Nodemailer for OTP and password-reset email delivery
- Multer for profile-image uploads
- express-rate-limit for OTP endpoint protection
- Helmet and CORS

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT middleware verifies protected requests and reloads the current user from the database.
- Role middleware enforces admin-only user-management endpoints.
- Ownership checks prevent normal users from editing or deleting another user's blog.
- OTP endpoints are rate-limited to reduce request abuse and repeated guessing.
- Helmet adds common HTTP security headers.
- CORS is enabled so the separately hosted frontend can call the backend API. The current development configuration allows all origins; production deployments should restrict it to the deployed frontend origin.
- Profile uploads validate supported image types and enforce a 5 MB size limit.
- Real `.env` files are ignored and must never be committed.

## Project Structure

```text
.
|-- backend/
|   |-- config/          # Database configuration
|   |-- controller/      # HTTP request handlers
|   |-- middleware/      # Authentication, authorization, upload, and rate limiting
|   |-- models/          # Sequelize models and associations
|   |-- routes/          # REST API routes
|   |-- services/        # Application and database logic
|   |-- uploads/         # Uploaded profile images
|   |-- utils/           # JWT, validation, mail, and OTP utilities
|   |-- app.js           # Express application configuration
|   |-- server.js        # Backend entry point
|   `-- seedAdmin.js     # Development admin seeder
|-- frontend/
|   |-- app/             # Next.js App Router pages and layouts
|   |-- components/      # Reusable UI and feature components
|   |-- contexts/        # Authentication context
|   |-- public/          # Static assets
|   |-- services/        # Auth, user, and blog API services
|   `-- utils/           # API, auth, blog, and validation helpers
|-- Major_Page _Screenshot/
`-- README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- MySQL Server
- A Gmail account with an App Password if real OTP and password-reset emails will be tested

## Installation

Clone the repository:

```bash
git clone https://github.com/Rejwana7/blog-management-website.git
cd blog-management-website
```

Install backend and frontend dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the MySQL database:

```sql
CREATE DATABASE dbblog;
```

## Environment Variables

Copy each example file to a local `.env` file.

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend environment

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Runtime environment; use `development` locally |
| `PORT` | Backend HTTP port, normally `5000` |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | MySQL database name |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `SECRET_KEY` | Private JWT signing secret |
| `JWT_EXPIRES_IN` | JWT lifetime, such as `24h` |
| `GMAIL` | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password; never commit it |
| `DEV_OTP` | Six-digit admin OTP used only in development |
| `RESET_TOKEN_EXPIRES_MINUTES` | Password-reset link lifetime |
| `FRONTEND_URL` | Frontend origin used in reset links |
| `ADMIN_FIRSTNAME` | Seeded admin first name |
| `ADMIN_LASTNAME` | Seeded admin last name |
| `ADMIN_EMAIL` | Seeded admin login email |
| `ADMIN_PASSWORD` | Seeded admin login password |

For the normal local setup:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

If Next.js runs on port `3001`, update the backend value:

```env
FRONTEND_URL=http://localhost:3001
```

### Frontend environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Do not append `/api` to `NEXT_PUBLIC_API_URL`. Individual service methods already include their required `/api` or `/auth` route prefix.



## Running the Application

Start the backend from the first terminal:

```bash
cd backend
npm run dev
```

The backend runs at [http://localhost:5000](http://localhost:5000).

After the database tables have been initialized, seed the development admin if needed:

```bash
cd backend
npm run seed:admin
```

Start the frontend from a second terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs at [http://localhost:3000](http://localhost:3000). To select port `3001` explicitly:

```bash
npm run dev -- -p 3001
```

## Backend Dependency

The frontend depends on the backend API and does not provide mock data. Start the backend, connect it to MySQL, and set `NEXT_PUBLIC_API_URL` before using API-backed pages. If the backend is unavailable, blog, profile, authentication, and admin requests cannot complete.

Uploaded profile images are served by Express from `/uploads` and are resolved using the same backend base URL.

## Application Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Homepage, public blog cards, search, and category filter |
| `/blogs/[id]` | Public | Blog details |
| `/register` | Public | User registration |
| `/login` | Public | Email and password login |
| `/verify-otp` | Public login flow | OTP verification |
| `/forgot-password` | Public | Request a password-reset link |
| `/reset-password/[token]` | Public | Set a new password, then return to login |
| `/dashboard` | User/Admin | Role-aware dashboard |
| `/dashboard/blogs` | User/Admin | User's own blogs or all blogs for an admin |
| `/dashboard/blogs/create` | User/Admin | Create a blog |
| `/dashboard/blogs/[id]/edit` | User/Admin | Edit an authorized blog |
| `/dashboard/profile` | User/Admin | View/update profile and upload avatar |
| `/dashboard/change-password` | User/Admin | Change password |
| `/admin/users` | Admin | View users, inspect details, and update status |

## REST API Overview

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Validate credentials and request an OTP |
| `POST` | `/auth/verify-otp` | Verify OTP and receive a JWT |
| `POST` | `/auth/forgot-password` | Send a password-reset email |
| `PATCH` | `/auth/reset-password/:token` | Reset password using a valid token |

### Profiles and users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/profile` | User/Admin | Get the current profile |
| `PUT` | `/api/profile/update` | User/Admin | Update the current profile |
| `PATCH` | `/api/profile/image` | User/Admin | Upload a profile image |
| `PATCH` | `/api/users/password` | User/Admin | Change the current password |
| `GET` | `/api/users` | Admin | List users |
| `GET` | `/api/users/:id` | Admin | Get user details |
| `PATCH` | `/api/users/:id/status` | Admin | Activate or deactivate a user |

### Blogs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/blogs` | Public | List, search, and filter blogs |
| `GET` | `/api/blogs/:id` | Public | Get blog details |
| `POST` | `/api/blogs/create` | User/Admin | Create a blog |
| `PUT` | `/api/blogs/update/:id` | Owner/Admin | Update a blog |
| `DELETE` | `/api/blogs/:id` | Owner/Admin | Delete a blog |

Combined search example:

```http
GET /api/blogs?title=playwright&category=Testing
```

Protected requests send:

```http
Authorization: Bearer <token>
```

The included Postman collection is available at [`backend/Blog_assignment.postman_collection.json`](backend/Blog_assignment.postman_collection.json).

## Screenshots

### Public blog discovery

![Public blog cards with search and category filtering](<Major_Page _Screenshot/Screenshot 2026-09-11 020556.png>)

### User dashboard

![User dashboard](<Major_Page _Screenshot/Screenshot 2026-09-11 020627.png>)

### My Blogs

![User blog management table](<Major_Page _Screenshot/Screenshot 2026-09-11 020646.png>)

### Create Blog

![Create blog form](<Major_Page _Screenshot/Screenshot 2026-09-11 020733.png>)

### Profile and avatar

![Profile management](<Major_Page _Screenshot/Screenshot 2026-09-11 020752.png>)

### Change Password

![Change password form](<Major_Page _Screenshot/Screenshot 2026-09-11 020807.png>)

### Admin dashboard

![Admin dashboard](<Major_Page _Screenshot/admi_dashboard.png>)

### Admin user management

![Admin user-management table](<Major_Page _Screenshot/users_list.png>)

## Available Scripts

Backend:

```bash
npm run dev        # Start with nodemon
npm start          # Start with Node.js
npm run seed:admin # Create the configured admin account
```

Frontend:

```bash
npm run dev        # Start the Next.js development server
npm run build      # Create a production build
npm start          # Run the production build
npm run lint       # Run ESLint
```

## Notes for Production

- Set `NODE_ENV=production`.
- Replace all demonstration credentials and secrets.
- Remove `DEV_OTP` from the production environment.
- Restrict CORS to the deployed frontend origin.
- Use HTTPS and a production-ready database configuration.
- Store uploaded media in durable object storage when deploying to an ephemeral platform.

