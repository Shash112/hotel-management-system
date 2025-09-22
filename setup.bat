@echo off
echo 🏨 Hotel Management System Setup
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo.
echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Setting up environment variables...
if not exist .env.local (
    copy env.example .env.local
    echo ✅ Created .env.local file
    echo ⚠️  Please update .env.local with your database credentials
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🗄️  Setting up database...
npx prisma generate
npx prisma db push

echo.
echo 🌱 Seeding database with sample data...
npx prisma db seed

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your database credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🔐 Default login credentials:
echo    Admin: admin@hotel.com / admin123
echo    Waiter: waiter@hotel.com / waiter123
echo    Cashier: cashier@hotel.com / cashier123
echo    Cook: cook@hotel.com / cook123
echo.
echo 🚀 Happy coding!
pause
