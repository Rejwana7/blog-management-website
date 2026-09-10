# Blog Management Frontend Implementation Plan

## Goal

Build a complete, responsive Blog Management Application with Next.js App Router and Tailwind CSS. All users, blogs, authentication, and profile data must come from the provided REST API—no mock data, hardcoded records, direct database access, or frontend-only authorization.

## Recommended Frontend Stack

- Next.js App Router
- JavaScript/JSX (use TypeScript only if the project is initialized with it)
- Tailwind CSS
- React Context for authentication state
- A reusable `fetch`-based API client
- React Hook Form + Zod for forms and client validation
- Sonner or React Hot Toast for feedback
- Vitest + React Testing Library for component tests
- Playwright for critical user journeys

## Phase 0 — Verify and Complete the Backend Contract

The current backend does not yet match every endpoint in the assignment. Resolve these items before building dependent frontend screens.

- [ ] Standardize the auth routes. The assignment requires `/api/auth/register` and `/api/auth/login`, but the current app exposes `/auth/register` and `/auth/login`.
- [ ] Standardize blog deletion. The assignment says `DELETE /api/blogs/delete/:id`, while the current backend exposes `DELETE /api/blogs/:id`. Select one contract and document it.
- [ ] Implement `POST /api/auth/forgot-password`.
- [ ] Implement `PATCH /api/auth/reset-password/:token` and the reset-token/email flow.
- [ ] Implement `PATCH /api/users/profile/image` with `multipart/form-data`, file validation, storage, and a profile-image field/URL returned in user and author responses.
- [ ] Enable and configure CORS for the frontend origin, including the `Authorization` header.
- [ ] Fix password validation. The current validator accepts passwords with a maximum of 8 characters, while the assignment calls for a minimum length. Define one minimum-length rule and use it consistently.
- [ ] Decide whether profile email is editable. The current API requires and updates email, while the assignment permits a read-only email.
- [ ] Confirm every success/error response shape, especially login (`data.token` and `data.data`), paginated users, and blog author objects.
- [ ] Update the Postman collection and backend README after the contract is finalized.

**Exit criteria:** Every required endpoint is callable from Postman, returns a consistent `{ message, data }` response, enforces backend authorization, and supports the frontend origin.

## Phase 1 — Initialize the Frontend and Define Conventions

- [ ] Create a Next.js application inside `frontend/` with App Router and Tailwind CSS.
- [ ] Add `.env.local.example` containing `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` (adjust after Phase 0).
- [ ] Configure linting, formatting, import aliases, and package scripts.
- [ ] Establish folders for `app`, `components`, `contexts`, `services`, `hooks`, `lib`, and `types` or `schemas`.
- [ ] Define shared colors, typography, spacing, focus styles, buttons, inputs, cards, tables, and responsive breakpoints.
- [ ] Add a default avatar asset and application logo/name.
- [ ] Document local setup commands in the root or frontend README.

**Exit criteria:** The frontend starts locally, Tailwind styles render, linting passes, and the API base URL comes only from environment configuration.

## Phase 2 — Build the API and Authentication Foundation

- [ ] Create one API client that builds URLs, serializes JSON, handles `FormData`, parses responses, and converts backend failures into safe user-facing errors.
- [ ] Create `auth.service`, `user.service`, and `blog.service`; pages must not repeat request logic.
- [ ] Attach `Authorization: Bearer <token>` to protected requests.
- [ ] Create `AuthContext` with `user`, `token`, `isAuthenticated`, `isLoading`, `login`, `logout`, `refreshProfile`, and `updateUser`.
- [ ] Restore a session after refresh by loading the saved token and calling `GET /api/users/profile`.
- [ ] On invalid/expired-token `401`, clear the session and redirect to `/login`.
- [ ] Treat `403` as an authorization error without exposing raw exceptions.
- [ ] Choose and document token storage. If constrained to the existing bearer-token backend, use browser storage carefully; an HTTP-only cookie/BFF approach is preferred if backend changes are allowed.
- [ ] Add reusable protected-route and admin-route guards. Menu visibility alone must never be the authorization mechanism.

