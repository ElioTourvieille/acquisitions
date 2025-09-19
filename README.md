# Acquisitions API

A Node.js Express application with Neon Database integration, dockerized for both development and production environments.

## 🏗️ Architecture

- **Backend**: Node.js with Express
- **Database**: Neon PostgreSQL (Cloud and Local)
- **ORM**: Drizzle ORM
- **Security**: Helmet, CORS, Arcjet
- **Logging**: Winston
- **Development**: Docker with Neon Local
- **Production**: Docker with Neon Cloud

## 🔧 Prerequisites

- Docker Desktop
- Docker Compose
- Neon account (for production and API keys)
- Node.js 22+ (for local development without Docker)

## 🚀 Quick Start

### Development Environment (with Neon Local)

1. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd acquisitions
   ```

2. **Configure environment variables**
   Copy the development environment template:
   ```bash
   cp .env.development .env
   ```
   
   Edit `.env` with your Neon credentials:
   ```env
   # Get these from your Neon Console
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   PARENT_BRANCH_ID=your_parent_branch_id_here
   
   # Other configurations
   ARCJET_KEY=your_arcjet_key_here
   JWT_SECRET=your_dev_jwt_secret_here
   ```

3. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - Database: postgres://neon:npg@localhost:5432/neondb

### Production Environment (with Neon Cloud)

1. **Configure production environment**
   Copy the production environment template:
   ```bash
   cp .env.production .env
   ```
   
   Edit `.env` with your production credentials:
   ```env
   # Your Neon Cloud database URL
   DATABASE_URL=postgres://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   # Production configurations
   ARCJET_KEY=your_production_arcjet_key
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Deploy production**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health

## 📚 Environment Configuration

### Development (.env.development)
- Uses **Neon Local** proxy for database connections
- Ephemeral database branches (created on start, deleted on stop)
- Debug logging enabled
- Self-signed certificate handling
- Hot reloading with volume mounts

### Production (.env.production)
- Uses **Neon Cloud** database directly
- Production-grade security settings
- Resource limits and health checks
- Structured logging
- Read-only filesystem

## 🗄️ Database Management

### Development Database
The development environment uses Neon Local, which:
- Creates ephemeral branches automatically
- Provides fresh database state on each startup
- Supports both Postgres and Neon serverless drivers
- Handles SSL certificates automatically

### Running Migrations
```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Database Studio (Development)
```bash
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## 🔍 Monitoring and Debugging

### View Logs
```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f app
```

### Health Checks
Both environments include health checks:
- Application health: GET `/health`
- Docker health checks run every 30 seconds
- Database connectivity verification

### Container Status
```bash
# Check container status
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.prod.yml ps
```

## 🛠️ Available Scripts

```bash
# Database operations
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio

# Development
npm run dev           # Start with file watching
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting
```

## 🔧 Docker Commands Reference

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Production
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# Update production deployment
docker-compose -f docker-compose.prod.yml up --build -d --force-recreate
```

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Arcjet**: Security and rate limiting
- **JWT**: Token-based authentication
- **Non-root Docker user**: Container security
- **Read-only filesystem**: Production hardening

## 📁 Project Structure

```
acquisitions/
├── src/
│   ├── app.js              # Express application
│   ├── index.js            # Application entry point
│   ├── server.js           # Server configuration
│   ├── config/
│   │   ├── database.js     # Database configuration
│   │   └── logger.js       # Winston logger
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Drizzle schema
│   └── routes/            # Express routes
├── drizzle/               # Database migrations
├── docker-compose.dev.yml  # Development Docker Compose
├── docker-compose.prod.yml # Production Docker Compose
├── Dockerfile             # Multi-stage Docker build
├── .env.development       # Development environment
├── .env.production        # Production environment
└── .env.example          # Environment template
```

## 🌿 Branch Management with Neon Local

Neon Local automatically manages database branches:

- **Ephemeral branches**: Created on container start, deleted on stop
- **Git integration**: Branches can be tied to Git branches
- **Branch persistence**: Configure with `DELETE_BRANCH=false`

### Git Branch Integration
```yaml
# In docker-compose.dev.yml
volumes:
  - ./.neon_local:/tmp/.neon_local
  - ./.git/HEAD:/tmp/.git/HEAD:ro
```

## ❌ Troubleshooting

### Common Issues

1. **Neon Local connection failed**
   ```bash
   # Check if Neon Local container is healthy
   docker-compose -f docker-compose.dev.yml ps
   
   # Check Neon Local logs
   docker-compose -f docker-compose.dev.yml logs neon-local
   ```

2. **SSL certificate issues**
   - Development: Certificates are handled automatically
   - Production: Ensure proper SSL configuration in Neon Cloud

3. **Environment variables not loaded**
   ```bash
   # Verify environment file
   docker-compose -f docker-compose.dev.yml config
   ```

4. **Port conflicts**
   ```bash
   # Check for port usage
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5432
   ```

### Getting Help

- Check Docker logs for detailed error messages
- Verify environment variables are correctly set
- Ensure Neon API credentials are valid
- Check network connectivity for Neon Cloud

## 🚢 Deployment

### Container Registry
```bash
# Build and tag for registry
docker build -t your-registry/acquisitions:latest .

# Push to registry
docker push your-registry/acquisitions:latest
```

### Environment-specific Deployments
- Use appropriate environment files
- Set proper resource limits
- Configure health checks
- Set up monitoring and logging

## 📄 License

ISC

---

For more information about Neon Local, visit: https://neon.com/docs/local/neon-local