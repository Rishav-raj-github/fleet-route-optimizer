# 🚀 Local Development Setup Guide

## 📋 Prerequisites

Before running Fleet Route Optimizer locally, make sure you have these installed:

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 13+** - [Download here](https://www.postgresql.org/download/)
- **Redis 6+** - [Download here](https://redis.io/download/)
- **Git** - [Download here](https://git-scm.com/)

### Optional (Recommended)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)

## 🔧 Option 1: Docker Setup (Recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/vkondepati/fleet-route-optimizer.git
cd fleet-route-optimizer
```

### Step 2: Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file with your preferred editor
# On Windows:
notepad .env
# On macOS/Linux:
nano .env
```

### Step 3: Configure Environment Variables
Add these to your `.env` file:
```env
# Application
NODE_ENV=development
PORT=3000
API_PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_optimizer
DB_USER=postgres
DB_PASSWORD=your_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Map Configuration
LEAFLET_ACCESS_TOKEN=your_mapbox_token_here
```

### Step 4: Start with Docker Compose
```bash
# Start all services (database, redis, api, web)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 5: Access the Application
- **Web Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:3001/docs
- **API Health Check**: http://localhost:3001/health

## 🛠️ Option 2: Manual Setup (Local Development)

### Step 1: Clone and Install Dependencies
```bash
# Clone repository
git clone https://github.com/vkondepati/fleet-route-optimizer.git
cd fleet-route-optimizer

# Install dependencies
npm install
```

### Step 2: Set Up PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE fleet_optimizer;
CREATE USER fleet_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fleet_optimizer TO fleet_user;

-- Enable PostGIS extension
\c fleet_optimizer
CREATE EXTENSION postgis;
```

### Step 3: Set Up Redis
```bash
# On Windows (using Redis installer)
# Start Redis service from Services.msc

# On macOS (using Homebrew)
brew install redis
brew services start redis

# On Ubuntu/Linux
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Step 4: Configure Environment
Create `.env` file with your local configuration:
```env
NODE_ENV=development
PORT=3000
API_PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_optimizer
DB_USER=fleet_user
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-local-development-secret
```

### Step 5: Initialize Database
```bash
# Run database migrations
npm run db:setup

# Seed with sample data
npm run db:seed
```

### Step 6: Start Development Servers
```bash
# Start both API and web servers
npm run dev

# Or start them separately:
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Web Server
npm run dev:web
```

### Step 7: Access Your Application
- **Web Dashboard**: http://localhost:3000
- **API Server**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs

## 🧪 Verify Installation

### Check API Health
```bash
# Test API health endpoint
curl http://localhost:3001/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "dependencies": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### Test Route Optimization
```bash
# Test VRP solver endpoint
curl -X POST http://localhost:3001/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "vehicles": [
      {"id": "truck1", "capacity": 1000, "location": [0, 0]}
    ],
    "deliveries": [
      {"id": "delivery1", "location": [1, 1], "demand": 100}
    ]
  }'
```

### Run Tests
```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running
- Check connection details in `.env`
- Verify database exists and user has permissions

#### Redis Connection Error
```bash
Error: Redis connection failed
```
**Solution:**
- Start Redis service
- Check Redis is running: `redis-cli ping`
- Verify Redis configuration in `.env`

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Or change port in .env file
PORT=3002
```

#### Node.js Version Error
```bash
Error: Node.js version 16.x.x is not supported
```
**Solution:**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Or use Node Version Manager (nvm):
```bash
# Install and use Node 18
nvm install 18
nvm use 18
```

### Performance Issues

#### Slow Database Queries
```sql
-- Check database performance
SELECT * FROM pg_stat_activity;

-- Add indexes for better performance
CREATE INDEX idx_vehicles_location ON vehicles USING GIST(current_location);
```

#### High Memory Usage
```bash
# Monitor memory usage
# Windows
tasklist /fi "imagename eq node.exe"

# macOS/Linux
ps aux | grep node

# Increase Node.js memory if needed
node --max-old-space-size=4096 server.js
```

## 📊 Development Tools

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- GitLens
- Thunder Client (API testing)

### Useful Commands
```bash
# Development
npm run dev          # Start both API and web servers
npm run build        # Build for production
npm run typecheck    # Check TypeScript types
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Database
npm run db:setup     # Initialize database
npm run db:migrate   # Run migrations
npm run db:seed      # Add sample data
npm run db:reset     # Reset database

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs -f  # View logs
```

## 🎯 Next Steps

Once you have the application running:

1. **Explore the Dashboard** - Navigate to http://localhost:3000
2. **Test API Endpoints** - Use the interactive docs at http://localhost:3001/docs
3. **Run the Test Suite** - Execute `npm test` to verify everything works
4. **Try Route Optimization** - Create some vehicles and deliveries
5. **Check Real-time Features** - Test the GPS tracking simulation

## 🤝 Need Help?

If you encounter any issues:

1. **Check the logs** - Look at console output for error messages
2. **Review documentation** - Check [TESTING.md](TESTING.md) for detailed testing info
3. **Search existing issues** - Look at [GitHub Issues](https://github.com/vkondepati/fleet-route-optimizer/issues)
4. **Create a new issue** - Report bugs or ask questions
5. **Join our community** - Discord server for real-time help

Happy coding! 🚀