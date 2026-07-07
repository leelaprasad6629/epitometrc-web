# Epitome TRC - Full Stack College Project

## 📋 Project Description

Epitome TRC is a comprehensive full-stack web application built for educational purposes. The project integrates modern technologies to deliver a scalable, performant, and user-friendly platform.

## 👥 Team Members

- **Team Member 1**: Leela Prasad Reddy
- **Team Member 2**: Harshul Purohit
- **Team Member 3**: Lalitha Sreya
- **Team Member 4**: Sri Nitya
- **Team Member 5**: Thriveni Reddy

*Update this section with actual team member names and roles*

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui or similar
- **State Management**: Zustand / Redux
- **HTTP Client**: Axios / TanStack Query

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes / Express.js
- **Authentication**: Supabase Auth
- **API Validation**: Zod / Joi

### Database
- **Primary Database**: PostgreSQL (via Supabase)
- **Real-time Features**: Supabase Realtime
- **ORM**: Prisma

### Infrastructure & DevOps
- **Hosting**: Vercel (Frontend) / Railway / Render (Backend)
- **Database Hosting**: Supabase
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Environment Management**: dotenv

## 📁 Folder Structure

```
epitometrc-web/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # Next.js 14 app router
│   │   │   ├── components/    # Reusable React components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── lib/           # Utility functions
│   │   │   ├── pages/         # Page components
│   │   │   ├── styles/        # Global styles
│   │   │   └── types/         # TypeScript type definitions
│   │   ├── public/            # Static assets
│   │   ├── .env.local         # Environment variables (not in repo)
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                    # Backend API (optional if using Next.js API routes)
│       ├── src/
│       │   ├── routes/        # API endpoints
│       │   ├── middleware/    # Custom middleware
│       │   ├── controllers/   # Business logic
│       │   ├── services/      # External services
│       │   ├── utils/         # Helper functions
│       │   └── types/         # TypeScript types
│       └── package.json
│
├── packages/                   # Shared packages
│   ├── db/                    # Database schema & migrations
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── types/                 # Shared TypeScript types
│       └── index.ts
│
├── .github/
│   ├── workflows/             # GitHub Actions CI/CD
│   │   ├── test.yml
│   │   ├── deploy.yml
│   │   └── lint.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── docs/                       # Documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── .env.example                # Example environment variables
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── turbo.json                  # Turborepo configuration (if monorepo)
├── package.json                # Root package.json
├── README.md                   # This file
├── LICENSE                     # MIT License
└── CONTRIBUTING.md             # Contribution guidelines
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git
- Supabase account
- GitHub account

### Step 1: Clone the Repository
```bash
git clone https://github.com/leelaprasad6629/epitometrc-web.git
cd epitometrc-web
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Environment Variables
```bash
cp .env.example .env.local
```

Fill in the `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgresql_connection_string
```

### Step 4: Set Up Database
```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔄 Development Workflow

### Creating a Feature Branch
```bash
# Update main branch
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/your-feature-name
```

### Making Changes
```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/your-feature-name
```

### Creating a Pull Request
1. Go to GitHub and navigate to your branch
2. Click "Compare & pull request"
3. Fill in the PR description
4. Request reviewers from your team
5. Wait for CI/CD checks to pass
6. Get approval and merge

### Code Review Checklist
- [ ] Code follows project style guide
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] PR description is clear and complete

## 🌿 Git Branch Strategy

### Branch Naming Conventions

```
main               # Production-ready code (protected)
dev                # Development integration branch
feature/*          # Feature branches
bugfix/*           # Bug fix branches
hotfix/*           # Hotfix branches for production
release/*          # Release preparation branches
```

### Branch Hierarchy

```
main (Protected)
  └── dev (Protected)
      ├── feature/frontend
      ├── feature/backend
      ├── feature/auth
      ├── feature/database
      ├── feature/devops
      ├── bugfix/issue-name
      ├── hotfix/critical-issue
      └── release/v1.0.0
```

### Workflow

1. **Feature Development**
   - Create branch from `dev`: `git checkout -b feature/frontend dev`
   - Develop and test locally
   - Push to remote and create PR to `dev`
   - After approval, merge to `dev`

2. **Integration Testing**
   - All features merged into `dev`
   - Run full test suite
   - Deploy to staging environment

3. **Release**
   - Create release branch: `git checkout -b release/v1.0.0 dev`
   - Only bug fixes and version bumps
   - Merge to `main` and tag: `git tag -a v1.0.0 -m "Version 1.0.0"`
   - Merge back to `dev`

4. **Hotfix**
   - For critical production bugs
   - Create from `main`: `git checkout -b hotfix/bug-name main`
   - Fix and test thoroughly
   - Merge to `main` and `dev`
   - Tag the version

## 📝 Commit Message Format

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes
- `ci`: CI/CD configuration changes

### Examples

```bash
# Feature commit
git commit -m "feat(auth): add email verification"

# Bug fix
git commit -m "fix(database): handle null values in queries"

# Documentation
git commit -m "docs: update API endpoint documentation"

# With body and footer
git commit -m "feat(api): add user profile endpoint

Adds GET /api/users/:id endpoint to retrieve user profile.
Includes validation and error handling.

Closes #123"
```

## 🚀 Deployment

### Development Environment
- Deployed automatically on push to `dev` branch
- URL: `https://dev.epitometrc.vercel.app` (or similar)

### Staging Environment
- Deployed from `release/*` branches
- Manual deployment trigger
- URL: `https://staging.epitometrc.vercel.app` (or similar)

### Production Environment
- Deployed automatically on push to `main` branch
- Protected branch - requires PR review
- URL: `https://epitometrc.vercel.app` (or similar)

### Deployment Steps

1. **Local Testing**
   ```bash
   npm run build
   npm run test
   ```

2. **Create Pull Request**
   - Push your feature branch
   - Create PR to target branch
   - Wait for CI/CD checks

3. **Code Review**
   - Request team members for review
   - Address feedback

4. **Merge and Deploy**
   - Merge approved PR
   - CI/CD pipeline automatically deploys

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📞 Support

For questions or issues, please:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact team leads

## 📅 Project Timeline

- **Phase 1**: Project setup and infrastructure ✅
- **Phase 2**: Core feature development (in progress)
- **Phase 3**: Testing and optimization
- **Phase 4**: Deployment and launch

---

**Last Updated**: July 2026  
**Status**: Active Development
