# Project Structure

Understanding how Basecompose is organized helps you navigate the codebase and contribute effectively.

---

## Overview

```
basecompose/
├── app/                          # Main Next.js application (frontend + API)
├── packages/                     # Shared packages (monorepo)
│   ├── engine/                   # Generation engine (core logic)
│   └── types/                    # TypeScript types & configurations
├── templates/                    # Template system (base + addons)
├── lib/                          # Shared utilities
├── components/                   # Reusable UI components
├── content/                      # Blog and content
├── public/                       # Static assets
├── scripts/                      # Setup and utility scripts
├── pnpm-workspace.yaml           # Monorepo configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Root dependencies
└── README.md                     # Project documentation
```

---

## Root Level

### Key Configuration Files

**`pnpm-workspace.yaml`**
- Defines monorepo structure
- Lists all workspaces (`app`, `packages/engine`, `packages/types`)
- Enables dependency hoisting

**`tsconfig.json`**
- Global TypeScript settings
- Path aliases (`@/` → `./`)
- Type checking configuration

**`next.config.ts`**
- Next.js configuration
- Build settings
- Environment configuration

**`package.json`**
- Root dependencies (dev tools, linters, etc.)
- Scripts for common tasks
- Workspace references

**`.eslintrc.mjs`** and **`postcss.config.mjs`**
- Code quality and styling rules
- Shared across all packages

---

## `/app` - Main Application

The core Next.js application with frontend and API routes.

### Structure

```
app/
├── api/                          # API routes
│   ├── auth/                     # Authentication endpoints
│   ├── chat/                     # Chat/AI endpoints
│   ├── generate/                 # Project generation endpoint
│   ├── projects/                 # Project management endpoints
│   └── subscribe/                # Email subscription endpoint
├── auth/                         # Auth pages
│   └── signin/                   # Sign in page
├── blog/                         # Blog section
│   ├── page.tsx                  # Blog index
│   ├── subscribe-cta.tsx         # Subscription CTA component
│   └── [slug]/                   # Individual blog posts
├── chat/                         # Chat interface
│   ├── page.tsx                  # Chat main page
│   └── [projectId]/              # Chat for specific project
├── changelogs/                   # Release notes
│   └── page.tsx
├── docs/                         # Documentation page
│   └── page.tsx
├── components/                   # App-specific components
│   ├── github-push-modal.tsx    # GitHub integration modal
│   ├── project-modal.tsx         # Project creation modal
│   └── ...                       # Other components
├── hooks/                        # React hooks
│   └── ...                       # Custom hooks
├── lib/                          # App utilities
│   ├── auth-utils.ts             # Authentication helpers
│   ├── blog.ts                   # Blog utilities
│   ├── mongodb.ts                # Database helpers
│   └── utils.ts                  # General utilities
├── layout.tsx                    # Root layout component
├── page.tsx                      # Home page
├── providers.tsx                 # Next.js providers (context, etc.)
├── globals.css                   # Global styles
└── not-found.tsx                 # 404 page
```

### Key Files

**`page.tsx` - Home Page**
- Landing page
- Feature showcase
- CTA buttons

**`layout.tsx` - Root Layout**
- HTML structure
- Providers setup
- Navigation component

**`api/generate/route.ts` - Generation Endpoint**
- Receives: `StackBlueprint` JSON
- Returns: TAR archive with generated project
- Core API endpoint for generation

**`api/auth/* - Auth Routes**
- NextAuth configuration
- OAuth callbacks
- Session management

**`lib/mongodb.ts - Database Connection**
- MongoDB client setup
- Database utilities
- Connection pooling

---

## `/packages` - Shared Packages

Monorepo packages shared across the application.

### `/packages/types`

Type definitions and technology configuration.

```
packages/types/
├── index.ts                      # Main exports
├── stack-config.ts               # Technology catalog
└── ...other types
```

**`stack-config.ts` - Technology Catalog**

Defines all supported technologies:

```typescript
// Intent options
intent: 'SaaS' | 'API'

// Frontend frameworks
frontend: 'next'

// Backend frameworks (future)
backend: 'node' | 'fastapi'

// Databases
database: 'mongodb' | 'postgresql'

// Authentication
auth: 'authjs' | 'clerk'
```

Each technology has:
- Dependencies
- Configuration options
- Version constraints

### `/packages/engine`

Code generation engine - the core logic.

```
packages/engine/
├── generate.ts                   # Main generation orchestration
├── template-system.ts            # Template loading and processing
├── addon-resolver.ts             # Addon dependency resolution
└── ...
```

**`generate.ts` - Generation Pipeline**

7-step generation process:
1. Validate blueprint
2. Determine addons to apply
3. Load base template
4. Apply addon templates
5. Process configuration
6. Generate files
7. Create archive

---

## `/templates` - Template System

Base and addon templates for project generation.

### Structure

