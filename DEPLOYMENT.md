# Deploying Tweeti Backend to Vercel

## Prerequisites
- Vercel account (free at vercel.com)
- Vercel CLI installed: `npm i -g vercel`

## Step 1: Build the Project
```bash
npm run build
```

## Step 2: Deploy to Vercel
```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Set Environment Variables
In your Vercel dashboard, go to your project settings and add these environment variables:

- `DATABASE_URL` - Your Neon database connection string
- `NODE_ENV` - Set to "production"

## Step 4: Update Frontend URLs
After deployment, update your frontend to use the new Vercel URL:

```typescript
// In your frontend code, replace:
// https://tweeti-backend.onrender.com
// with your new Vercel URL like:
// https://your-project.vercel.app
```

## API Endpoints
Your backend will be available at:
- `https://your-project.vercel.app/api/auth/*` - Authentication routes
- `https://your-project.vercel.app/api/save-x-credentials` - Save X credentials
- `https://your-project.vercel.app/health` - Health check

## Troubleshooting
- Make sure all environment variables are set in Vercel
- Check Vercel function logs for any errors
- Ensure your database is accessible from Vercel's servers 