**Exit criteria:** Login state survives refresh when valid, expired sessions are removed, and normal users cannot render admin pages.

## Phase 3 — Create Shared Layouts and UI Components

- [ ] Build a public layout with navbar, main content, and footer.
- [ ] Build an authenticated dashboard layout with fixed navbar, responsive sidebar/drawer, and main content.
- [ ] Create `Navbar`, `Sidebar`, `ProfileMenu`, `BlogCard`, `BlogForm`, `SearchBar`, `CategoryFilter`, `Loader/Skeleton`, `EmptyState`, and `ConfirmDialog`.
- [ ] Show Login/Register to guests and avatar/name/profile menu to authenticated users.
- [ ] Render user/admin sidebar items based on role and clearly mark the active route.
- [ ] Add reusable toast/alert, form-field error, page error, and not-found presentations.
- [ ] Ensure keyboard navigation, visible focus, semantic labels, dialog focus handling, and adequate color contrast.

**Exit criteria:** Public and dashboard shells work on desktop, tablet, and mobile, including a usable mobile sidebar and navbar.

## Phase 4 — Implement Public Blog Browsing

- [ ] Build `/` and load real data with `GET /api/blogs`.
- [ ] Display title, category, preview, author name/image, created date, and Read More on each card.
- [ ] Search with `GET /api/blogs?title=<value>`; debounce typing and URL-encode values.
- [ ] Filter with `GET /api/blogs?category=<value>`.
- [ ] Combine title and category in the same request when both are set.
- [ ] Keep filters in URL search parameters so refresh/back navigation preserves them.
- [ ] Add loading skeletons, request errors, retry, and “No blogs found” state.
- [ ] Build `/blogs/[id]` using `GET /api/blogs/:id` and show the full article and author details.
- [ ] Show a friendly Blog Not Found state for backend `404` responses.

**Exit criteria:** Guests can browse, search, filter, combine filters, and open a blog without authentication or static data.

## Phase 5 — Implement Registration, Login, and Password Recovery

- [ ] Build `/register` with first name, last name, email, password, and password confirmation.
- [ ] Validate required fields, email format, agreed password length, and matching confirmation.
- [ ] Call `POST /api/auth/register`, show backend validation/conflict messages, then redirect to `/login` on success.
- [ ] Build `/login` with email, password, and Forgot Password link.
- [ ] Call `POST /api/auth/login`, save the token, load the profile, and redirect to `/dashboard`.
- [ ] Preserve a safe intended destination when a user is redirected to login from a protected route.
- [ ] Build `/forgot-password` and call `POST /api/auth/forgot-password`.
- [ ] Build `/reset-password/[token]`, validate matching passwords, and call `PATCH /api/auth/reset-password/:token`.
- [ ] After a successful reset, show confirmation and redirect to `/login`.
- [ ] Disable submit buttons while pending and prevent duplicate submissions.

**Exit criteria:** Registration, login, forgotten-password, reset-password, backend-error, and deactivated-account flows all work end to end.

## Phase 6 — Implement the Dashboard and Blog Management

- [ ] Build `/dashboard` with a personalized welcome, total blog count, profile summary, recent blogs, and Create Blog shortcut using available API data.
- [ ] Build `/dashboard/blogs` as a responsive table/card view.
- [ ] For a normal user, show/manage only records whose `userId` matches the logged-in user; for an admin, show/manage all blogs.
- [ ] Build `/dashboard/blogs/create` with title, category, and content.
- [ ] Call `POST /api/blogs/create` without sending `userId`.
- [ ] Build `/dashboard/blogs/[id]/edit`, load existing data with `GET /api/blogs/:id`, and submit to `PUT /api/blogs/update/:id`.
- [ ] Prevent a normal user from opening edit controls for another user's blog while still respecting backend `403` responses.
- [ ] Add a confirmation dialog before deletion and call the finalized delete endpoint from Phase 0.
- [ ] Refresh or optimistically update the list after create/update/delete and show success/error feedback.
- [ ] Handle empty blog lists, missing blogs, loading states, and unauthorized ownership operations.

