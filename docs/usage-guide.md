# Usage Guide

This guide shows you how to use Basecompose to generate your own project. Whether you prefer the web UI or the API, we've got you covered.

---

## Web UI Usage (Easiest)

The simplest way to use Basecompose is through the web interface.

### Step 1: Visit the App

Go to [bc.impiclabs.com](https://bc.impiclabs.com) or your local instance at `http://localhost:3000`

### Step 2: Select Your Stack

You'll see a stack builder interface with several options:

1. **Choose Application Intent**
   - **SaaS:** Full-stack with frontend and backend
   - **API:** Backend only
   
2. **Select Technologies** (optional)
   - Frontend framework (Next.js, etc.)
   - Backend runtime (Node.js, FastAPI, etc.)
   - Database (MongoDB, PostgreSQL, etc.)
   - Authentication (Auth.js, etc.)

3. **Let AI Configure** (if available)
   - Or chat with the AI: "I need a Next.js blog with MongoDB"
   - The AI will automatically select compatible technologies

### Step 3: Review Your Stack

You'll see your selected stack in a sidebar:
- Frontend: ✓
- Database: ✓
- Auth: ✓
- etc.

The app shows which technologies are included and their ports/services.

### Step 4: Download Your Project

Click the **"Generate & Download"** button:
- Your project downloads as `BaseCompose-stack.tar.gz`
- Contains all source code, configuration, and setup guide
- Ready to extract and use immediately

### Step 5: Extract and Run

```bash
# Extract
tar -xzf BaseCompose-stack.tar.gz
cd BaseCompose-stack

# View setup guide
cat README.md

# Option A: Run with Docker
docker-compose -f docker-compose.dev.yml up

# Option B: Run locally
pnpm install
pnpm dev
```

---

## API Usage (Programmatic)

Use the API to generate projects programmatically.

### Endpoint

```
POST /api/generate
```

### Headers

```
Content-Type: application/json
```

### Request Body

Send a StackBlueprint JSON object:

```json
{
  "intent": "saas",
  "framework": "nextjs",
  "database": "mongodb",
  "auth": "authjs"
}
```

### Valid Values

**Intent:**
- `"saas"` - Full-stack application
- `"api"` - API only

**Framework:**
- `"nextjs"` - Next.js (default)

**Database:**
- `"mongodb"` - MongoDB
- `"postgres"` - PostgreSQL (when available)
- `"redis"` - Redis (when available)

**Auth:**
- `"authjs"` - Auth.js/NextAuth.js
- `"clerk"` - Clerk (when available)

### Response

**Success (200):**
```
Content-Type: application/gzip
Content-Disposition: attachment; filename="BaseCompose-stack.tar.gz"

[binary tar.gz data]
```

**Error (500):**
```json
{
  "error": "Failed to generate project",
  "message": "Error details here"
}
```

### Example: Using cURL

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "saas",
    "database": "mongodb",
    "auth": "authjs"
  }' \
  --output project.tar.gz

tar -xzf project.tar.gz
cd BaseCompose-stack
```

### Example: Using JavaScript/Node.js

```javascript
async function generateStack() {
  const blueprint = {
    intent: "saas",
    framework: "nextjs",
    database: "mongodb",
    auth: "authjs"
  };

  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(blueprint)
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  // Get the file buffer
  const buffer = await response.arrayBuffer();
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('project.tar.gz', Buffer.from(buffer));
  
  console.log('✅ Project generated: project.tar.gz');
}

generateStack();
```

### Example: Using Python

```python
import requests
import json

blueprint = {
    "intent": "saas",
    "database": "mongodb",
    "auth": "authjs"
}

response = requests.post(
    'http://localhost:3000/api/generate',
    headers={'Content-Type': 'application/json'},
    json=blueprint
)

if response.status_code == 200:
    with open('project.tar.gz', 'wb') as f:
        f.write(response.content)
    print('✅ Project generated: project.tar.gz')
else:
    print(f'❌ Error: {response.json()}')
```

---

## Generated Project Structure

After downloading and extracting, you'll get:

```
BaseCompose-stack/
├── app/                      # Next.js application
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── api/                 # API routes
│   │   ├── auth/            # Auth endpoints (if auth selected)
│   │   └── health.ts        # Health check
│   ├── components/          # React components
│   └── lib/                 # Utilities
├── docker-compose.dev.yml   # Development environment
├── docker-compose.prod.yml  # Production environment
├── .env.example             # Environment variables template
├── .env.local              # Local overrides (not in repo)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── Dockerfile              # Container image
├── README.md               # Quick start guide
├── SETUP.md                # Detailed setup instructions
└── [other config files]
```

---

## Running Your Generated Project

### Development Mode (Local)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
# http://localhost:3000
```

Features:
- Hot reload on code changes
- Debug tools enabled
- No authentication required (for testing)

### Development Mode (Docker)

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

Services running:
- Next.js app on port 3000
- MongoDB on port 27017 (if selected)
- Other services on their configured ports

### Production Mode (Docker)

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up --build

# Services will auto-restart on failure
# Database authentication is enabled
# Optimized for performance and security
```

---

## Environment Variables

Every generated project includes a `.env.example` file showing all required variables:

```env
# MongoDB (if selected)
MONGODB_URI=mongodb://mongodb:27017/basecompose
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=example

# Authentication (if Auth.js selected)
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# App settings
NODE_ENV=development
```

### Setting Up Variables

**For Local Development:**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**For Production:**
```bash
# Set environment variables
export MONGODB_URI="your_mongo_connection"
export GITHUB_ID="your_github_id"
export GITHUB_SECRET="your_github_secret"
export NEXTAUTH_SECRET="generate_with_openssl rand -base64 32"

# Or use a .env.production file
```

---

## Customization

Your generated project is fully yours to customize:

### Add Features
- Create new pages in `app/`
- Add API routes in `app/api/`
- Create components in `app/components/`

### Modify Styles
- Edit Tailwind CSS in `app/globals.css`
- Create component-specific styles
- Customize theme variables

### Extend Database
- Add new collections (MongoDB) or tables (PostgreSQL)
- Update models and types
- Create migrations (if using relational DB)

### Add More Dependencies
```bash
pnpm add your-package-name
```

The generated code is clean and well-organized, making it easy to extend.

---

## Deployment

Your project is production-ready. Deploy to:

- **Vercel** (Next.js optimized)
- **Docker** (any cloud platform)
- **AWS, Google Cloud, Azure**
- **Railway, Heroku, Render**

Each generated project includes deployment guides in the README.

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in docker-compose.yml
# Or kill the process using the port

# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Make sure MongoDB is running
docker-compose -f docker-compose.dev.yml up mongodb

# Or if running locally
mongod
```

### Environment Variables Missing

```
Error: Missing NEXTAUTH_SECRET
```

**Solution:**
```bash
cp .env.example .env.local
# Edit and fill in all required variables
```

---

## What's Next?

- Read [Development Setup](/dev-setup) for advanced configuration
- Check [FAQ](/faq) for common questions
- See [Contributing](/contributing) to modify Basecompose itself
