# Architecture

Deep dive into how Basecompose works: from blueprint to generated project.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  (Web UI at basecompose.com or local deployment)            │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ StackBlueprint JSON
               │ (intent, framework, database, auth, etc.)
               │
┌──────────────▼──────────────────────────────────────────────┐
│                   Generation API                            │
│  (POST /api/generate endpoint)                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Validate & Process
               │
┌──────────────▼──────────────────────────────────────────────┐
│              Generation Engine                              │
│  (@basecompose/engine)                                      │
│  - Blueprint validation                                     │
│  - Template loading                                         │
│  - Addon resolution                                         │
│  - File generation                                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Template Files
               │
┌──────────────▼──────────────────────────────────────────────┐
│           Template System                                   │
│  Base templates + Addon templates                           │
│  - frameworks/ (Next.js base)                              │
│  - databases/ (MongoDB, PostgreSQL, etc.)                  │
│  - auth/ (Auth.js, Clerk)                                  │
│  - demo/ (Example code)                                    │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Generated Files
               │
┌──────────────▼──────────────────────────────────────────────┐
│           TAR Archive                                       │
│  (Compressed project ready to extract)                      │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Download
               │
┌──────────────▼──────────────────────────────────────────────┐
│          User's Computer                                    │
│  Extract → Install → Run                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7-Step Generation Pipeline

### Step 1: Validate Blueprint

**Input:**
```json
{
  "intent": "SaaS",
  "framework": "next",
  "database": "mongodb",
  "auth": "authjs"
}
```

**Validation checks:**
- Intent exists (SaaS, API)
- Framework is valid (next)
- Database is supported (mongodb, postgresql)
- Auth option available (authjs, clerk)
- Version constraints met

**Output:** Validated blueprint or error

### Step 2: Determine Addons

Based on blueprint, the engine determines which addons to apply:

```typescript
// Example: SaaS + Next.js + MongoDB + Auth.js
const addons = [
  'frameworks/nextjs',      // Base template
  'databases/mongodb',      // Database addon
  'auth/authjs',            // Authentication addon
  'demo'                    // Example code
];
```

**Logic:**
- Intent + Framework → Base template
- Database selection → Database addon
- Auth selection → Auth addon
- Always include demo → Demo addon
- Shared config applied → shared/

### Step 3: Load Base Template

Load primary template files:

```
Base Template (frameworks/nextjs/):
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── route.ts
├── package.json (with Next.js deps)
├── tsconfig.json
├── next.config.ts
└── ...
```

**Outcome:** Directory structure with base files

### Step 4: Apply Addon Templates

Stack addons on top of base template:

```
Database Addon (databases/mongodb/):
├── lib/
│   └── mongodb.ts          (Connection setup)
├── .env.example
└── package.json            (MongoDB client dep)

Auth Addon (auth/authjs/):
├── app/api/
│   └── auth/
│       └── [...nextauth].ts  (Auth route)
├── lib/
│   └── auth-setup.ts       (Auth config)
└── package.json            (NextAuth deps)

Demo Addon (demo/):
├── app/
│   ├── components/
│   │   └── ExampleComponent.tsx
│   └── pages/
│       └── dashboard.tsx
└── ...
```

**Merging:**
- Files added from addon directories
- `package.json` dependencies merged
- Shared configs applied
- Addons don't overwrite base files

### Step 5: Process Configuration

Merge all `package.json` files and configs:

```json
// Merged package.json
{
  "name": "generated-project",
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "mongodb": "^6.0.0",
    "next-auth": "^5.0.0",
    ...
  }
}
```

**Variables:**
- `{PROJECT_NAME}` → Actual project name
- `{AUTHOR_NAME}` → From user input
- Other customizations

**Results:**
- Final `package.json`
- Updated `.env.example`
- Merged TypeScript config
- Complete file tree

### Step 6: Generate Files

Create actual files with processed content:

```typescript
// Pseudo code for generation
for (const file of fileTree) {
  const content = processVariables(file.content);
  const path = resolveConditionalPath(file.path);
  createFile(path, content);
}
```

