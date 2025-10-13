# Frontend Guide

- **Setup Commands**

  ```bash
  npm create vite@latest frontend -- --template react
  cd frontend
  npm install
  npm install -D tailwindcss @tailwindcss/vite
  npm install react-router-dom axios clsx
  npm install react-hot-toast react-icons
  ```

- **Available Scripts**

  ```bash
  npm run dev
  npm run build
  npm run lint
  npm run preview
  ```

- **Environment Variables**

  `VITE_API_URL` – Backend base URL (default `http://localhost:3000/api`).

- **Folder Structure**

  ```text
  src/
    components/
    features/
    hooks/
    services/
    store/
    utils/
  ```

- **Key Dependencies**

  `react-router-dom`, `axios`, `clsx`, `react-hot-toast`, `react-icons`.

- **Next Add-ons (Optional)**

  `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `framer-motion`.

- **Progress Tracker**

  - [x] Vite + Tailwind scaffolded
  - [x] Core routing/API helpers installed
  - [ ] Layout + navigation shell
  - [ ] Feature pages once prompt arrives
