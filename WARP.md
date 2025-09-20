# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Local Development (without Docker)

```bash
npm run dev              # Start with file watching (--watch flag)
npm start               # Start production mode
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting
```

### Database Management

```bash
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Apply migrations to database
npm run db:studio       # Open Drizzle Studio (development)
```

### Docker Development Environment

```bash
# Start development with Neon Local (ephemeral database branches)
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down

# Database operations in Docker
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Docker Production Environment

```bash
# Deploy production with Neon Cloud database
docker-compose -f docker-compose.prod.yml up --build -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f app

# Stop production
docker-compose -f docker-compose.prod.yml down
```

### Environment Scripts

```bash
# Use helper scripts (requires bash/sh)
sh ./scripts/dev.sh     # Complete development setup
sh ./scripts/prod.sh    # Complete production deployment
```

## Architecture Overview

### Application Structure

This is a **Node.js Express API** with a **layered architecture**:

- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Security**: Arcjet (bot detection, rate limiting, shield), Helmet, CORS
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Logging**: Winston with structured JSON logging

### Directory Structure & Import Aliases

The project uses ES modules with custom import aliases defined in `package.json`:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#models/*` → `./src/models/*`
- `#middleware/*` → `./src/middleware/*`
- `#routes/*` → `./src/routes/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`
- `#services/*` → `./src/services/*`

### Database Architecture

- **ORM**: Drizzle ORM with Neon serverless driver
- **Development**: Uses Neon Local proxy with ephemeral branches
- **Production**: Direct connection to Neon Cloud
- **Models**: Currently has `users` table with roles (admin, user)
- **Migrations**: Generated in `/drizzle` directory

### Security Layer

Multi-layered security implemented via Arcjet middleware:

- **Rate limiting**: Role-based (admin: 20/min, user: 10/min, guest: 5/min)
- **Bot detection**: Blocks automated requests, allows search engines/previews
- **Shield**: General security protection
- **Authentication**: JWT with HTTP-only cookies, role-based authorization

### API Structure

- **Authentication routes**: `/api/auth` (sign-up, sign-in, sign-out)
- **User routes**: `/api/users` (CRUD operations)
- **Health check**: `/health` endpoint with uptime metrics
- **Request validation**: Zod schemas with custom error formatting

## Development Environment Details

### Two Development Modes

**Docker Development (Recommended)**:

- Uses Neon Local proxy container for database
- Creates ephemeral database branches automatically
- Hot reload with volume mounting
- Complete environment isolation
- Requires: `.env.development` with Neon API credentials

**Local Development**:

- Runs directly on host machine
- Connects to remote database
- Requires Node.js 18+ and environment setup

### Environment Configuration

**Development** (`.env.development`):

- NODE_ENV=development
- DATABASE_URL points to neon-local container
- Requires NEON_API_KEY, NEON_PROJECT_ID, PARENT_BRANCH_ID
- Debug logging enabled

**Production** (`.env.production`):

- NODE_ENV=production
- DATABASE_URL points directly to Neon Cloud
- Production-grade resource limits and security

### Database Development Workflow

1. **Schema changes**: Modify files in `src/models/`
2. **Generate migration**: `npm run db:generate`
3. **Apply migration**: `npm run db:migrate`
4. **Inspect database**: `npm run db:studio`

## Key Implementation Patterns

### Error Handling

- Controllers use try/catch with `next(error)` for error middleware
- Services throw descriptive errors that controllers catch and transform
- Validation errors are formatted using Zod with custom error formatting

### Authentication Flow

1. User submits credentials to `/api/auth/sign-in`
2. Service validates against database with bcrypt
3. JWT token generated and set as HTTP-only cookie
4. `authenticateToken` middleware verifies JWT on protected routes
5. `requireRole` middleware enforces role-based access

### Request Processing Pipeline

1. **Security middleware** (rate limiting, bot detection)
2. **Authentication middleware** (JWT verification)
3. **Route-specific middleware** (role checks)
4. **Request validation** (Zod schemas)
5. **Business logic** (services)
6. **Database operations** (Drizzle ORM)

### Docker Multi-Stage Architecture

- **Base stage**: Production dependencies only
- **Development stage**: Includes dev dependencies, volume mounting
- **Production stage**: Optimized build with security hardening

## Testing & Quality

### Code Quality Tools

- **ESLint**: Configured with modern JavaScript standards
- **Prettier**: Code formatting with Unix line endings
- **Import paths**: Use alias imports (e.g., `#config/logger.js`)
- **ES Modules**: Strict ES module usage throughout

### Development Standards

- **Logging**: Use Winston logger, not console.log
- **Validation**: All input validation through Zod schemas
- **Security**: Never expose sensitive data in API responses
- **Database**: Use Drizzle query builder, avoid raw SQL
- **Error handling**: Consistent error responses with proper HTTP status codes
