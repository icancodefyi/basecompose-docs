# Development Setup

Complete guide to setting up your development environment for Basecompose.

---

## Prerequisites

Before starting, ensure you have:

### Required Software

- **Node.js** - v18 or higher (check: `node --version`)
- **pnpm** - v8 or higher (install: `npm install -g pnpm`)
- **Git** - For cloning the repository
- **Docker** - For MongoDB (optional if using managed service)

### System Requirements

- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB for repository and dependencies
- **OS:** Windows, macOS, or Linux

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/icancodefyi/basecompose.git
cd basecompose
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all packages for the monorepo (app, packages, templates).

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**Minimum required:**

```env
MONGODB_URI=mongodb://root:example@localhost:27017/basecompose
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=example

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

NODE_ENV=development
```

See [Environment Variables](/env-vars) for complete setup guide.

---

## Database Setup

### Option 1: Docker (Recommended)

**Install Docker:**
- [Windows](https://docs.docker.com/desktop/install/windows-install/)
- [macOS](https://docs.docker.com/desktop/install/mac-install/)
- [Linux](https://docs.docker.com/desktop/install/linux-install/)

**Start MongoDB:**

```bash
docker run -d \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  -p 27017:27017 \
  mongo:latest
```

**Verify connection:**

```bash
docker exec mongodb mongosh -u root -p example --eval "db.version()"
```

**Stop MongoDB:**

```bash
docker stop mongodb
docker rm mongodb
```

### Option 2: Local MongoDB

**macOS (Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer
3. MongoDB runs as Windows Service

**Linux (Ubuntu):**

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option 3: Cloud MongoDB (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
5. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/basecompose
```

---

## Running the Development Server

### Start the Application

```bash
pnpm dev
```

Output should show:

```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Access the App

- **Web UI:** [http://localhost:3000](http://localhost:3000)
- **API:** [http://localhost:3000/api](http://localhost:3000/api)
- **Chat:** [http://localhost:3000/chat](http://localhost:3000/chat)

### Hot Reload

Changes to files automatically reload. You don't need to restart the server.

---

## Building for Production

### Build the Project

```bash
pnpm build
```

This:
- Compiles TypeScript
- Optimizes JavaScript
- Builds Next.js app
- Creates `.next/` folder

### Run Production Build

```bash
pnpm start
```

---

## Docker Development

### Run Entire Stack in Docker

```bash
# Build Docker image
docker build -t basecompose .

# Run with MongoDB
docker run \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongodb:27017/basecompose \
  --link mongodb:mongodb \
  basecompose
```

### Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://root:example@mongodb:27017/basecompose
      NODE_ENV: development
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

**Run stack:**

```bash
docker-compose up
```

---

## Monorepo Structure

Basecompose is a monorepo with multiple workspaces:

```
basecompose/
├── app/              # Main Next.js application
├── packages/
│   ├── engine/       # Generation engine
│   ├── types/        # TypeScript types & interfaces
│   └── cli/          # Command-line interface (future)
├── templates/        # Template system
├── scripts/          # Setup scripts
└── pnpm-workspace.yaml
```

**Manage workspaces:**

```bash
# Install in specific workspace
pnpm -F packages/engine install

# Build all workspaces
pnpm -r build

# Run script in all workspaces
pnpm -r --filter "!{app,packages/**}" test
```

---

## Development Scripts

Common commands for development:

```bash
# Start dev server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Run tests
pnpm test

# Build production
pnpm build

# Run production build
pnpm start

# Clean build artifacts
pnpm clean
```

---

## Testing

### Run Tests

```bash
pnpm test
```

### Run Specific Test File

```bash
pnpm test -- path/to/test.test.ts
```

### Watch Mode

```bash
pnpm test -- --watch
```

### Coverage Report

```bash
pnpm test -- --coverage
```

---

## Debugging

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**Start dev server in debug mode:**

```bash
NODE_OPTIONS='--inspect' pnpm dev
```

### Browser DevTools

Open DevTools in your browser (F12) to debug client-side code.

### API Testing

Use tools like:
- **Postman** - GUI tool
- **curl** - Command line
- **REST Client** extension in VS Code

**Example API call:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "SaaS",
    "framework": "next",
    "database": "mongodb",
    "auth": "authjs"
  }'
```

---

## Troubleshooting

### "MongoDB connection refused"

**Problem:** Database not running

**Solution:**
```bash
# Check Docker
docker ps | grep mongodb

# Start MongoDB
docker start mongodb
# or
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### "pnpm command not found"

**Problem:** pnpm not installed

**Solution:**
```bash
npm install -g pnpm
```

### "Port 3000 already in use"

**Problem:** Another app on port 3000

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### "Node version too old"

**Problem:** Node.js < v18

**Solution:**
```bash
# Update Node.js
nvm install 18  # If using nvm
# or
# Download from nodejs.org
```

### "Module not found" errors

**Problem:** Missing dependencies

**Solution:**
```bash
# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build errors with TypeScript

**Problem:** Type checking fails

**Solution:**
```bash
# Run type check to see errors
pnpm type-check

# Fix common issues
pnpm lint:fix

# Rebuild
pnpm build
```

---

## IDE Setup

### VS Code (Recommended)

**Install extensions:**
1. ESLint - `dbaeumer.vscode-eslint`
2. Prettier - `esbenp.prettier-vscode`
3. TypeScript Vue Plugin - `Vue.volar`
4. Thunder Client (API testing) - `rangav.vscode-thunder-client`

**.vscode/settings.json:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm

All settings work out of the box. Just open the project.

---

## Next Steps

1. Read [Architecture](/architecture) to understand the system
2. Check [Project Structure](/project-structure) for file organization
3. Review [Contributing](/contributing) to contribute changes
4. See [Templates](/templates) to understand template system

---

For additional help, see [FAQ](/faq) or check [GitHub Issues](https://github.com/icancodefyi/basecompose/issues).
