# NextAuth.js Setup Guide

## 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Portfolio Admin
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

## 2. Configure Environment Variables

Update your `.env.local` file:

```env
# NextAuth Configuration
AUTH_SECRET=your-super-secret-key-change-this-in-production
AUTH_GITHUB_ID=your-github-client-id-from-step-1
AUTH_GITHUB_SECRET=your-github-client-secret-from-step-1

# Allowed GitHub Users (comma separated emails)
ALLOWED_GITHUB_USERS=your-github-email@example.com
```

### Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online: https://generate-secret.vercel.app/32

## 3. Update Allowed Users

In `.env.local`, set `ALLOWED_GITHUB_USERS` to your GitHub email:

```env
ALLOWED_GITHUB_USERS=your-email@example.com
```

You can add multiple emails separated by commas:

```env
ALLOWED_GITHUB_USERS=email1@example.com,email2@example.com
```

## 4. Production Setup (Vercel)

### Update GitHub OAuth App

1. Go back to your GitHub OAuth App settings
2. Update the URLs:
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

### Add Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these variables:
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
   - `ALLOWED_GITHUB_USERS`

## 5. Usage

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Click "Sign in with GitHub"
4. Authorize the app
5. You'll be redirected to the admin panel

## Security Features

✅ **OAuth Authentication** - No passwords to manage
✅ **Email Whitelist** - Only specific GitHub accounts can access
✅ **Session-based** - Secure session management
✅ **Middleware Protection** - All admin routes are protected
✅ **HTTPS Required** - In production, OAuth requires HTTPS

## Troubleshooting

### "Access Denied" Error

- Make sure your GitHub email is in `ALLOWED_GITHUB_USERS`
- Check that the email matches exactly (case-sensitive)

### "Configuration Error"

- Verify all environment variables are set correctly
- Make sure `AUTH_SECRET` is generated and not empty
- Check GitHub OAuth App credentials

### Redirect Issues

- Ensure callback URL matches exactly in GitHub OAuth App settings
- For production, use your actual domain (not localhost)

## Content Management

The admin panel supports:

- **Projects** - Portfolio projects with GitHub stars
- **Experience** - Work experience entries
- **Education** - Educational background
- **Skills** - Technical skills and proficiencies
- **Achievements** - Awards and accomplishments

All data is stored in JSON files in the `data/` directory.
