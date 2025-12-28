# Task Manager Frontend

A modern React frontend for the Task Manager API built with TypeScript, Redux Toolkit, and Shadcn UI.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit + RTK Query** - State management and API calls
- **React Router v6** - Client-side routing
- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **Shadcn UI** - Component library (Tailwind CSS + Radix UI)
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## Features

- **Authentication** - Login and registration with JWT tokens
- **Protected Routes** - Automatic redirect for unauthenticated users
- **Task Management** - Create, read, update, and delete tasks
- **Status Filtering** - Filter tasks by status (Pending, In Progress, Completed)
- **Toast Notifications** - Different toast styles for success, error, info, and warning
- **Responsive Design** - Works on mobile and desktop
- **Dark Theme** - Modern dark UI with purple accents

## Project Structure

```
src/
├── app/                  # Redux store configuration
│   ├── hooks.ts          # Typed Redux hooks
│   └── store.ts          # Store setup
├── components/
│   ├── layout/           # Layout components (Header)
│   ├── tasks/            # Task-related components
│   └── ui/               # Shadcn UI components
├── features/
│   ├── api/              # RTK Query base API
│   ├── auth/             # Auth slice and API
│   └── tasks/            # Tasks API
├── pages/                # Route pages
├── schemas/              # Zod validation schemas
├── types/                # TypeScript types
├── App.tsx               # Router setup
└── main.tsx              # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Toast Notifications

The app uses different toast styles for different actions:

- **Success (green)** - Task created, updated, deleted, login success
- **Error (red)** - Validation errors, API failures, unauthorized
- **Info (blue)** - Informational messages (e.g., logout)
- **Warning (yellow)** - Warnings and alerts
