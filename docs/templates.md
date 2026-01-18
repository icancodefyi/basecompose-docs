# Templates & Addons

Basecompose uses a modular template system. Here's how they work and how to use them.

---

## Template System

### How Templates Work

1. **Base Template** - Foundation for the project (Next.js scaffold)
2. **Addon Templates** - Optional features you can include (Database, Auth, Demo)
3. **Shared Templates** - Common configuration files (Docker, setup guides)

When you generate a project:
1. Basecompose copies the base template
2. Copies any selected addon templates
3. Merges configurations
4. Archives everything into a tar.gz file

---

## Current Templates

### Base Template: Next.js

**Location:** `templates/frameworks/nextjs/base/`

**What it includes:**
- Complete Next.js 16 application
- App Router structure
- TypeScript configuration
- Tailwind CSS 4
- ESLint configuration
- Package.json with common dependencies
- Docker configuration
- .gitignore for Node.js projects

**Used in:** Every generated project as the foundation

---

### Addon: MongoDB Database

**Location:** `templates/databases/mongodb/`

**When included:** If you select MongoDB in your stack

**What it adds:**
- MongoDB connection helper
- Environment variable examples
- Docker MongoDB service configuration
- Setup documentation

**Connection Helper:**
```typescript
// lib/db/mongodb.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const getDatabase = async () => {
  await client.connect();
  return client.db("basecompose");
};
```

---

### Addon: Auth.js Authentication

**Location:** `templates/auth/authjs/`

**When included:** If you select Auth.js in your stack

**What it adds:**
- NextAuth.js configuration
- OAuth provider setup (GitHub, Google)
- Protected API routes
- Session management

---

### Addon: Demo

**Location:** `templates/demo/`

**When included:** Always (shows examples)

**What it includes:**
- Example API endpoint (/api/health)
- Example React component
- Feature showcase

---

### Shared Configuration

**Location:** `templates/shared/`

**What it includes:**
- Docker Compose for development
- Docker Compose for production
- Setup guides and instructions

---

## Creating Custom Templates

### Step 1: Create Template Folder

```
templates/databases/mysql/
├── client.ts
├── env.ts
├── README.md
└── docker/
    └── docker-compose.mysql.yml
```

### Step 2: Write Template Files

Define environment variables, connection helpers, and Docker configs.

### Step 3: Register in Stack Config

Edit `packages/types/stack-config.ts`:

```typescript
export const STACK_CONFIG = {
  database: {
    options: {
      mysql: {
        label: "MySQL",
        description: "Relational database",
        dockerImage: "mysql:8.0",
        port: 3306,
      },
    },
  },
};
```

### Step 4: Test

```bash
pnpm dev
# Generate and verify
```

---

For detailed template creation guide, see [Contributing Guide](/contributing).
