# Hackathon Project Overview

- **Stack**
  - Frontend: React 19, Vite, Tailwind CSS
  - Backend: Express, MongoDB (Mongoose)
  - Tooling: Nodemon, ESLint, Vitest (planned)

- **Quick Start**
  - Backend:

    ```bash
    cd backend
    npm install
    npm run dev
    ```

  - Frontend:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

- **Environment Variables**
  - Backend: `PORT`, `NODE_ENV`, `MONGO_URI`
  - Frontend: `VITE_API_URL`

- **Directory Structure**
  - `frontend/` – React app source and UI assets
  - `backend/` – Express API and MongoDB connectors
  - `docs/` *(optional)* – design notes, API specs (create as needed)

- **Progress Tracker**
  - [x] Frontend scaffolded with Vite + Tailwind
  - [x] Backend scaffolded with Express + Mongo connection
  - [x] Health check endpoint `/api/health`
  - [ ] Auth flows
  - [ ] Core feature pages/components
  - [ ] Deployment setup (Docker/Hosting)

- **Workflow Tips**
  - Use `frontend/README.md` & `backend/Readme.md` for detailed steps.
  - Keep feature notes and API contracts updated as problem statement arrives.
