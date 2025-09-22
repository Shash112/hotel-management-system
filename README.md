# Hotel Management System

An enterprise-grade Hotel Management Software with GST compliance, built with Next.js 14, TypeScript, and SQLite.

## Features

- **Role-based Access Control**: Admin, Waiter, Cashier, Cook roles
- **Order Management**: Create, update, and track orders
- **GST Compliance**: Indian tax calculations (CGST, SGST, IGST)
- **Real-time Updates**: Kitchen Display System (KDS)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login with NextAuth.js

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Testing**: Jest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hotel-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Default Login Credentials

- **Admin**: admin@hotel.com / admin123
- **Waiter**: waiter@hotel.com / waiter123
- **Cashier**: cashier@hotel.com / cashier123
- **Cook**: cook@hotel.com / cook123

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: A secure random string

## Testing

Run unit tests:
```bash
npm test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── waiter/            # Waiter interface
│   ├── cashier/           # Cashier interface
│   └── kitchen/           # Kitchen interface
├── components/            # React components
│   ├── ui/               # UI components
│   ├── auth/             # Auth components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and migrations
└── __tests__/            # Test files
```

## 📚 Documentation

For detailed information, please refer to our comprehensive documentation:

- **[Application Overview](docs/APPLICATION_OVERVIEW.md)** - Complete system architecture and features
- **[Setup & Deployment Guide](docs/SETUP_AND_DEPLOYMENT.md)** - Development setup and production deployment
- **[Branding & Theming Guide](docs/BRANDING_AND_THEMING.md)** - Customize appearance and branding

## License

MIT License