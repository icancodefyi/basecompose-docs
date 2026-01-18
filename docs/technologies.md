# Supported Technologies & Stacks

Basecompose comes with pre-configured templates for popular technologies. The technology catalog is centralized in a single config file, making it easy to extend with new options.

---

## Currently Supported

### Application Intent

When creating a project, you first specify what type of application you're building:

- **SaaS** (Default)
  - Full-stack application with both frontend and backend
  - Includes UI, API, database, and optional authentication
  - Best for: Web apps, dashboards, content platforms

- **API**
  - Backend-only service without a user interface
  - Perfect for: Microservices, webhooks, data services

---

### Frontend

#### Next.js
- **Version:** Latest (16+)
- **Port:** 3000
- **Features:**
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes
  - Full TypeScript support
  - Tailwind CSS 4
  - Modern React patterns (App Router)
- **Use for:** Web apps, SaaS, dashboards, blogs
- **Docker Image:** `node:20-alpine`
- **Development:** Hot reload enabled with volume mounts
- **Production:** Optimized builds with `npm run build && npm start`

**Future Support:**
- React + Vite
- Astro
- Remix
- Svelte

---

### Backend

Backend options are templates waiting to be created. When you add a backend template, it will automatically appear in the UI and be available for selection.

**Planned Backends:**
- **Node.js/Express**
  - Port: 3001
  - Runtime: Node 20+
  - Language: TypeScript or JavaScript

- **FastAPI**
  - Port: 8000
  - Runtime: Python 3.11+
  - Language: Python

- **Go**
  - Port: 8080
  - Runtime: Go 1.21+
  - Language: Go

---

### Databases

#### MongoDB
- **Version:** 7.0+
- **Port:** 27017
- **Type:** NoSQL (Document database)
- **Use for:** Flexible schemas, rapid development, nested data
- **Docker Image:** `mongo:7`
- **Connection:** Via MongoDB connection string
- **Features:**
  - No migrations required
  - Flexible data structure
  - Great for prototyping
  - Scalable to large datasets
- **Environment Variables:**
  ```
  MONGODB_URI=mongodb://root:example@localhost:27017
  MONGODB_ROOT_USERNAME=root
  MONGODB_ROOT_PASSWORD=example
  ```
- **Development:** No auth (simplifies local setup)
- **Production:** Full authentication enabled

**Supported in Generated Projects:**
- MongoDB client library pre-installed
- Connection helper (`lib/db/mongodb.ts`)
- Environment variables configured
- Docker service included

#### PostgreSQL (Planned)
- **Version:** 16+
- **Port:** 5432
- **Type:** Relational SQL database
- **Use for:** Complex queries, ACID transactions, structured data
- **Docker Image:** `postgres:16-alpine`
- **Features:**
  - Powerful query engine
  - Strong consistency guarantees
  - Advanced features (JSON, full-text search)
  - Great for complex applications
- **Planned Libraries:** Prisma, TypeORM, Drizzle

#### MySQL (Planned)
- **Version:** 8.0+
- **Port:** 3306
- **Type:** Relational SQL database
- **Use for:** Traditional web apps, high compatibility
- **Docker Image:** `mysql:8.0`

#### Redis (Planned)
- **Version:** 7.0+
- **Port:** 6379
- **Type:** In-memory cache
- **Use for:** Caching, sessions, real-time data
- **Docker Image:** `redis:7-alpine`
- **Features:**
  - Ultra-fast key-value store
  - Perfect for caching
  - Session management
  - Pub/Sub messaging

---

### Authentication

#### Auth.js (NextAuth.js)
- **Requires:** Database (automatically added)
- **Providers Included:**
  - Google OAuth
  - GitHub OAuth
  - (Expandable for more providers)
- **Features:**
  - Session management
  - JWT support
  - Database adapters
  - Secure by default
  - Industry standard
- **Security:**
  - CSRF protection
  - Secure cookies
  - Password hashing
- **Environment Variables Needed:**
  ```
  GITHUB_ID=your_github_app_id
  GITHUB_SECRET=your_github_secret
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=generated_secret_here
  ```

**Planned Auth Options:**
- Clerk
- Firebase Auth
- Auth0
- Custom JWT

---

## How Technologies Are Combined

### Dependency Resolution

Basecompose automatically handles technology dependencies:

- **Auth requires Database:** Adding authentication automatically includes MongoDB (or your chosen database)
- **Frontend always included:** Every stack starts with Next.js
- **Demo always included:** Every project includes example components showing how to use the stack

### Example Stacks

#### Simple SaaS (Frontend + Database)
```typescript
{
  intent: "saas",
  frontend: "nextjs",
  database: "mongodb"
}
```
**Generated includes:**
- Next.js application
- MongoDB client and setup
- Docker Compose with MongoDB
- .env.example with MongoDB credentials
- Setup guide

#### Full SaaS (Frontend + Backend + Database + Auth)
```typescript
{
  intent: "saas",
  frontend: "nextjs",
  backend: "node",
  database: "mongodb",
  auth: "authjs"
}
```
**Generated includes:**
- All of the above, plus:
- Backend API service
- Auth routes and configuration
- OAuth setup instructions
- User session management

#### API Only (Backend + Database)
```typescript
{
  intent: "api",
  backend: "fastapi",
  database: "postgres"
}
```
**Generated includes:**
- FastAPI backend
- PostgreSQL setup
- Docker Compose with database
- API documentation
- Health check endpoint

---

## Adding New Technologies

### 1. Add to Stack Configuration

Edit `packages/types/stack-config.ts`:

```typescript
export const STACK_CONFIG = {
  database: {
    options: {
      redis: {
        label: "Redis",
        description: "In-memory cache",
        dockerImage: "redis:7-alpine",
        port: 6379,
        icon: "redis",
      },
    },
  },
};
```

### 2. Create Templates

Create template files in `templates/` directory:

```
templates/
├── databases/
│   └── redis/
│       ├── client.ts          # Connection helper
│       ├── env.ts             # Environment variables
│       ├── README.md           # Setup guide
│       └── docker/
│           └── docker-compose.redis.yml
```

### 3. Update Types

Update `packages/types/blueprint.ts`:

```typescript
export type StackBlueprint = {
  intent: "saas" | "api";
  database?: "mongodb" | "postgres" | "redis";
};
```

### 4. Add Resolution Rules (if needed)

In `stack-config.ts`, add dependency rules:

```typescript
export const RESOLUTION_RULES = [
  {
    name: "Redis improves performance",
    condition: (stack) => stack.backend && !stack.database,
    apply: (stack) => {
      // Automatically suggest Redis for backends
    },
  },
];
```

### 5. Test

```bash
pnpm dev
# Try selecting the new technology
# Generate and verify the output
```

---

## Technology Version Constraints

All Docker images are pinned to specific versions to ensure reproducibility:

- **Next.js:** Latest (automatically updated in base template)
- **Node:** 20-alpine
- **MongoDB:** 7 (LTS)
- **PostgreSQL:** 16-alpine
- **Python:** 3.11+ (when FastAPI is added)
- **Go:** 1.21+ (when Go is added)

---

## Learn More

- See [Contributing Guide](/contributing) for detailed steps on adding technologies
- Check [Architecture](/architecture) for how technologies are generated
- View [Templates](/templates) for template structure