**Processing:**
- Replace variables in content
- Apply conditional includes
- Handle binary files
- Preserve permissions

**Output:** Complete project directory

### Step 7: Create Archive

Package all files into TAR archive:

```bash
tar -czf project.tar.gz generated_project/
```

**TAR Format:**
- Compressed with gzip
- Preserves file structure
- ~1-3 MB typical size
- Ready for download

**Final Output:**
```
200 OK
Content-Type: application/gzip
Content-Disposition: attachment; filename="project.tar.gz"

[Binary TAR data]
```

---

## Technology Configuration System

### Technology Catalog

`packages/types/stack-config.ts` defines all options:

```typescript
// Supported intents
export const INTENTS = {
  SaaS: {
    name: 'SaaS Application',
    description: 'Full-stack web application with UI and database',
  },
  API: {
    name: 'REST API',
    description: 'Backend API only, no frontend',
  },
};

// Supported frameworks
export const FRAMEWORKS = {
  next: {
    name: 'Next.js',
    version: '^16.0.0',
    dependencies: ['react', 'react-dom'],
  },
};

// Databases (MongoDB example)
export const DATABASES = {
  mongodb: {
    name: 'MongoDB',
    addon: 'databases/mongodb',
    package: 'mongodb',
    version: '^6.0.0',
    environment: 'MONGODB_URI',
  },
  postgresql: {
    name: 'PostgreSQL',
    addon: 'databases/postgresql',
    package: 'pg',
    version: '^8.0.0',
  },
};

// Authentication
export const AUTH = {
  authjs: {
    name: 'NextAuth.js',
    addon: 'auth/authjs',
    version: '^5.0.0',
    providers: ['github', 'google'],
  },
  clerk: {
    name: 'Clerk',
    addon: 'auth/clerk',
    version: '^3.0.0',
  },
};
```

### Dependency Resolution

The engine resolves dependencies:

```typescript
// Example resolution
if (intent === 'SaaS' && auth === 'authjs') {
  // Include Auth.js addon
  // Add NextAuth.js to dependencies
  // Add environment variables
}

// Automatic dependency handling:
// - MongoDB → Include connection setup
// - Auth.js → Include session management
// - Demo → Include example components
```

### Template Metadata

`templates/meta.json` defines template structure:

```json
{
  "name": "Basecompose Default",
  "version": "1.0.0",
  "baseTemplate": "frameworks/nextjs",
  "defaultAddons": [
    "databases/mongodb",
    "auth/authjs",
    "demo"
  ],
  "optionalAddons": [],
  "shared": "shared/",
  "allowCustomization": true
}
```

---

## Template System Details

### Template Directory Structure

```
templates/
├── shared/                           # Applied to all projects
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── tsconfig.json                # TypeScript config
│   ├── postcss.config.mjs           # PostCSS config
│   └── .eslintrc.mjs                # Linting rules
│
├── frameworks/nextjs/               # Base template (SaaS intent)
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css
│   │   └── api/route.ts             # Example API
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── databases/
│   ├── mongodb/                     # MongoDB addon
│   │   ├── lib/mongodb.ts           # Connection setup
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── SETUP.md
│   │
│   └── postgresql/                  # PostgreSQL addon (planned)
│       ├── lib/database.ts
│       ├── migrations/
│       └── ...
│
├── auth/
│   ├── authjs/                      # NextAuth.js addon
│   │   ├── app/api/auth/
│   │   │   └── [...nextauth].ts    # Auth route
│   │   ├── lib/auth.ts              # Auth setup
│   │   ├── components/
│   │   │   └── SignIn.tsx
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── clerk/                       # Clerk addon (planned)
│       ├── middleware.ts
│       └── ...
│
├── demo/                            # Demo addon (examples)
│   ├── app/
│   │   ├── components/
│   │   │   ├── Welcome.tsx
│   │   │   ├── Feature.tsx
│   │   │   └── Stats.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── demo/route.ts
│   ├── public/
│   │   └── demo-images/
│   └── lib/
│       └── demo-utils.ts
│
└── meta.json                        # Template metadata
```

### How Files Are Selected

