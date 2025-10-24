# Deployment Guide

## Vercel Deployment Instructions

### Option 1: Via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Set Environment Variables:**

You need to add these secrets to Vercel before deploying:

```bash
# Required variables
vercel env add MONGODB_URI production
# Enter your MongoDB Atlas connection string

vercel env add JWT_SECRET production
# Enter a random secure string

vercel env add NODE_ENV production
# Enter: production

vercel env add STRIPE_SECRET_KEY production
# Enter your Stripe secret key

# Optional (for email verification)
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add EMAIL_FROM production
vercel env add FRONTEND_URL production

# Optional (for SMS verification)
vercel env add TWILIO_ACCOUNT_SID production
vercel env add TWILIO_AUTH_TOKEN production
vercel env add TWILIO_PHONE_NUMBER production

# Optional (for Stripe webhooks)
vercel env add STRIPE_WEBHOOK_SECRET production
```

4. **Deploy:**
```bash
vercel --prod
```

### Option 2: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`

5. Add Environment Variables in the dashboard:
   - Go to Settings → Environment Variables
   - Add all the variables listed above

6. Click "Deploy"

### Option 3: Via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the configuration from `vercel.json`
4. Add environment variables in Vercel dashboard
5. Deploy automatically on every push to main branch

## MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (use 0.0.0.0/0 for all IPs or Vercel's IPs)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. For production, use live keys instead of test keys
4. Set up webhook endpoint at Dashboard → Developers → Webhooks
   - Endpoint URL: `https://your-domain.vercel.app/api/orders/webhook`
   - Select events: `payment_intent.succeeded`
   - Copy the webhook signing secret

## Post-Deployment Steps

1. **Seed the database:**
```bash
# SSH into your deployment or run locally
node seed.js
```

2. **Test the deployment:**
   - Visit your Vercel URL
   - Create a user account
   - Browse products
   - Test cart functionality
   - Try checkout (use Stripe test cards)

3. **Stripe Test Cards:**
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
   - Use any future expiry date and any CVC

## Troubleshooting

### Build Errors

If you get build errors:
```bash
# Clean install locally
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install && npm run build
```

### MongoDB Connection Issues

- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Check if database user has proper permissions

### Stripe Integration Issues

- Verify you're using the correct API keys (test/live)
- Check webhook secret matches
- Ensure webhook endpoint is publicly accessible

### Environment Variables Not Working

- Make sure all required variables are set in Vercel
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

## Production Checklist

Before going live:

- [ ] Use production MongoDB cluster (not free tier for high traffic)
- [ ] Use Stripe live keys instead of test keys
- [ ] Set up real SMTP server for emails
- [ ] Configure Twilio for SMS (if using)
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set up monitoring and logging
- [ ] Configure custom domain
- [ ] Test all functionality thoroughly
- [ ] Set up backup strategy for MongoDB
- [ ] Review security best practices

## Custom Domain

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Monitoring

Vercel provides:
- Real-time logs
- Analytics
- Performance metrics
- Error tracking

Access these from your project dashboard.

## Support

- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Stripe docs: [stripe.com/docs](https://stripe.com/docs)
