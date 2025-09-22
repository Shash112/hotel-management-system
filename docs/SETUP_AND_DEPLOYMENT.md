# Hotel Management System - Setup & Deployment Guide

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prisma
  - TypeScript Importer

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd hotel-management-system

# Install dependencies
npm install

# Or using yarn
yarn install
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your settings
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"
```

### Step 3: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### Step 4: Start Development Server

```bash
# Start the development server
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

### Step 5: Verify Installation

1. Open `http://localhost:3000` in your browser
2. You should see the login page
3. Use default credentials:
   - **Admin**: admin@hotel.com / admin123
   - **Waiter**: waiter@hotel.com / waiter123
   - **Cashier**: cashier@hotel.com / cashier123
   - **Cook**: cook@hotel.com / cook123

## 🧪 Development Workflow

### Running Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests
npm test && npm run test:e2e
```

### Database Management

```bash
# Open Prisma Studio (Database GUI)
npm run db:studio

# Reset database (WARNING: Deletes all data)
npm run db:push --force-reset

# Generate new migration
npm run db:migrate
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare for Deployment

1. **Update Environment Variables**:
```bash
# .env.production
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secure-secret-key"
```

2. **Update Prisma Schema** (if using PostgreSQL):
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

#### Step 2: Deploy to Vercel

1. **Connect GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository

2. **Configure Project**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   ```
   NEXTAUTH_URL = https://your-app.vercel.app
   NEXTAUTH_SECRET = your-secret-key
   DATABASE_URL = your-postgres-connection-string
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

#### Step 3: Set Up Production Database

1. **Vercel Postgres**:
   - Go to Vercel Dashboard → Storage
   - Create Postgres database
   - Copy connection string
   - Add as `DATABASE_URL` environment variable

2. **Alternative - External Database**:
   - Supabase, PlanetScale, or Railway
   - Get connection string
   - Add as `DATABASE_URL` environment variable

3. **Run Migrations**:
```bash
# After deployment, run this in Vercel CLI or add to build script
npx prisma db push
npx prisma db seed
```

### Option 2: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/hotel_management
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=hotel_management
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Step 3: Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Traditional Server Deployment

#### Step 1: Server Setup

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

#### Step 2: Application Deployment

```bash
# Clone repository
git clone <your-repo-url>
cd hotel-management-system

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "hotel-management" -- start
pm2 save
pm2 startup
```

#### Step 3: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Application URL | `https://your-app.com` |
| `NEXTAUTH_SECRET` | Secret key for JWT | `your-super-secret-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
npm install next-optimized-images

# Enable compression
npm install compression
```

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### Caching Strategy

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   ```bash
   # Check DATABASE_URL format
   # Ensure database is running
   # Verify credentials
   ```

2. **Build Failures**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **Authentication Issues**:
   ```bash
   # Check NEXTAUTH_SECRET is set
   # Verify NEXTAUTH_URL matches deployment URL
   # Clear browser cookies
   ```

4. **Environment Variables**:
   ```bash
   # Check .env.local exists
   # Verify variable names match exactly
   # Restart development server after changes
   ```

### Health Checks

```bash
# Check application health
curl http://localhost:3000/api/health

# Check database connection
npm run db:studio

# Check environment variables
node -e "console.log(process.env.NEXTAUTH_URL)"
```

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Build successful locally
- [ ] Security review completed

### Post-Deployment
- [ ] Application accessible
- [ ] Login functionality working
- [ ] Database connection established
- [ ] All user roles functional
- [ ] Performance monitoring active

### Monitoring Setup
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database monitoring (pgAdmin)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```
