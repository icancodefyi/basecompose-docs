# Frequently Asked Questions

Common questions and answers about Basecompose.

---

## General Questions

### What is Basecompose?

Basecompose is an AI-powered boilerplate generator that creates full-stack web applications instantly. Select your technology choices (framework, database, authentication), and get a production-ready project.

### How is it different from other generators?

- **Instant:** Generate in seconds, not minutes
- **Modern Stack:** Uses latest technologies (Next.js 16, TypeScript, etc.)
- **AI-Powered:** Use natural language to generate projects
- **Production-Ready:** Includes best practices out of the box
- **Open Source:** Community-driven and transparent
- **Extensible:** Easy to add new technologies and templates

### Who is Basecompose for?

- **Startups:** Quickly launch MVP without boilerplate
- **Developers:** Skip repetitive setup, focus on features
- **Teams:** Consistent project structure across team
- **Learners:** Understand full-stack architecture
- **Agencies:** Rapid prototyping for clients

### Is it free?

Yes! Basecompose is open source and completely free. You can use it online or self-host locally.

---

## Getting Started

### How do I get started?

**Fastest way (2 minutes):**

1. Go to [basecompose.com](https://basecompose.com)
2. Select your technologies
3. Download generated project
4. Extract and run

**Local setup (5 minutes):**

See [Getting Started](/getting-started) for detailed instructions.

### What technologies are supported?

**Current:**
- **Frontend:** Next.js 16
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **Deployment:** Docker-ready

**Planned:**
- Backend frameworks: Node.js, FastAPI
- Databases: PostgreSQL, MySQL, Redis
- Auth providers: Clerk, Auth0
- Deployment: Vercel, Railway, etc.

See [Technologies](/technologies) for full list.

### Can I use a different database?

Currently, MongoDB is the default. To use a different database, you can:

1. Generate the project
2. Modify `lib/mongodb.ts` for your database
3. Update `package.json` dependencies
4. Update environment variables

Alternatively, wait for PostgreSQL/MySQL support (coming soon).

### Do I need Docker?

No, Docker is optional. You can:
- **With Docker:** Run `docker-compose up`
- **Without Docker:** Install MongoDB locally and run `pnpm dev`

See [Development Setup](/dev-setup) for both options.

---

## Generated Projects

### What's included in generated projects?

Generated projects include:

- **Setup:** TypeScript, ESLint, Prettier configured
- **UI:** Tailwind CSS with components
- **Database:** MongoDB with connection setup
- **Authentication:** NextAuth.js with GitHub/Google OAuth
- **API:** Example endpoints
- **Documentation:** Setup and deployment guides
- **Docker:** Ready to deploy
- **Examples:** Demo components and pages

### Can I modify the generated project?

Absolutely! Generated projects are fully yours to modify:

- Add dependencies
- Create new components
- Change database
- Modify authentication
- Deploy anywhere

Think of it as a starting point, not a lock-in.

### How do I add a new dependency?

```bash
cd generated-project
pnpm add package-name
# or with specific version
pnpm add package-name@^1.2.3
```

### How do I remove a feature (e.g., authentication)?

1. Remove from imports in `app/layout.tsx` or `app/page.tsx`
2. Delete related files: `app/api/auth/`
3. Remove from `package.json`: `pnpm remove next-auth`
4. Update environment variables

---

## Development & Deployment

### How do I run the project locally?

```bash
# Navigate to project
cd my-project

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start dev server
pnpm dev

# Visit http://localhost:3000
```

See [Development Setup](/dev-setup) for detailed instructions.

### How do I deploy the project?

**Docker (Recommended):**

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_uri" \
  my-app
```

**Vercel (Next.js Recommended):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Railway, Render, Heroku:** See framework documentation

See [Deployment Options](/usage-guide#deployment) in Usage Guide.

### What are the environment variables?

Required variables depend on selected technologies:

- `MONGODB_URI` - Database connection
- `NEXTAUTH_URL` - App URL
- `NEXTAUTH_SECRET` - Session encryption
- `GITHUB_ID`, `GITHUB_SECRET` - OAuth (if selected)

See [Environment Variables](/env-vars) for complete guide.

### How do I connect to my MongoDB?

**Option 1: Local MongoDB**

```env
MONGODB_URI=mongodb://localhost:27017/basecompose
```

**Option 2: MongoDB Atlas (Cloud)**

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

**Option 3: Docker**

```env
MONGODB_URI=mongodb://mongodb:27017/basecompose
```

See [Environment Variables](/env-vars) for detailed setup.

### Can I use a hosted database service?

Yes! You can use:

- **MongoDB Atlas** (MongoDB)
- **AWS RDS** (PostgreSQL, MySQL)
- **DigitalOcean Managed Databases**
- **PlanetScale** (MySQL)
- **Neon** (PostgreSQL)

Just update the connection string in `.env.local`.

---

## Customization & Extension

### How do I customize the generated project?

Generated projects are completely customizable:

1. **Add components:** Create in `app/components/`
2. **Add pages:** Create in `app/[route]/page.tsx`
3. **Add API endpoints:** Create in `app/api/[route]/route.ts`
4. **Change styles:** Modify `app/globals.css` or use Tailwind
5. **Update config:** Edit `next.config.ts`, `tsconfig.json`

### How do I add a new page?

```typescript
// app/about/page.tsx
export default function About() {
  return (
    <main>
      <h1>About Us</h1>
      {/* Your content */}
    </main>
  );
}

// Accessible at /about
```

### How do I create a new API endpoint?

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  // Your logic
  return Response.json({ users: [] });
}

// Accessible at /api/users
```

### How do I create a new template?

See [Templates](/templates) for complete guide on creating custom templates.

---

## Troubleshooting

### I got "MongoDB connection refused" error

**Causes:**
- MongoDB not running
- Wrong connection string
- Network issues

**Solutions:**

```bash
# Start MongoDB (if using local)
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Check connection
docker exec mongodb mongosh --eval "db.version()"

# Update .env.local if needed
MONGODB_URI=mongodb://mongodb:27017/basecompose
```

See [Troubleshooting](/dev-setup#troubleshooting).

### Port 3000 is already in use

**Solution:**

```bash
# Use different port
PORT=3001 pnpm dev

# Or kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Environment variables not loading

**Solution:**

1. Restart dev server: `Ctrl+C` then `pnpm dev`
2. Verify `.env.local` exists and is readable
3. Check format: `KEY=value` (no spaces around =)
4. Verify file is in root directory, not in `app/`

### "Module not found" errors

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript errors

**Solution:**

```bash
# Check for type issues
pnpm type-check

# Fix common issues
pnpm lint:fix

# Try full rebuild
pnpm clean
pnpm build
```

See [Troubleshooting](/dev-setup#troubleshooting) for more solutions.

---

## Performance & Optimization

### How do I improve performance?

**Development:**
- Use Next.js dev server: `pnpm dev`
- Enable fast refresh

**Production:**
- Build for production: `pnpm build`
- Use Next.js Image optimization
- Enable caching headers
- Use CDN for static assets

### What's the typical bundle size?

- **Uncompressed:** ~2-3 MB
- **Gzipped:** ~800 KB - 1 MB
- **Generated project:** ~1-3 MB

### How do I monitor performance?

- **Next.js Analytics:** Built-in performance tracking
- **Web Vitals:** Core Web Vitals monitoring
- **Bundle Analyzer:** Analyze build size

---

## Security

### Is the generated code secure?

Yes, generated projects follow security best practices:

- **Input validation:** Sanitize user input
- **Authentication:** NextAuth.js handles sessions
- **HTTPS:** Use in production
- **Environment secrets:** Never expose in code
- **CSRF protection:** Built into Next.js

See [Security](/security) for detailed guidelines.

### How do I protect API endpoints?

```typescript
// Require authentication
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your protected logic
}
```

### How do I handle sensitive data?

- **Secrets:** Store in `.env.local` (never commit)
- **Credentials:** Use environment variables
- **API keys:** Keep on backend, never expose to client
- **Tokens:** Store securely (httpOnly cookies for sessions)

---

## Community & Support

### How do I get help?

1. **Check [FAQ](/faq)** - Most questions answered here
2. **Read [Documentation](/docs)** - Comprehensive guides
3. **GitHub Issues** - Search and create issues
4. **GitHub Discussions** - Ask questions
5. **Email:** [contact info]

### Can I contribute?

Absolutely! See [Contributing](/contributing) for details on:
- Reporting bugs
- Suggesting features
- Submitting code
- Improving documentation

### How do I stay updated?

- 🌟 Star on [GitHub](https://github.com/icancodefyi/basecompose)
- 🐦 Follow on Twitter
- 📧 Subscribe to newsletter
- 👀 Watch repository for releases

---

## Advanced Topics

### How do I use the generation API programmatically?

```typescript
// Generate project via API
const response = await fetch('http://localhost:3000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'SaaS',
    framework: 'next',
    database: 'mongodb',
    auth: 'authjs',
  }),
});

// response is binary TAR file
```

See [Usage Guide](/usage-guide) for examples.

### How does the template system work?

Templates are organized as:
- **Base templates:** Framework setup (Next.js)
- **Addon templates:** Features (MongoDB, Auth.js)
- **Shared configs:** Common settings

See [Templates](/templates) and [Architecture](/architecture) for deep dive.

### Can I self-host Basecompose?

Yes! Basecompose is open source:

```bash
# Clone repository
git clone https://github.com/icancodefyi/basecompose.git

# Install and run
cd basecompose
pnpm install
pnpm dev

# Access at http://localhost:3000
```

See [Development Setup](/dev-setup).

---

## More Questions?

- 📖 [Full Documentation](/docs)
- 💬 [GitHub Discussions](https://github.com/icancodefyi/basecompose/discussions)
- 🐛 [Report Issues](https://github.com/icancodefyi/basecompose/issues)
- 📧 Contact us

We're here to help! 🚀
