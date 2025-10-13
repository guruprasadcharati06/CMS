# Backend Guide

- **Setup Commands**

  ```bash
  npm init -y
  npm install express mongoose cors dotenv bcryptjs jsonwebtoken morgan
  npm install -D nodemon eslint
  ```
- **Environment Variables**

  - `PORT`
  - `NODE_ENV`
  - `MONGO_URI`
  - `JWT_SECRET` *(generate securely, e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)*
- **Available Scripts**

  ```bash
  npm run dev
  npm start
  npm test # placeholder
  ```
- **Directory Structure**

  ```text
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
  ```
- **API Checklist**

  - [X] `GET /api/health`
  - [X] `POST /api/auth/login`
  - [X] `POST /api/auth/register`
  - [X] `GET /api/auth/me`
  - [X] Event routes (`/api/events` CRUD + approvals)
  - [X] Registration routes (`/api/registrations` register/cancel/check-in/feedback)
  - [X] Notification routes (`/api/notifications` list/update/delete)
- **Progress Tracker**

  - [X] Express server bootstrapped
  - [X] Mongo connection helper
  - [X] Health route
  - [X] Auth utilities (password hashing, JWT token)
  - [X] Auth middleware/controllers (JWT guard + role-based access)
  - [X] Core feature endpoints (events, registrations, notifications)
  - [X] Feedback + check-in flow tracked via registrations


# Implementation Priorities

* **Phase 1** (MVP):
  * Auth routes (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`) with JWT.
  * Event CRUD + public listing. Ensure admin approval endpoint.
  * Registration endpoints updating counts and creating basic notifications.
* **Phase 2** :
* Notification listing for users and optional push integration.
* Feedback submission endpoint and UI.
* Organizer analytics (registration counts, upcoming events).
* **Phase 3** :
* Extra uniqueness features (QR check-in, scheduling conflict detection, etc.).
