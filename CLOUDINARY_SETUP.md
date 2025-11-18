# Cloudinary Setup Guide

## Why Cloudinary?

Cloudinary provides:
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **Global CDN**: Fast image delivery worldwide
- **On-the-fly transformations**: Resize, crop, optimize via URL
- **Automatic format selection**: WebP for modern browsers
- **No Vercel costs**: Offload image optimization completely

## Setup Steps

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. After login, go to Dashboard
4. Copy these values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 2. Add Environment Variables

Add to **Vercel Admin Project** (Settings → Environment Variables):

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Also add to local `.env.local` files:

**apps/admin/.env.local:**
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**apps/website/.env.local:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### 3. Install Cloudinary SDK

Already done! The code will use Cloudinary's upload API.

### 4. How It Works

**Admin Editor:**
- Upload image file (not URL)
- Image sent to Cloudinary API
- Cloudinary returns optimized URL
- URL saved to database

**Website:**
- Display images using Cloudinary URLs
- Next.js Image component handles lazy loading
- Cloudinary CDN delivers optimized images

### 5. Benefits

✅ **No Vercel Image Optimization costs**
✅ **Faster loading with global CDN**
✅ **Automatic WebP conversion**
✅ **On-the-fly transformations** (e.g., `w_800,h_600,c_fill`)
✅ **Better performance at scale**

### 6. URL Transformation Examples

Cloudinary URLs support transformations:

```
Original:
https://res.cloudinary.com/demo/image/upload/sample.jpg

Resize to 800px width:
https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg

Crop and optimize:
https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_auto,f_auto/sample.jpg
```

Parameters:
- `w_800` - width 800px
- `h_600` - height 600px
- `c_fill` - crop to fill
- `q_auto` - auto quality
- `f_auto` - auto format (WebP for modern browsers)

## Next Steps

After adding environment variables:
1. Redeploy admin app on Vercel
2. Test image upload in editor
3. Verify images display correctly on website
