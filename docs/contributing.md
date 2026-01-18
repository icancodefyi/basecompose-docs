# Contributing

We welcome contributions from everyone! This guide explains how to contribute to Basecompose.

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [CODE_OF_CONDUCT.md](https://github.com/icancodefyi/basecompose/blob/master/CODE_OF_CONDUCT.md) before participating.

---

## Ways to Contribute

### 1. Report Bugs

Found a bug? Create an issue on GitHub:

**How to report:**
1. Check existing issues to avoid duplicates
2. Provide clear title and description
3. Include steps to reproduce
4. Share error messages and logs
5. Mention your OS and Node.js version

**Example issue:**
```
Title: MongoDB connection fails on Windows with spaces in path

Description:
When the project path contains spaces, MongoDB connection fails with "ECONNREFUSED"

Steps to reproduce:
1. Generate project with path "C:\My Projects\test-app"
2. Set MONGODB_URI in .env.local
3. Run `pnpm dev`

Expected: Application starts
Actual: Error - Cannot connect to MongoDB

Environment:
- OS: Windows 11
- Node.js: v18.17.0
- pnpm: 8.9.0
```

### 2. Suggest Features

Have an idea? Create a feature request:

1. Describe the feature and use case
2. Explain why it's valuable
3. Provide examples or mockups
4. Discuss potential implementation

### 3. Submit Pull Requests

Fix bugs or add features with code:

**Process:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit pull request
6. Respond to feedback
7. Get merged!

### 4. Improve Documentation

Help improve docs and guides:

- Fix typos
- Add examples
- Clarify instructions
- Translate content
- Create tutorials

### 5. Add Templates

Create new templates or addons:

- Framework templates (Vue, React, etc.)
- Database templates (MySQL, Redis, etc.)
- Authentication providers
- Demo components

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/basecompose.git
cd basecompose
git remote add upstream https://github.com/icancodefyi/basecompose.git
```

### 2. Create Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git reset --hard upstream/main

# Create feature branch
git checkout -b feature/my-feature
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Make Changes

Edit files and test locally:

```bash
pnpm dev
```

---

## Project Structure for Contributors

Understanding the codebase is important:

- **`app/`** - Main Next.js application
- **`packages/types/`** - TypeScript definitions
- **`packages/engine/`** - Generation engine
- **`templates/`** - Project templates
- **`lib/`** - Shared utilities

See [Project Structure](/project-structure) for complete overview.

---

## Adding a New Technology

Want to add support for a new database or framework?

### 1. Update Technology Catalog

Edit `packages/types/stack-config.ts`:

```typescript
// Add new database option
export const DATABASES = {
  // ... existing
  mysql: {
    name: 'MySQL',
    addon: 'databases/mysql',
    package: 'mysql2',
    version: '^3.0.0',
    environment: 'DATABASE_URL',
  },
};
```

### 2. Create Addon Template

Create `templates/databases/mysql/`:

```
templates/databases/mysql/
├── lib/
│   ├── db.ts                # Connection setup
│   └── queries.ts           # Helper functions
├── .env.example
├── package.json             # MySQL dependencies
├── README.md                # Setup instructions
└── migrations/              # Database migrations
    └── 001_schema.sql
```

**`package.json` example:**

```json
{
  "dependencies": {
    "mysql2": "^3.0.0"
  }
}
```

**`lib/db.ts` example:**

```typescript
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'basecompose',
});

export default connection;
```

### 3. Update Environment Variables

Add to `.env.example` in template:

```env
DATABASE_URL=mysql://user:password@localhost:3306/database_name
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=basecompose
```

### 4. Handle Generation Logic

In `packages/engine/generate.ts`, update addon selection:

```typescript
if (database === 'mysql') {
  addons.push('databases/mysql');
  envVariables.push('DATABASE_URL', 'DB_HOST', 'DB_USER');
}
```

### 5. Test Locally

```bash
# Generate with new technology
pnpm dev

# Visit http://localhost:3000/api/generate?database=mysql
```

---

## Adding Templates or Components

### Create a New Addon Template

Example: React component library addon

**1. Create template directory:**

```
templates/addons/react-components/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── index.ts
├── styles/
│   └── components.css
├── package.json
├── README.md
└── meta.json
```

**2. Define in `meta.json`:**

```json
{
  "name": "React Components",
  "version": "1.0.0",
  "description": "Pre-built React components",
  "type": "addon"
}
```

**3. Register in generation logic**

### Create a Framework Template

Example: Vite template

**1. Create template directory:**

```
templates/frameworks/vite/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── styles.css
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

**2. Update stack-config:**

```typescript
export const FRAMEWORKS = {
  // ... existing
  vite: {
    name: 'Vite',
    version: '^4.0.0',
    dependencies: ['vite', 'react', 'react-dom'],
  },
};
```

---

## Code Style & Standards

### TypeScript

- Use strict type checking
- Define interfaces for objects
- Avoid `any` type
- Use proper generics

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// Avoid
function getUser(id) {
  // ...
  return user as any;
}
```

### React Components

- Use functional components
- Use hooks (not class components)
- Prop types/interfaces required
- Memoize expensive computations

```typescript
// Good
interface CardProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// Avoid
function Card(props) {
  return <div>{props.children}</div>;
}
```

### File Organization

```
app/
├── api/
│   └── generate/
│       └── route.ts          # Single file = single route
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx   # Tests in same folder
│   └── index.ts              # Exports for easy import
└── lib/
    ├── utils.ts
    └── utils.test.ts         # Colocated tests
```

### Naming Conventions

- Components: `PascalCase` (e.g., `UserCard.tsx`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `UPPER_CASE` (e.g., `MAX_RETRIES`)
- Variables: `camelCase`
- Directories: `lowercase`

---

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test utils.test.ts

# Watch mode
pnpm test -- --watch
```

**Example test:**

```typescript
// lib/utils.test.ts
import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('Invalid');
  });
});
```

### Manual Testing

For new features:

1. Generate a project with the new option
2. Extract and run the project
3. Verify functionality works
4. Check for errors in console
5. Test edge cases

---

## Commit Messages

Write clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add MySQL database support"
git commit -m "fix: resolve MongoDB connection timeout"
git commit -m "docs: improve environment variables guide"

# Format: [type]: [description]
# Types: feat, fix, docs, refactor, test, chore
```

### Commit Guidelines

- Keep commits small and focused
- One feature per commit
- Write in present tense
- Reference issues: `fix: resolve issue #123`

---

## Pull Request Process

### Before Submitting

1. **Test your code:**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   pnpm build
   ```

2. **Update documentation** if needed

3. **Check for conflicts:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How to test this change

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### After Submission

- Respond to feedback promptly
- Make requested changes in new commits
- Re-request review after changes
- Be patient - reviews take time

---

## Becoming a Maintainer

After multiple quality contributions, you may be invited to become a maintainer.

**Responsibilities:**
- Review pull requests
- Merge approved PRs
- Manage issues
- Release new versions
- Mentor new contributors

---

## Release Process

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (1.1.0) - New features
- **PATCH** (1.0.1) - Bug fixes

### Changelog

Update `changelog.md` with:
- New features
- Bug fixes
- Breaking changes

---

## Questions?

- 📖 Check [FAQ](/faq)
- 💬 Open a discussion on GitHub
- 📧 Email: [contact info]
- 🐦 Follow updates on Twitter

---

## Recognition

We appreciate all contributions! Contributors are recognized in:
- Commit history
- Changelog
- GitHub contributors page
- Project README (for significant contributions)

---

Thank you for contributing to Basecompose! 🎉