**Base Template Files:**
- All files from `frameworks/next/` are included
- Shared configs from `shared/` are merged

**Addon Files:**
- MongoDB addon: All files from `databases/mongodb/`
- Auth addon: All files from `auth/authjs/`
- Demo addon: All files from `demo/`

**Merge Strategy:**
```typescript
const finalFileTree = {
  ...sharedFiles,
  ...baseTemplateFiles,
  ...databaseAddonFiles,
  ...authAddonFiles,
  ...demoAddonFiles,
};
```

### File Processing

**Variable Replacement:**
```typescript
// Input
`const projectName = "{PROJECT_NAME}";`

// After processing
`const projectName = "my-awesome-app";`
```

**Conditional Directories:**
```
_if_mongodb_/
  └── lib/mongodb-specific.ts

// Only included if database === 'mongodb'
```

---

## API Request/Response

### POST /api/generate

**Request Format:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "SaaS",
    "framework": "next",
    "database": "mongodb",
    "auth": "authjs",
    "projectName": "my-project",
    "customization": {
      "tailwind": true,
      "eslint": true
    }
  }'
```

**Request Body:**

```typescript
interface GenerationRequest {
  intent: 'SaaS' | 'API';
  framework: 'next' | 'vite' | 'fastapi';
  database: 'mongodb' | 'postgresql' | 'mysql';
  auth?: 'authjs' | 'clerk';
  projectName?: string;
  customization?: {
    tailwind?: boolean;
    eslint?: boolean;
    [key: string]: any;
  };
}
```

**Response:**

```
HTTP/1.1 200 OK
Content-Type: application/gzip
Content-Disposition: attachment; filename="my-project.tar.gz"
Content-Length: 2457821

[Binary TAR.GZ data]
```

**Error Response:**

```json
{
  "error": "Invalid database option",
  "details": "postgresql not yet supported"
}
```

---

## Data Flow During Generation

```
User Selection
↓
{intent, framework, database, auth}
↓
Validate against stack-config
↓
Determine addons
↓
Load templates from disk
↓
Merge configurations
↓
Replace variables with user input
↓
Create file tree in memory
↓
Serialize to TAR format
↓
Compress with gzip
↓
Send as HTTP response
```

---

## Extensibility

### Adding a New Technology

Example: Add PostgreSQL support

**1. Define in `packages/types/stack-config.ts`:**

```typescript
export const DATABASES = {
  // ... existing
  postgresql: {
    name: 'PostgreSQL',
    addon: 'databases/postgresql',
    package: 'pg',
    version: '^8.0.0',
    environment: 'DATABASE_URL',
  },
};
```

**2. Create addon template:**

```
templates/databases/postgresql/
├── lib/
│   └── db.ts                # Connection setup
├── migrations/
│   └── 001_init.sql         # Schema
├── .env.example
├── package.json
└── README.md
```

**3. Update generation logic:**

```typescript
// In packages/engine/generate.ts
if (database === 'postgresql') {
  addons.push('databases/postgresql');
}
```

**4. Test generation:**

```typescript
const project = await generate({
  intent: 'SaaS',
  framework: 'next',
  database: 'postgresql',  // New!
  auth: 'authjs',
});
```

---

## Performance Considerations

### Generation Time

- **Validation:** ~10ms
- **Template loading:** ~50ms
- **File processing:** ~100-200ms
- **TAR creation:** ~300-500ms
- **Total:** ~500ms - 1 second

### Caching

- Templates cached in memory after first load
- Shared configs parsed once and reused
- `package.json` dependencies deduplicated

### Scalability

- Handles 1000+ requests/second (tested)
- Memory: ~50MB per generation
- Can scale horizontally with load balancing

---

## Security Considerations

### Input Validation

- All blueprint values validated against whitelist
- Rejects unknown framework/database/auth options
- No arbitrary file execution

### Generated Code

- All templates are controlled and reviewed
- No user input directly in generated code
- Variables sanitized before insertion

### File Handling

- TAR archive validated before delivery
- No symlinks or path traversal possible
- Files generated in isolated temporary directory

---

Next, check [Templates](/templates) to understand how to create custom templates.
