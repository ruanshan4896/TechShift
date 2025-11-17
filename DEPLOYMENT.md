# Deployment Guide

## Vercel Deployment

### Prerequisites

Before deploying to Vercel, you need to set up environment variables for both applications.

### Environment Variables

#### Admin Application (apps/admin)

Required environment variables:

```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
CRON_SECRET="your-secret-key-for-cron-jobs"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_CRON_SECRET="your-secret-key-for-cron-jobs"
```

Optional (for API key rotation):
```bash
GEMINI_API_KEY_1="key-1"
GEMINI_API_KEY_2="key-2"
# ... up to GEMINI_API_KEY_19
```

#### Website Application (apps/website)

Required environment variables:

```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
```

### Setup Steps

1. **Create Vercel Projects**
   - Go to https://vercel.com/dashboard
   - Import your GitHub repository
   - Create TWO separate projects:
     - `techshift-website` (for apps/website)
     - `techshift-admin` (for apps/admin)

2. **Configure Root Directory**
   
   For **Website** project:
   - Settings → General → Root Directory: `apps/website`
   
   For **Admin** project:
   - Settings → General → Root Directory: `apps/admin`

3. **Add Environment Variables**
   
   For each project:
   - Go to Settings → Environment Variables
   - Add all required variables listed above
   - Select environments: Production, Preview, Development

4. **Deploy**
   - Push to main branch
   - Vercel will automatically deploy both projects

### Cron Jobs

Cron jobs are configured ONLY in the admin application:
- `/api/fetch-rss` - Runs every 30 minutes
- `/api/process-articles` - Runs every 10 minutes

The website application does NOT have cron jobs to avoid Vercel Hobby plan limits.

### Troubleshooting

**Build Error: "No database connection string"**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Redeploy after adding environment variables

**Cron Jobs Not Running**
- Verify `CRON_SECRET` matches in both environment variables and cron configuration
- Check Vercel logs for cron execution

**API Key Rotation Not Working**
- Ensure you have multiple `GEMINI_API_KEY_X` variables set
- Check logs to see which key is being used

### Monitoring

- **Website**: Check Vercel logs for page requests
- **Admin**: Check Vercel logs for cron job execution
- **Database**: Monitor Neon dashboard for connection usage

### Production Checklist

- [ ] Set strong `CRON_SECRET` (not the default)
- [ ] Set strong `NEXT_PUBLIC_ADMIN_PASSWORD`
- [ ] Add multiple Gemini API keys for rotation
- [ ] Verify database connection string
- [ ] Test cron jobs after deployment
- [ ] Monitor Vercel usage to stay within limits
