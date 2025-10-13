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

  - [x] `GET /api/health`
  - [ ] `POST /api/auth/login`
  - [ ] `POST /api/auth/register`
  - [ ] Feature-specific routes (pending prompt)

- **Progress Tracker**

  - [x] Express server bootstrapped
  - [x] Mongo connection helper
  - [x] Health route
  - [ ] Auth middleware/controllers
  - [ ] Core feature endpoints
