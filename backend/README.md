# Backend API

Express backend with TypeScript, Prisma ORM, Zod validation, and JWT authentication.

## Features

- User registration and login
- JWT-based authentication
- Protected routes middleware
- Role-based access control (ADMIN, USER)
- Password hashing with bcrypt
- Input validation with Zod
- PostgreSQL database with Prisma ORM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

3. Set up database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ email, password, confirmPassword }`
  - Returns: `{ success, message, data: { user, token } }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { user, token } }`

### Health Check

- `GET /health` - Server health check

## Protected Routes

To protect a route, use the `authenticate` middleware:

```typescript
import { authenticate } from './middleware/auth.middleware';

router.get('/protected', authenticate, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
