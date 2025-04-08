# Express Clean Architecture Boilerplate

A TypeScript Express API boilerplate following clean architecture principles with Docker support and JWT authentication.

## 🌟 Features

- **Clean Architecture**: Well-organized codebase following domain-driven design principles
- **TypeScript**: Type-safe code development
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Docker Support**: Easy containerization with built-in health checks
- **Express Framework**: Fast, unopinionated web framework for Node.js
- **Environment Configuration**: Using dotenv for environment variable management
- **Logging**: Winston for comprehensive logging
- **Testing**: Jest configured for unit and integration tests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (normally comes with Node.js)
- [Docker](https://www.docker.com/get-started) (optional, for containerization)
- [Git](https://git-scm.com/) (for version control)

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/express-clean-architecture.git
cd express-clean-architecture
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`:

```bash
# App Configuration
NODE_ENV=development
PORT=3001
API_PREFIX=/api

# JWT Authentication
JWT_SECRET=your_development_secret_key_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

### Build the Project

```bash
npm run build
```

### Run the Application

```bash
npm start
```

The server will start at http://localhost:3001/api

### Run in Development Mode (with Hot Reload)

```bash
npm run dev
```

## 🧪 Running Tests

```bash
npm test
```

## 🐳 Docker Setup

### Build and Run with Docker Compose

```bash
docker-compose build
docker-compose up
```

The application will be available at http://localhost:3001/api

### Build and Run Docker Container Manually

```bash
docker build -t express-clean-architecture .
docker run -p 3001:3001 -d express-clean-architecture
```

## 📁 Project Structure

Here's an explanation of our clean architecture structure:

```
src/
├── application/         # Application business rules
│   ├── dtos/            # Data Transfer Objects
│   ├── services/        # Use cases / Application services
│   └── interfaces/      # Ports for driving adapters
├── domain/              # Enterprise business rules
│   ├── entities/        # Business entities
│   ├── repositories/    # Repository interfaces
│   └── value-objects/   # Value objects
├── infrastructure/      # Frameworks, drivers, and tools
│   ├── config/          # Configuration
│   ├── http/            # Express app and server
│   ├── logging/         # Logging implementation
│   └── repositories/    # Repository implementations
└── interfaces/          # Interface adapters
    ├── controllers/     # REST controllers
    ├── middleware/      # Express middleware
    └── routes/          # Express routes
```

### Understanding the Layers:

1. **Domain Layer**: Contains business entities and rules that are independent of any framework.
   - `entities/`: Core business objects
   - `repositories/`: Interfaces defining data access methods
   - `value-objects/`: Immutable objects that represent concepts in the domain

2. **Application Layer**: Contains application-specific business rules and use cases.
   - `dtos/`: Objects for transferring data between layers
   - `services/`: Implementation of business use cases
   - `interfaces/`: Interfaces for driving adapters

3. **Infrastructure Layer**: Contains implementations of repository interfaces and external services.
   - `config/`: Application configuration
   - `http/`: Express server setup
   - `logging/`: Logging implementation
   - `repositories/`: Implementation of domain repository interfaces

4. **Interface Layer**: Contains controllers, routes, and middleware.
   - `controllers/`: Handling HTTP requests and responses
   - `middleware/`: Express middleware for authentication, error handling, etc.
   - `routes/`: Express routes definition

## 🔐 Authentication

The boilerplate includes JWT-based authentication:

### Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Accessing Protected Routes

Use the token returned from login to access protected routes:

```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔍 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current authenticated user (requires token)

### Users (Protected Routes)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Health Check

- `GET /api/health` - Check API health
- `GET /api/healthz` - Alternative health check endpoint for Docker

## 📚 Common Development Tasks

### Adding a New Entity

1. Create a new entity file in `src/domain/entities/`
2. Define the interface and class for your entity
3. Create the repository interface in `src/domain/repositories/`
4. Implement the repository in `src/infrastructure/repositories/`
5. Create DTOs in `src/application/dtos/`
6. Create a service in `src/application/services/`
7. Create a controller in `src/interfaces/controllers/`
8. Add routes in `src/interfaces/routes/`

### Adding a New Middleware

1. Create a middleware file in `src/interfaces/middleware/`
2. Import and use the middleware in your routes or app.ts

### Understanding Clean Architecture Flow

The request flow:

1. HTTP Request → Routes
2. Routes → Controllers
3. Controllers → Application Services
4. Application Services → Domain Entities/Repositories
5. Domain Entities/Repositories ← Application Services
6. Application Services ← Controllers
7. Controllers → HTTP Response

## 🛠️ Troubleshooting

### Port Already in Use

If you encounter an error about ports being unavailable, change the port in your `.env` file:

```
PORT=3002
```

Remember to update the port in the Docker health check URLs and exposed ports if using Docker.

### Module Not Found

If you get a "Module not found" error, make sure:

1. You've built the project with `npm run build`
2. Your import paths match the actual file structure
3. The TypeScript configuration in `tsconfig.json` is correct

### Docker Issues

If Docker container fails to start:

1. Ensure no applications are using the specified port
2. Check that the `CMD` in Dockerfile points to the correct entry file
3. Verify the health check endpoint is reachable

## 📖 Learning Resources

New to some of these concepts? Here are some resources to help:

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [JWT Authentication](https://jwt.io/introduction/)
- [Docker Documentation](https://docs.docker.com/)

## 📝 License

This project is licensed under the MIT License 