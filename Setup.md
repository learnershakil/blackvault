# E-commerce Platform Setup Guide

This document provides comprehensive instructions for setting up and deploying the BlackVault E-commerce platform, from local development to production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Authentication Configuration](#authentication-configuration)
6. [Payment Integration](#payment-integration)
7. [Running the Application](#running-the-application)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn** package manager
- **Git**
- **PostgreSQL** (v14 or later)
- **Docker** (optional, for containerization)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/learnershakil/blackvault.git
cd blackvault
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root by copying the template:

```bash
cp .env.sample .env
```

Fill in the necessary environment variables (see [Environment Configuration](#environment-configuration) section below).

## Environment Configuration

The application requires several environment variables for proper functionality. Here's a detailed breakdown:

### Database Configuration

```
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"
```

Replace `username`, `password`, and potentially the database name based on your PostgreSQL setup.

### NextAuth Configuration

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="generate-a-strong-random-secret"
```

- `NEXTAUTH_URL`: In development, this is your local server URL
- `NEXTAUTH_SECRET`: A secure random string used to hash tokens. Generate one using a tool like `openssl rand -hex 32`

### OAuth Providers

For social login functionality:

```
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

To obtain these credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Credentials
4. Create an OAuth client ID for a Web application
5. Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google` for development)

### Email Provider

For password reset and verification emails:

```
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"
```

You can use services like SendGrid, Amazon SES, or even Gmail for development purposes.

### Razorpay Payment Provider

For payment processing:

```
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

To obtain these credentials:

1. Create an account at [Razorpay](https://razorpay.com/)
2. Navigate to Dashboard > Settings > API Keys
3. Generate a new API key pair

## Database Setup

### 1. Create PostgreSQL Database

Create a new PostgreSQL database for the application:

```bash
psql -U postgres
```

```sql
CREATE DATABASE ecommerce;
```

### 2. Run Database Migrations

Initialize your database with the Prisma schema:

```bash
npx prisma migrate dev
```

This command will:

- Create all required tables based on the schema
- Apply all migrations in the `prisma/migrations` directory
- Generate the Prisma client

### 3. Seed Sample Data (Optional)

To populate your database with sample data:

```bash
npx prisma db seed
```

The seed script located in `prisma/seed.ts` will add:

- Admin user
- Product categories
- Sample products
- Other essential data

## Authentication Configuration

The application uses NextAuth.js for authentication. Key configuration files:

- `auth.config.ts`: Configuration for authentication providers
- `auth.ts`: Main NextAuth setup
- `auth.client.ts`: Client-side authentication utilities
- `lib/server-auth.ts`: Server-side authentication utilities

## Payment Integration

### Razorpay Setup

1. Make sure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are configured in your `.env` file
2. The integration is implemented in:
   - `/app/api/payment/create/route.ts`: Creates a new payment order
   - `/app/api/payment/verify/route.ts`: Verifies payment authenticity
   - `/components/checkout/payment-methods.tsx`: Displays payment options

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the application in development mode at [http://localhost:3000](http://localhost:3000).

### Production Build (Local Testing)

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Production Deployment

### Option 1: Vercel (Recommended)

The easiest way to deploy this application is using [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

### Option 2: Docker Deployment

#### 1. Build Docker Image

```bash
docker build -t ecommerce-app .
```

#### 2. Run Docker Container

```bash
docker run -p 3000:3000 --env-file .env.production ecommerce-app
```

### Option 3: Traditional VPS/Server Deployment

#### 1. SSH into your server

```bash
ssh user@your-server-ip
```

#### 2. Clone the repository

```bash
git clone https://github.com/your-username/e-commerce.git
```

#### 3. Install dependencies and build

```bash
cd e-commerce
npm install
npm run build
```

#### 4. Set up a process manager (PM2)

```bash
npm install -g pm2
pm2 start npm --name "ecommerce" -- start
```

#### 5. Configure Nginx (Example Configuration)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your PostgreSQL server is running
2. Check that your `DATABASE_URL` is correctly formatted
3. Ensure your PostgreSQL user has proper permissions
4. For Windows users, try using `localhost` instead of `127.0.0.1`

### Authentication Issues

If authentication isn't working properly:

1. Ensure `NEXTAUTH_URL` is correctly set
2. Verify OAuth provider credentials
3. Check that callback URLs are correctly configured in the provider dashboards

### Payment Issues

If Razorpay payments aren't working:

1. Verify API keys are correct
2. Ensure you're using test keys for development environment
3. Check server logs for any API response errors
4. Test with the Razorpay test payment flow using test card numbers

### Deployment Issues

If you encounter deployment problems:

1. Check environment variables are properly set in your deployment environment
2. Ensure the build process completes successfully
3. Verify database connection from your deployment environment
4. Check server logs for any runtime errors

For any additional issues or questions, please refer to the project documentation or reach out to the development team.