**Exit criteria:** Users can create and manage only their blogs; admins can manage all blogs; all ownership checks are enforced by the backend.

## Phase 7 — Implement Profile and Password Management

- [ ] Build `/dashboard/profile` and load `GET /api/users/profile`.
- [ ] Display avatar, first name, last name, email, and role.
- [ ] Add profile editing for only the fields supported by the finalized contract; never expose role or status controls.
- [ ] Submit profile changes with `PUT /api/users/profile/update` and immediately update shared auth state.
- [ ] Validate image type and size before uploading.
- [ ] Upload the `image` field as `multipart/form-data` to `PATCH /api/users/profile/image`.
- [ ] After upload, refresh shared profile state so both the profile page and navbar avatar change immediately.
- [ ] Build `/dashboard/change-password` and call `PATCH /api/users/password` with `{ password }` after confirmation validation.
- [ ] Clear sensitive form fields after success.

**Exit criteria:** Profile details and avatar stay synchronized across the app, and users can change their password without exposing sensitive data.

## Phase 8 — Implement Admin User Management

- [ ] Build `/admin/users` behind both authentication and admin-role guards.
- [ ] Load paginated users with `GET /api/users?page=<page>&limit=<limit>`.
- [ ] Display name, email, role, status, created date, and actions with responsive table/card behavior.
- [ ] Add user-detail view or dialog using `GET /api/users/:id`.
- [ ] Activate/deactivate via `PATCH /api/users/:id/status` with `{ isActive }`.
- [ ] Update the affected row immediately after success and roll back/show an error if the request fails.
- [ ] Add loading, pagination, empty, not-found, and forbidden states.
- [ ] Redirect normal users to `/dashboard` or show Access Denied, while still treating backend `403` as authoritative.

**Exit criteria:** Only admins can list, inspect, activate, or deactivate users, and the UI stays consistent with the server response.

## Phase 9 — Harden UX, Responsiveness, and Accessibility

- [ ] Review every API-backed page for initial loading, action loading, empty, success, retryable error, `401`, `403`, and `404` states.
- [ ] Ensure action buttons cannot be submitted twice and destructive actions require confirmation.
- [ ] Convert raw backend or JavaScript errors into clear messages while preserving useful server messages.
- [ ] Verify layouts at common mobile, tablet, laptop, and wide-screen widths.
- [ ] Ensure tables have mobile alternatives, forms never overflow, and long blog content wraps safely.
- [ ] Add image fallbacks for missing or failed avatars.
- [ ] Check headings, labels, landmarks, alt text, keyboard access, focus order, and reduced-motion behavior.

**Exit criteria:** Every required page remains usable without a mouse and across supported screen sizes, with no raw exceptions shown to users.

## Phase 10 — Test the Application

- [ ] Unit-test validation schemas, API error normalization, auth helpers, role checks, and date/preview utilities.
- [ ] Component-test forms, protected/admin guards, loading/empty/error states, profile menu, and confirmation dialog.
- [ ] Add Playwright tests for the guest journey: browse → search/filter → open blog.
- [ ] Add Playwright tests for registration/login and session restoration.
- [ ] Add Playwright tests for user blog create → edit → delete.
- [ ] Add Playwright tests for profile update, avatar upload, change password, logout, forgot password, and reset password.
- [ ] Add Playwright tests for admin user management and admin management of another user's blog.
- [ ] Test negative cases: invalid login, deactivated account, expired token, normal user on admin URL, editing another user's blog, missing blog, and failed network request.
- [ ] Run lint, tests, and production build.

**Exit criteria:** Critical journeys pass against the real test backend and `npm run build` completes without errors.

