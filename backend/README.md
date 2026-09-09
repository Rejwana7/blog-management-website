# Blog Management API

A REST API for a Blog Management Application with three access levels — **Admin**, **User**, and **Guest** — supporting authentication, user management, blog management, role-based authorization, validation, and public blog search/filtering.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL + Sequelize ORM
- **Authentication:** Token-based (JWT)
- **API Testing:** Postman

## Features

- JWT-based authentication and role-based authorization (Admin / User / Guest)
- Secure password hashing — plain-text passwords are never stored or returned
- User registration, login, profile management, and password updates
- Full blog CRUD with ownership rules (users manage their own blogs, admins manage all)
- Public blog browsing, search by title, and filter by category (combinable)
- Admin-only user management (list users, get by ID, activate/deactivate accounts)
- Input validation and consistent, meaningful error responses
- Appropriate HTTP status codes across all endpoints

## Database Schema

**Database name:** `blogdb`

### `users`

| Column | Description |
|---|---|
| `id` | Primary key |
| `firstname` | User's first name |
| `lastname` | User's last name |
| `email` | User's unique email |
| `password` | Hashed password |
| `isActive` | Default: `true` |
| `role` | Default: `user` |
| `createAt` | Record creation time |
| `updateAt` | Record update time |

> An admin account is a regular user whose `role` is manually set to `admin`.

### `blogs`

| Column | Description |
|---|---|
| `id` | Primary key |
| `userId` | ID of the blog owner (references `users.id`) |
| `blogTitle` | Blog title |
| `blog` | Blog content |
| `category` | Blog category |
| `createAt` | Record creation time |
| `updateAt` | Record update time |

## API Endpoints

| # | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public | Register a new user |
| 2 | POST | `/api/auth/login` | Public | Login and receive an authentication token |
| 3 | GET | `/api/users` | Admin | Get all users |
| 4 | GET | `/api/users/:id` | Admin | Get a specific user |
| 5 | PATCH | `/api/users/:id/status` | Admin | Activate/deactivate a user |
| 6 | GET | `/api/users/profile` | User/Admin | Get own profile |
| 7 | PUT | `/api/users/profile/update` | User/Admin | Update own profile |
| 8 | PATCH | `/api/users/password` | User/Admin | Update own password |
| 9 | POST | `/api/blogs/create` | User/Admin | Create a blog |
| 10 | GET | `/api/blogs` | Public | Get blog list / search / filter |
| 11 | GET | `/api/blogs/:id` | Public | Get a specific blog |
| 12 | PUT | `/api/blogs/update/:id` | User/Admin | Update a blog (own blog, or any blog as admin) |
| 13 | DELETE | `/api/blogs/:id` | User/Admin | Delete a blog (own blog, or any blog as admin) |

### Role Permission Matrix

| Action | Guest | User | Admin |
|---|:---:|:---:|:---:|
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| View all blogs | ✅ | ✅ | ✅ |
| View blog by ID | ✅ | ✅ | ✅ |
| Search blog by title | ✅ | ✅ | ✅ |
| Filter blog by category | ✅ | ✅ | ✅ |
| Create blog | ❌ | ✅ | ✅ |
| Update own blog | ❌ | ✅ | ✅ |
| Update another user's blog | ❌ | ❌ | ✅ |
| Delete own blog | ❌ | ✅ | ✅ |
| Delete another user's blog | ❌ | ❌ | ✅ |
| View own profile | ❌ | ✅ | ✅ |
| Update own profile | ❌ | ✅ | ✅ |
| Update own password | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| View user by ID | ❌ | ❌ | ✅ |
| Activate/deactivate users | ❌ | ❌ | ✅ |

## Validation Rules

- Required fields cannot be empty
- Email must be in a valid format and unique
- Password must meet a minimum length requirement
- Blog title and blog content cannot be empty
- Invalid IDs return `400 Bad Request`
- Missing users or blogs return `404 Not Found`
- Unauthorized requests return `401 Unauthorized`
- Forbidden operations return `403 Forbidden`



## HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)

### Installation

```bash
git clone <your-repository-url>
cd <project-folder>
npm install
```

### Environment Variables

Create a `.env` file in the project root (this file is git-ignored and must not be committed):

```
PORT=5000
DATABASE_URL=<your-database-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### Running the Server

```bash
npm start
```

The API will be available at `http://localhost:5000`.


## Project Structure

```
.
├── config/                            # Database & app configuration
├── controller/                        # Request handlers (auth, users, blogs)
├── middleware/                        # Auth & role-based access middleware
├── models/                            # Sequelize models (user, blogs)
├── routes/                            # Express route definitions (auth, user, blogs)
├── services/                          # Business logic / database queries
├── utils/                             # Validators and helper functions (auth.validators.js, generatetoken.js)
├── app.js                             # Express app setup
├── server.js                          # Server entry point
├── Blog_assignment.postman_collection.json   # Postman collection
├── .env                               # Environment variables (git-ignored)
├── .gitignore
└── README.md
```



## API Testing — Postman

A complete Postman collection covering all endpoints above (Admin, User, and Guest flows) is included in this repository.

- **Postman Collection:** [`Blog_assignment.postman_collection.json`](./Blog_assignment.postman_collection.json)

-**Postman Documentation:** [View Documentation](https://documenter.getpostman.com/view/57045785/2sBYAuTXQL)

### Importing the collection

1. Open Postman → **Import** → select the `.json` collection file
2. Set the `baseUrl` collection variable to your running server URL (e.g. `http://localhost:5000`)
3. Run **Auth → Register/Login** requests first to populate the auth tokens used by the rest of the collection
4. Use the **Collection Runner** to execute the full test suite in sequence

