# Mirai Deployment Guide

## Overview

This guide explains how to deploy Mirai's frontend application to various hosting platforms, ensuring proper configuration for client-side routing.

## Prerequisites

- Node.js v18+ installed
- Git installed
- Access to the project repository
- Access to hosting platform accounts (Vercel, Netlify, etc.)

## Build Process

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

The build output will be in the `dist` directory.

## Vercel Deployment

### Automatic Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Environment Variables

Set the following environment variables in your Vercel project settings:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=https://your-backend-url.com
```

## Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Environment Variables

Set the same environment variables in your Netlify project settings.

## Troubleshooting

### 404 Errors on Routes

If you're experiencing 404 errors on client-side routes like `/admin`:

1. Ensure your `vercel.json` file is properly configured
2. Check that the `_redirects` file exists in the `public` directory
3. Verify that the Clerk authentication is working properly
4. Check the browser console for any errors related to routing or authentication

### Authentication Issues

If users cannot access protected routes like `/admin`:

1. Verify that Clerk is properly initialized with the correct publishable key
2. Check that the protected route wrapper is working correctly
3. Ensure that environment variables are properly set in your deployment

## Important Files

- `vercel.json`: Contains configuration for Vercel deployments
- `netlify.toml`: Contains configuration for Netlify deployments
- `static.json`: Contains configuration for Heroku deployments
- `public/_redirects`: Contains redirect rules for Netlify and other platforms
- `vite.config.js`: Contains build configuration for Vite

## Support

For deployment issues, contact the Mirai development team.