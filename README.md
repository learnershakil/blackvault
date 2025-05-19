# SoundWave E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- 🛒 Full e-commerce functionality with cart, checkout, and payment
- 👤 User authentication and profile management
- 📱 Responsive design optimized for all devices
- 🎨 Modern UI with animations and effects
- 📊 Admin dashboard for product and order management
- 💳 Razorpay payment integration
- 🏷️ Coupon code system
- 📦 Order tracking

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Gateway**: Razorpay

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your environment variables (create a `.env.local` file based on `.env.example`)
4. Set up the database:

```bash
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Contributing

1. Create a branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
