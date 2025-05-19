# BlackVault E-commerce Platform

<p align="center">
  <img src="public/images/logo.png" alt="BlackVault Logo" width="200" />
</p>

<p align="center">
  <a href="https://github.com/learnershakil/blackvault/stargazers"><img src="https://img.shields.io/github/stars/learnershakil/blackvault" alt="Stars"></a>
  <a href="https://github.com/learnershakil/blackvault/network/members"><img src="https://img.shields.io/github/forks/learnershakil/blackvault" alt="Forks"></a>
  <a href="https://github.com/learnershakil/blackvault/issues"><img src="https://img.shields.io/github/issues/learnershakil/blackvault" alt="Issues"></a>
  <a href="https://github.com/learnershakil/blackvault/blob/main/LICENSE"><img src="https://img.shields.io/github/license/learnershakil/blackvault" alt="License"></a>
</p>

A modern, full-stack e-commerce platform built with Next.js 15+, TypeScript, Tailwind CSS, and PostgreSQL. This project showcases a complete solution for online stores with a sleek user interface, robust backend, and comprehensive admin capabilities.

> This project was created as a passion project to explore modern web technologies and e-commerce patterns. Feel free to use it for learning, experimentation, or as a foundation for your own e-commerce ventures.

## 🚀 Live Demo

Visit the live demo at [blackvault-demo.vercel.app](https://blackvault-demo.vercel.app)

## ✨ Features

### Customer Features

- **User Authentication** - Secure account creation and login
- **Product Browsing** - Browse products with filtering and search capabilities
- **Shopping Cart** - Add, remove, and update items in cart with persistent storage
- **Wishlist** - Save products for future reference
- **Checkout Process** - Streamlined multi-step checkout
- **Payment Processing** - Integrated with Razorpay payment gateway
- **Order Management** - Track order status and history
- **User Profiles** - Manage personal information and preferences
- **Address Management** - Save and edit multiple shipping addresses

### Admin Features

- **Dashboard Overview** - Key metrics and insights at a glance
- **Product Management** - Create, edit, and delete products
- **Order Processing** - Process and fulfill customer orders
- **User Management** - Manage customer accounts and permissions
- **Analytics** - Sales, product, and customer analytics
- **Content Management** - Manage banners, promotions, and featured collections
- **Inventory Control** - Track stock levels and get low stock alerts

### Technical Features

- **Responsive Design** - Optimized for all devices
- **Dark/Light Mode** - Theme toggle for user preference
- **SEO Optimized** - Meta tags and structured data for better search visibility
- **Accessibility Compliant** - Following WCAG guidelines
- **Performance Optimized** - Fast page loads and optimized assets
- **API-First Architecture** - Well-structured API endpoints
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary (optional configuration)
- **Email**: SendGrid (optional configuration)

### Payment Processing

- **Gateway**: Razorpay

## 📦 Installation & Setup

### Prerequisites

- Node.js 18.0.0 or newer
- PostgreSQL database
- Git

### Clone the repository

```bash
git clone https://github.com/learnershakil/blackvault.git
cd blackvault
```

### Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables (adjust as needed):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blackvault"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Email (optional)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=no-reply@example.com

# Razorpay (for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Cloudinary (optional for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Setup

1. Make sure your PostgreSQL server is running
2. Run database migrations:

```bash
# Set up the database schema
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

3. Seed the database with initial data:

```bash
npm run db:seed
```

### Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Admin Access

After seeding the database, you can access the admin panel with:

- **Email**: admin@BlackVault.com
- **Password**: Admin123!

## 📁 Project Structure

```
/app                  # Next.js app directory (pages, api, auth, etc.)
  /api                 # API routes
  /auth                # Authentication routes
  /dashboard            # Admin dashboard
  /products            # Product-related pages
  /checkout            # Checkout process pages
  /profile            # User profile and account management
/components           # Reusable components (buttons, inputs, cards, etc.)
  /ui                  # UI components (e.g., buttons, modals)
  /layout               # Layout components (e.g., header, footer)
  /dashboard            # Admin-specific components
/lib                  # Utility functions and shared logic
  /auth                # Authentication utilities
  /db                  # Database utilities
  /email               # Email sending utilities
  /razorpay            # Razorpay integration utilities
/prisma               # Database schema and migrations
/public               # Static assets (images, fonts, etc.)
/styles               # Global styles and theme configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test your changes
5. Submit a pull request

Please ensure your code follows the project's coding standards and passes all tests.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by [learnershakil](https://github.com/learnershakil)
