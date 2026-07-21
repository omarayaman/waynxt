# Waynxt - Frontend Web Application

Welcome to the **Waynxt** frontend repository! This is a modern web application built using Next.js, React, and Tailwind CSS. 

This README provides all the necessary details to understand the architecture, technologies used, and how to start contributing to the frontend.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Validation**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: [Google OAuth](https://react-oauth.vercel.app/)
- **Carousels**: [Embla Carousel](https://www.embla-carousel.com/)
- **Markdown Parsing**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

Our codebase is organized inside the `src` directory to ensure modularity and scalability:

- **`src/app/`**: Contains the Next.js App Router pages and layouts. (e.g., the `ask` page).
- **`src/components/`**: Reusable UI components. They should be modular and independent.
- **`src/hooks/`**: Custom React hooks for shared logic.
- **`src/lib/`**: Utility functions, helpers, and configuration files.
- **`src/providers/`**: Global context providers.
- **`src/services/`**: API integration files using Axios to communicate with the backend.
- **`src/store/`**: Global state management stores built with Zustand.
- **`src/types/`**: TypeScript type definitions and interfaces.

## 🛠️ Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Frontend Developer Onboarding

Welcome to the frontend team! Here are some important guidelines and notes to help you get up to speed with the project:

### 1. Folder Structure Guidelines
- **New Pages:** Any new page (such as the `ask` page we recently created) should be placed inside the `src/app` directory following the Next.js App Router conventions.
- **Components:** Please keep UI components modular. Break them down into smaller pieces and reuse them from the `src/components` directory.
- **State Management:** We use `Zustand` for global state management. All global stores should be defined in the `src/store` directory.
- **API Integration:** All communication with the backend is handled via `Axios`. API configurations and endpoint functions should be placed in the `src/services` directory.
- **Typing:** We strictly use TypeScript. Place any shared or global interfaces/types in `src/types`.

### 2. Styling & Animations
- We use **Tailwind CSS** for styling. Please stick to Tailwind's utility classes and avoid writing custom external CSS unless absolutely necessary.
- For smooth and interactive component animations, we utilize **Framer Motion**. You can check existing interactive components for usage examples.
- For icons, we use the **Lucide React** library.

### 3. Data Validation
- We use **Zod** for schema validation (both for forms and API responses).

### 4. General Workflow
1. Always pull the latest changes from the main branch before starting your work to avoid conflicts.
2. Create a new branch for the feature or fix you are working on.
3. Make sure to run `npm run lint` to format the code and catch any linting errors before committing your changes.

Happy coding! 🚀