```
templates/
├── shared/                       # Shared configs and utilities
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── ...
├── auth/                         # Auth.js addon
│   ├── routes/                   # Auth API routes
│   ├── components/               # Auth UI components
│   └── config.ts
├── databases/                    # Database addons
│   ├── mongodb/                  # MongoDB setup
│   ├── postgresql/               # PostgreSQL setup
│   └── ...
├── demo/                         # Demo addon
│   ├── components/               # Example components
│   ├── pages/                    # Example pages
│   └── ...
├── frameworks/                   # Framework templates
│   ├── nextjs/                   # Next.js base template
│   ├── vite/                     # Vite template (future)
│   └── ...
└── meta.json                     # Template metadata
```

### Template Metadata

`meta.json` defines templates:

```json
{
  "name": "Basecompose Default",
  "version": "1.0.0",
  "baseTemplate": "frameworks/nextjs",
  "addons": [
    "databases/mongodb",
    "auth/authjs",
    "demo"
  ]
}
```

### Creating Custom Templates

Templates are directories with files that get copied and processed:

```
my-template/
├── app/
│   ├── page.tsx                  # Root page
│   ├── layout.tsx
│   └── api/
├── package.json                  # Dependencies
├── .env.example
└── README.md
```

Files are processed as:
- **Variables:** `{PROJECT_NAME}` → replaced with actual name
- **Conditional dirs:** `_conditionally_*` → included only if addon selected
- **Code:**  TypeScript/JavaScript as-is

---

## `/lib` - Shared Utilities

App-level utilities and helpers.

```
lib/
├── auth-utils.ts                 # Auth helpers
├── blog.ts                       # Blog utilities
├── mongodb.ts                    # Database utilities
└── utils.ts                      # General helpers
```

**`auth-utils.ts`** - Authentication

- Session verification
- Permission checking
- User validation

**`mongodb.ts`** - Database

- Connection management
- Model definitions
- Query helpers

**`blog.ts`** - Content

- Markdown parsing
- Blog fetching
- Meta extraction

---

## `/components` - UI Components

Reusable React components.

```
components/
├── Counter.tsx                   # Example counter component
├── GooeyNav.tsx                  # Navigation component
├── Orb.tsx                       # Visual element
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    └── ...
```

### Component Structure

Each component:
- Accepts TypeScript props
- Handles state with hooks
- Styles with Tailwind CSS
- Exports default component

Example:

```typescript
// components/ui/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded ${
        variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## `/public` - Static Assets

Files served as-is without processing.

```
public/
├── blogs/                        # Blog images
├── icons/                        # Icon files
├── favicon.ico
└── ...
```

- Images: PNG, JPG, SVG
- Icons: Reusable SVG icons
- Accessed via `/icons/name.svg`

---

## `/content` - Content Files

Blog posts and static content.

```
content/
├── blog/
│   ├── getting-started.md
│   ├── advanced-usage.md
│   └── ...
```

Format:
- Markdown (.md)
- YAML frontmatter for metadata
- Processed by `lib/blog.ts`

Example:

```markdown
---
title: Getting Started with Basecompose
date: 2024-01-15
author: John Doe
---

# Getting Started

Your content here...
```

---

## `/scripts` - Utilities

Development and setup scripts.

```
scripts/
├── setup.sh                      # macOS/Linux setup
└── setup.bat                     # Windows setup
```

Run setup:

```bash
# macOS/Linux
bash scripts/setup.sh

# Windows
scripts/setup.bat
```

---

## File Naming Conventions

### TypeScript Files
- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Utilities: `camelCase.ts` (e.g., `auth-utils.ts`)
- Types: `PascalCase.ts` (e.g., `User.ts`)

### Routes
- Dynamic: `[param].tsx` (e.g., `[projectId].tsx`)
- Catch-all: `[[...slug]].tsx`
- Optional: `[[slug]].tsx`

### Styles
- Global: `globals.css`
- Module: `Component.module.css`
- Tailwind: inline classes in JSX

---

## Dependencies Across Packages

```
app/
└── depends on:
    ├── @basecompose/types
    ├── @basecompose/engine
    └── external: next, react, mongodb, ...

packages/engine/
└── depends on:
    └── @basecompose/types

packages/types/
└── no dependencies (foundational)
```

To add dependency to package:

```bash
pnpm -F <package-name> add <dependency>
```

---

## Build Outputs

After running `pnpm build`:

```
.next/                           # Next.js build output
├── server/
├── static/
└── ...

dist/                            # Package builds (if applicable)
```

---

## Navigation Flow

**User Journey:**

1. Home (`/`) - Landing page
2. Chat (`/chat`) - Generate with AI
3. Generate API (`/api/generate`) - Get generated project
4. Download - TAR archive
5. Extract - Run locally

**API Flow:**

1. Request arrives at `/api/generate`
2. Validate `StackBlueprint`
3. Load templates
4. Generate files
5. Create TAR
6. Return binary

---

Next, read [Architecture](/architecture) to understand how generation works in detail.
