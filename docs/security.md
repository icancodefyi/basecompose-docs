# Security & Code of Conduct

Information about security practices and community guidelines for Basecompose.

---

## Security Guidelines

### Security First

At Basecompose, we take security seriously. All generated code follows OWASP best practices and industry standards.

### Generated Code Security

All generated projects include security best practices:

- **Input Validation:** Sanitize and validate all user input
- **Authentication:** NextAuth.js with secure session handling
- **Authorization:** Role-based access control ready
- **HTTPS:** Enforced in production
- **Dependencies:** Regular updates and vulnerability scanning
- **Secrets:** Environment variable management

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. **Email:** security@basecompose.dev
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

**Response Timeline:**
- Initial response: 48 hours
- Investigation: 1 week
- Patch release: Determined by severity
- Public disclosure: After patch release

### Vulnerability Severity Levels

**CRITICAL (0-1 days to patch)**
- Remote code execution
- Authentication bypass
- Data breach potential
- Active exploitation

**HIGH (1-7 days to patch)**
- Significant privilege escalation
- Security bypass
- Denial of service

**MEDIUM (1-2 weeks to patch)**
- Information disclosure
- Partial bypass
- Configuration issues

**LOW (1 month to patch)**
- Minor information leak
- Non-critical bypass
- Documentation issues

---

## Secure Development Practices

### For Basecompose Contributors

**Code Review:**
- All changes reviewed before merge
- Security focus in every review
- Tests required for new features

**Dependencies:**
- Regular audits: `npm audit`
- Lock files committed: `pnpm-lock.yaml`
- Renovate bot for updates

**Secrets Management:**
- Never commit `.env.local`
- Use `.env.example` for templates
- Rotate secrets regularly

### For Generated Projects

**Secure by Default:**

```typescript
// NextAuth.js session protection
export async function getServerSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

// Environment secrets - never exposed to client
const apiSecret = process.env.API_SECRET; // Backend only

// Input validation
import { z } from 'zod';
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});
```

---

## Dependency Security

### Managing Dependencies

Generated projects include carefully selected, secure dependencies:

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "mongodb": "^6.0.0",
    "next-auth": "^5.0.0"
  }
}
```

### Vulnerability Scanning

```bash
# Check for vulnerabilities
pnpm audit

# Fix auto-fixable issues
pnpm audit --fix

# Review manually
npm list
```

### Keeping Dependencies Updated

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm update package-name@latest

# Update all packages
pnpm update -r
```

---

## API Security

### Authentication

All API endpoints should validate authentication:

```typescript
// app/api/protected/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Process authenticated request
  return Response.json({ data: 'protected' });
}
```

### CORS Protection

```typescript
// Set appropriate CORS headers
const headers = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation

```typescript
// Always validate input
import { z } from 'zod';

const UserInput = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
  name: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = UserInput.parse(data);
    // Process validated data
  } catch (error) {
    return Response.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }
}
```

---

## Database Security

### MongoDB Security

**Connection:**
```env
# Use authentication
MONGODB_URI=mongodb://user:password@host:port/database

# Enable SSL in production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?ssl=true
```

**Queries:**
```typescript
// Use parameterized queries (MongoDB driver does this)
const result = await db
  .collection('users')
  .findOne({ _id: new ObjectId(userId) });

// ✅ Safe - MongoDB driver prevents injection
// ❌ Avoid - Manual string concatenation
```

**Indexes:**
```typescript
// Create indexes for performance
await db.collection('users').createIndex({ email: 1 }, { unique: true });
```

---

## Secrets & Environment Variables

### Managing Secrets

**Development:**
```env
# .env.local (never commit this)
MONGODB_URI=mongodb://user:pass@localhost:27017/dev
NEXTAUTH_SECRET=dev-secret-only
```

**Production:**
- Use hosting platform's secret management
- Rotate secrets regularly
- Never log sensitive values

**Vercel:**
```bash
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
```

**Docker:**
```bash
docker run \
  -e MONGODB_URI="mongodb://..." \
  -e NEXTAUTH_SECRET="secret" \
  my-app
```

### Accessing Secrets Safely

```typescript
// ✅ Backend only - exposed to server
const mongoUri = process.env.MONGODB_URI;

// ❌ Never expose to frontend
// process.env.SENSITIVE_SECRET in client code

// ✅ Safe for frontend
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

---

## Security Headers

Add security headers to all responses:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## Authentication Security

### Password Security

```typescript
// Hash passwords (NextAuth.js handles this)
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Session Security

```typescript
// NextAuth.js configuration
export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};
```

### OAuth Security

When using GitHub/Google OAuth:

- **Tokens:** Stored securely server-side
- **Scopes:** Request minimal permissions
- **Callback:** Validate against registered URIs

```typescript
// GitHub OAuth setup
oauth: {
  github: {
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  },
},
```

---

## Code Quality & Security

### Linting

```bash
# Run ESLint with security plugins
pnpm lint

# Fix issues automatically
pnpm lint:fix
```

### Type Safety

```typescript
// TypeScript catches many security issues
// ✅ Type-safe queries
const user: User = await db.findOne({ id });

// ❌ Type error caught at compile
const data: string = 123; // Error!
```

### Testing

```bash
# Write security tests
pnpm test -- security

// Example: Test auth enforcement
it('should reject unauthenticated requests', async () => {
  const response = await fetch('/api/protected');
  expect(response.status).toBe(401);
});
```

---

## Community Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive community for all.

### Expected Behavior

- **Be Respectful:** Treat everyone with courtesy
- **Be Inclusive:** Welcome diversity of thought and background
- **Be Constructive:** Contribute positively to discussions
- **Be Transparent:** Communicate openly and honestly
- **Be Helpful:** Support fellow community members

### Unacceptable Behavior

- Harassment, abuse, or discrimination
- Intimidation or threats
- Unwelcome sexual advances or comments
- Doxxing or sharing private information
- Spam or off-topic posts

### Reporting Issues

If you witness or experience unacceptable behavior:

1. **Do NOT** engage publicly
2. **Report to:** conduct@basecompose.dev
3. Include:
   - What happened
   - When it occurred
   - Who was involved
   - Any relevant links

### Enforcement

Violations will be handled with:
- Private warning (first offense)
- Temporary ban (repeated offense)
- Permanent ban (severe violation)

All reports are confidential.

---

## Security Best Practices Checklist

### For Every Generated Project

- [ ] Change default secrets
- [ ] Set up environment variables
- [ ] Configure allowed origins
- [ ] Enable HTTPS in production
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Regular dependency updates
- [ ] Monitor for vulnerabilities
- [ ] Plan security tests

### For Deployment

- [ ] Use HTTPS only
- [ ] Set strong secrets
- [ ] Enable firewall rules
- [ ] Configure backups
- [ ] Monitor logs
- [ ] Set up alerts
- [ ] Regular security audits
- [ ] Keep systems updated

### For Contributors

- [ ] Never commit secrets
- [ ] Review code for security
- [ ] Write security tests
- [ ] Follow best practices
- [ ] Report vulnerabilities responsibly

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [NextAuth.js Security](https://next-auth.js.org/security)

---

## Questions?

Have security concerns or questions?

- 📧 Email: security@basecompose.dev
- 🐛 Report issues responsibly
- 💬 Open discussions

Your security matters to us. 🔒
