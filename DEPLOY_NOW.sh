#!/bin/bash

# E-Commerce Platform - Quick Deploy Script
# This script helps you deploy your e-commerce platform to Vercel

echo "================================================"
echo "E-Commerce Platform - Vercel Deployment"
echo "================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "Before deploying, make sure you have:"
echo "  1. ✅ MongoDB Atlas cluster created"
echo "  2. ✅ MongoDB connection string ready"
echo "  3. ✅ Stripe account and API keys"
echo "  4. ✅ (Optional) SMTP credentials for emails"
echo "  5. ✅ (Optional) Twilio credentials for SMS"
echo ""

read -p "Do you have all the required credentials? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please set up the required services first:"
    echo "  • MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    echo "  • Stripe: https://stripe.com"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "================================================"
echo "Step 1: Building the application"
echo "================================================"

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Please fix the errors and try again."
    exit 1
fi

cd ..
echo "✅ Frontend build successful"

echo ""
echo "================================================"
echo "Step 2: Deploying to Vercel"
echo "================================================"

# Check if already logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "Deploying to production..."
echo ""

# Deploy to Vercel
vercel --prod --name agentic-b510565c

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ Deployment Successful!"
    echo "================================================"
    echo ""
    echo "⚠️  IMPORTANT: Don't forget to:"
    echo "  1. Set environment variables in Vercel dashboard"
    echo "  2. Run 'node seed.js' to populate sample data"
    echo "  3. Test all functionality"
    echo ""
    echo "Environment variables needed:"
    echo "  • MONGODB_URI"
    echo "  • JWT_SECRET"
    echo "  • STRIPE_SECRET_KEY"
    echo "  • NODE_ENV (set to 'production')"
    echo ""
    echo "See DEPLOYMENT.md for detailed instructions."
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Please check the errors above."
    echo ""
    echo "Common issues:"
    echo "  • Not logged in to Vercel (run 'vercel login')"
    echo "  • Build errors (check frontend build)"
    echo "  • Missing dependencies (run 'npm install')"
    echo ""
fi
