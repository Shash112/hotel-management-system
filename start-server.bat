@echo off
echo 🏨 Starting Hotel Management System...
echo =====================================

REM Set environment variables
set DATABASE_URL=file:./dev.db
set NEXTAUTH_URL=http://localhost:3000
set NEXTAUTH_SECRET=hotel-management-secret-key-2024
set JWT_SECRET=hotel-jwt-secret-key-2024
set NODE_ENV=development

echo ✅ Environment variables set
echo 🚀 Starting development server...
echo.
echo 🌐 Open http://localhost:3000 in your browser
echo.
echo 🔐 Default login credentials:
echo    Admin: admin@hotel.com / admin123
echo    Waiter: waiter@hotel.com / waiter123
echo    Cashier: cashier@hotel.com / cashier123
echo    Cook: cook@hotel.com / cook123
echo.

npm run dev
