# Task Manager

A full-stack task management application with role-based access control. Users can manage their own tasks while administrators have oversight of all users and their tasks.

## Features

- 🔐 User authentication (registration/login) with JWT tokens
- ✅ Personal task management (create, read, update, delete)
- 📊 Task status tracking (Pending, In Progress, Completed)
- 👥 Role-based access control (USER and ADMIN roles)
- 🎛️ Admin dashboard to view and manage all users' tasks
- 🎨 Modern responsive UI with dark theme

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **PostgreSQL**: Version 12 or higher

## Frontend Setup

### Tech Stack

- React 19 with TypeScript
- Vite (build tool and dev server)
- Redux Toolkit + RTK Query (state management and API)
- React Router v7 (routing)
- React Hook Form + Zod (form validation)
- Shadcn UI components (Tailwind CSS + Radix UI)

### Installation and Running

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Other Commands

```bash
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

## Backend Setup

### Tech Stack

- Node.js with Express 5
- TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- Bcrypt (password hashing)
- Zod (request validation)

### Installation and Running

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskdb"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

Replace `username` and `password` with your PostgreSQL credentials.

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

6. Start the development server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Other Commands

```bash
npm run build          # Build for production
npm start              # Start production server
npm run prisma:studio  # Open Prisma Studio (database GUI)
```

## Database Setup and Prisma Migrations

### PostgreSQL Installation

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu:**

```bash
sudo apt-get install postgresql
sudo service postgresql start
```

**Windows:** Help yourself to the [official PostgreSQL installer](https://www.postgresql.org/download/windows/).

### Create Database

```bash
# Using createdb command
createdb taskdb

# Or using psql
psql postgres
CREATE DATABASE taskdb;
\q
```

### Connect to PostgreSQL

Configure the `DATABASE_URL` in your `backend/.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskdb"
```

**Format explanation:**

- `username`: Your PostgreSQL username (default: `postgres`)
- `password`: Your PostgreSQL password
- `localhost:5432`: PostgreSQL host and port
- `taskdb`: Database name

### Prisma Migration Commands

```bash
# Generate Prisma client (run after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (visual database editor)
npm run prisma:studio

# View migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Database Schema

The application uses two main tables:

- **users**: id, email, password (hashed), role (USER/ADMIN), createdAt, updatedAt
- **tasks**: id, title, description, status (PENDING/IN_PROGRESS/COMPLETED), userId, createdAt, updatedAt

## Quick Start

1. **Set up PostgreSQL database:**

   ```bash
   createdb taskdb
   ```

2. **Set up backend:**

   ```bash
   cd backend
   npm install
   # Create .env file with DATABASE_URL and JWT_SECRET
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

3. **Set up frontend (in a new terminal):**

   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_URL
   npm run dev
   ```

4. **Access the application:**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

5. **Register your first user** at http://localhost:5173/register