## Phase 11 — Final Review and Delivery

- [ ] Verify every required page and endpoint against the assignment checklist.
- [ ] Confirm there is no fake data, hardcoded user/blog list, direct database access, password logging, or `userId` in create-blog requests.
- [ ] Confirm secrets and real environment files are ignored by Git.
- [ ] Add a README with prerequisites, environment variables, install/run commands, test commands, role setup, and known limitations.
- [ ] Document how an admin account is provisioned for evaluation.
- [ ] Test a clean installation of backend and frontend.
- [ ] Perform a final desktop/mobile walkthrough of guest, user, password recovery, and admin journeys.

**Exit criteria:** A new evaluator can configure and run both apps from the documentation and complete all required journeys.

## Suggested Frontend Structure

```text
frontend/
├── app/
│   ├── (public)/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── blogs/[id]/page.jsx
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   ├── forgot-password/page.jsx
│   │   └── reset-password/[token]/page.jsx
│   ├── dashboard/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── blogs/page.jsx
│   │   ├── blogs/create/page.jsx
│   │   ├── blogs/[id]/edit/page.jsx
│   │   ├── profile/page.jsx
│   │   └── change-password/page.jsx
│   ├── admin/users/page.jsx
│   ├── layout.jsx
│   ├── loading.jsx
│   ├── error.jsx
│   └── not-found.jsx
├── components/
│   ├── layout/
│   ├── auth/
│   ├── blogs/
│   ├── users/
│   ├── forms/
│   └── ui/
├── contexts/AuthContext.jsx
├── hooks/
├── services/
│   ├── auth.service.js
│   ├── blog.service.js
│   └── user.service.js
├── lib/
│   ├── api.js
│   ├── auth-storage.js
│   └── utils.js
├── schemas/
├── public/
└── tests/
```

## Required API Checklist

| Method | Endpoint | Main frontend consumer |
|---|---|---|
| POST | `/api/auth/register` | Register page |
| POST | `/api/auth/login` | Login page/AuthContext |
| POST | `/api/auth/forgot-password` | Forgot Password page |
| PATCH | `/api/auth/reset-password/:token` | Reset Password page |
| GET | `/api/users` | Admin Users page |
| GET | `/api/users/:id` | Admin user details |
| PATCH | `/api/users/:id/status` | Admin status action |
| GET | `/api/users/profile` | Auth restore, navbar, profile |
| PUT | `/api/users/profile/update` | Profile form |
| PATCH | `/api/users/profile/image` | Avatar uploader |
| PATCH | `/api/users/password` | Change Password page |
| POST | `/api/blogs/create` | Create Blog page |
| GET | `/api/blogs` | Homepage, dashboard, blog lists |
| GET | `/api/blogs/:id` | Details and Edit pages |
| PUT | `/api/blogs/update/:id` | Edit Blog page |
| DELETE | Finalized in Phase 0 | Blog delete action |

## Definition of Done

- [ ] All required routes exist with correct guest/user/admin access.
- [ ] All required APIs are integrated with real backend data.
- [ ] Authentication survives refresh and clears correctly on logout or invalid token.
- [ ] Backend `401`, `403`, `404`, validation, and conflict responses are handled clearly.
- [ ] Navbar avatar updates immediately after image upload.
- [ ] Normal users manage only their blogs; admins manage users and all blogs.
- [ ] Loading, empty, confirmation, success, and error states are implemented.
- [ ] The application is responsive and keyboard-accessible.
- [ ] Lint, automated tests, and production build pass.
- [ ] Setup and usage documentation is complete.

## Notes for Production

- Set `NODE_ENV=production`.
- Replace all demonstration credentials and secrets.
- Remove `DEV_OTP` from the production environment.
- Restrict CORS to the deployed frontend origin.
- Use HTTPS and a production-ready database configuration.
- Store uploaded media in durable object storage when deploying to an ephemeral platform.
