---
description: Deploy The Engine to Vercel or build for production
---

# Deploy The Engine

## Vercel Deployment (Web)

### First-time Setup
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

### Deploy
// turbo
1. Build and deploy:
```bash
cd /Users/caseymiller/.gemini/antigravity/scratch/the-engine
npx expo export --platform web
vercel --prod
```

The `vercel.json` is already configured for SPA routing.

## Production Build (Local)

// turbo
1. Create production web bundle:
```bash
cd /Users/caseymiller/.gemini/antigravity/scratch/the-engine
npx expo export --platform web
```

Output will be in `dist/` folder.

## Mobile App Builds

### iOS (requires Mac + Xcode)
```bash
npx expo run:ios --configuration Release
```

### Android
```bash
npx expo run:android --variant release
```

## EAS Build (Cloud Builds)

For production mobile apps, use Expo Application Services:
```bash
npm install -g eas-cli
eas login
eas build --platform all
```

## Environment Variables

For production, set these in Vercel dashboard:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
