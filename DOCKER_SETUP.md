# Docker Setup Guide for Student Management System

This guide explains how to build and run the Student Management System using Docker and Docker Compose.

## Files Created

1. **Dockerfile** - Multi-stage build configuration for the Next.js application
2. **docker-compose.yml** - Single configuration supporting both development and production with MongoDB and Next.js app
3. **.dockerignore** - Files to exclude from Docker build
4. **.env.docker** - Environment variables template for Docker

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### Production Setup

1. **Clone or navigate to project directory:**
   ```bash
   cd student-management-system
   ```

2. **Create environment file (optional - uses defaults if not provided):**
   ```bash
   cp .env.docker .env.production.local
   ```
   Edit the file to change default credentials if needed.

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Application: http://localhost:3000
   - MongoDB is running on port 27017

5. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

6. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Development Setup

For development with MongoDB Express GUI for easier database management:

1. **Start development containers with dev profile:**
   ```bash
   docker-compose --profile dev up -d
   ```

2. **Access services:**
   - Application: http://localhost:3000
   - MongoDB: localhost:27017
   - MongoDB Express GUI: http://localhost:8081

3. **Stop development containers:**
   ```bash
   docker-compose down
   ```

## Environment Variables

Key environment variables to configure:

```
# MongoDB
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=student_management

# MongoDB Connection (automatically set in Docker Compose)
MONGODB_URI=mongodb://root:password@mongodb:27017/student_management?authSource=admin

# Next.js
NODE_ENV=production
APP_PORT=3000

# Authentication (CHANGE THESE IN PRODUCTION!)
NEXTAUTH_SECRET=your-very-secure-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-very-secure-jwt-secret-change-this-in-production
```

## Building Custom Images

### Build with a specific tag:
```bash
docker build -t student-management-system:1.0 .
```

### Build without using cache:
```bash
docker build --no-cache -t student-management-system:latest .
```

## Docker Commands Reference

### View running containers:
```bash
docker ps
```

### View container logs:
```bash
docker-compose logs -f app
```

### Execute command in running container:
```bash
docker-compose exec app npm run lint
```

### Rebuild containers after code changes:
```bash
docker-compose up -d --build
```

### Remove all containers and volumes:
```bash
docker-compose down -v
```

### Inspect volume contents (for MongoDB data):
```bash
docker volume ls
docker volume inspect student-management-system_mongodb_data
```

## Production Deployment Considerations

### Security Best Practices:

1. **Change default credentials:**
   ```bash
   export MONGO_ROOT_PASSWORD=<strong-password>
   export NEXTAUTH_SECRET=<strong-random-key>
   export JWT_SECRET=<strong-random-key>
   ```

2. **Use secrets management:**
   - For Docker Swarm, use `docker secret`
   - For Kubernetes, use `kubectl create secret`

3. **Update MongoDB connection string:**
   - Ensure it points to a secure MongoDB instance
   - Use authentication credentials
   - Consider using a managed MongoDB service (Atlas, etc.)

4. **Enable HTTPS:**
   - Add a reverse proxy (nginx, Traefik)
   - Use SSL certificates

5. **Set proper resource limits:**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

## Troubleshooting

### Container fails to start
```bash
docker-compose logs app
```

### MongoDB connection error
- Ensure MongoDB is healthy: `docker-compose ps`
- Check MONGODB_URI is correct
- Verify MongoDB container is running: `docker-compose logs mongodb`

### Port already in use
- Change port mapping in docker-compose.yml: `"8000:8080"`
- Or stop other services using those ports

### Volume/Data persistence
- Use named volumes (already configured in docker-compose.yml)
- Data persists even after container restarts

### Rebuild after dependency changes
```bash
docker-compose down
docker-compose up -d --build
```

## Database Backup

### Backup MongoDB data:
```bash
docker-compose exec mongodb mongodump --out=/backup --username=root --password=password --authenticationDatabase=admin
```

### Restore MongoDB data:
```bash
docker-compose exec mongodb mongorestore /backup --username=root --password=password --authenticationDatabase=admin
```

## Network Communication

Both containers run on the same Docker network (`student-network`), allowing communication using service names:
- From app to MongoDB: `mongodb:27017`
- This is automatically configured in the MONGODB_URI

## Next Steps

- Customize environment variables in `.env.docker`
- Add more services (Redis cache, nginx reverse proxy, etc.)
- Configure CI/CD pipelines to build and deploy Docker images
- Set up Docker registry (Docker Hub, ECR, GCR, etc.)
