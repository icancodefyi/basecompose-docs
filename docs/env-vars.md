# Environment Variables

Every Basecompose-generated project includes environment variables for configuration. This guide explains what each variable does and how to set them.

---

## Overview

Environment variables are settings that configure your application without changing code. Every generated project includes a `.env.example` file showing all available variables.

### Two Files

- **`.env.example`** - Template with all possible variables (committed to git)
- **`.env.local`** - Your actual values (NOT committed to git)

### Setup

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

---

## MongoDB Variables

Included if you select MongoDB in your stack.

### Development

```env
# Connection string for MongoDB
MONGODB_URI=mongodb://root:example@localhost:27017/basecompose

# Authentication credentials
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=example
```

### Production

```env
# Use full connection string with credentials
MONGODB_URI=mongodb://root:securepass@mongo.example.com:27017/basecompose?ssl=true

# Strong credentials
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=<generate_strong_password>
```

### How It Works

The connection string format:
```
mongodb://[username]:[password]@[host]:[port]/[database]
```

Example breakdown:
```
mongodb://root:example@localhost:27017/basecompose
  ├─ mongodb:// - Protocol
  ├─ root - Username
  ├─ example - Password
  ├─ localhost - Host
  ├─ 27017 - Port
  └─ basecompose - Database name
```

---

## Authentication (Auth.js) Variables

Included if you select Auth.js in your stack. Requires setting up OAuth applications.

### GitHub OAuth

```env
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret
```

**How to get:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps → New OAuth App
2. Fill in:
   - Application name: "Basecompose Local"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. GitHub provides the ID and secret
4. Copy them to `.env.local`

### Google OAuth

```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**How to get:**
1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret
7. Add to `.env.local`

### NextAuth Configuration

```env
# Your application URL
NEXTAUTH_URL=http://localhost:3000

# Secret for signing and encrypting tokens
NEXTAUTH_SECRET=<generate_random_secret>
```

**Generating NEXTAUTH_SECRET:**

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (using Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Production URL:**
```env
# Change for production deployment
NEXTAUTH_URL=https://yourdomain.com
```

---

## Next.js Variables

Standard Next.js configuration:

```env
# Environment mode
NODE_ENV=development
# or
NODE_ENV=production
```

### Available Values

- `development` - Dev server with hot reload and detailed errors
- `production` - Optimized builds and error logging
- `test` - For running tests

---

## Docker & Service Variables

When running with Docker Compose, services communicate via hostnames:

```env
# In development (Docker)
MONGODB_URI=mongodb://mongodb:27017/basecompose

# In development (Local)
MONGODB_URI=mongodb://localhost:27017/basecompose

# In production
MONGODB_URI=mongodb://[remote-host]:27017/basecompose
```

---

## Example .env.local Files

### Minimal Setup

```env
MONGODB_URI=mongodb://root:example@mongodb:27017/basecompose
MONGODB_ROOT_USERNAME=root
MONGODB_ROOT_PASSWORD=example

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret

NODE_ENV=development
```

### Production Setup

```env
MONGODB_URI=mongodb://user:securepass@mongo.example.com:27017/prod_db
MONGODB_ROOT_USERNAME=prod_user
MONGODB_ROOT_PASSWORD=<strong-password>

NEXTAUTH_URL=https://myapp.com
NEXTAUTH_SECRET=<generated-secure-secret>

GITHUB_ID=production_github_id
GITHUB_SECRET=production_github_secret

NODE_ENV=production
```

---

## Loading Variables

### Development (Local)

Next.js automatically loads `.env.local`:

```bash
pnpm dev
# Reads .env.local automatically
```

Access in code:

```typescript
const mongoUri = process.env.MONGODB_URI;
```

### Production (Docker)

Set via Docker environment:

```bash
docker run \
  -e MONGODB_URI="mongodb://..." \
  -e NEXTAUTH_SECRET="secret" \
  your-image
```

Or with Docker Compose:

```yaml
services:
  app:
    environment:
      MONGODB_URI: ${MONGODB_URI}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
```

### Environment File (Docker)

```bash
# Create .env file
docker-compose --env-file .env up
```

---

## Security Best Practices

1. **Never Commit `.env.local`** - Add to `.gitignore` (already done)
2. **Use Strong Passwords** - Especially for production
3. **Rotate Secrets** - Regularly update API keys and tokens
4. **Use Secrets Manager** - For production (AWS Secrets Manager, etc.)
5. **Different Values Per Environment** - Dev, staging, and production should have different values
6. **Validate on Startup** - Check required variables exist

---

## Validating Variables

Add this to your app to catch missing variables early:

```typescript
// lib/env.ts
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Use it
export const MONGODB_URI = requireEnv('MONGODB_URI');
export const NEXTAUTH_SECRET = requireEnv('NEXTAUTH_SECRET');
```

---

## Troubleshooting

### Variables Not Loading

```
Error: Cannot read property 'MONGODB_URI' of undefined
```

**Solution:**
- Check `.env.local` exists
- Restart dev server: `Ctrl+C` then `pnpm dev`
- Verify file has correct format: `KEY=value`

### Wrong Values in Production

**Solution:**
- Verify environment variables in Docker container:
  ```bash
  docker exec <container> env | grep MONGODB
  ```
- Check Docker Compose or deployment configuration

---

For more on deployment, see [Getting Started](/getting-started).
