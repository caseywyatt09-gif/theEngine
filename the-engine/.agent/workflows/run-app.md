---
description: Start the development server for web or mobile
---

# Run The Engine App

## Web Development (default)
// turbo
1. Start the web dev server:
```bash
cd /Users/caseymiller/.gemini/antigravity/scratch/the-engine
npm run web
```

2. Open http://localhost:8081 in your browser

## iOS Simulator
// turbo
1. Start Expo and open iOS simulator:
```bash
cd /Users/caseymiller/.gemini/antigravity/scratch/the-engine
npx expo start --ios
```

## Android Emulator
// turbo
1. Start Expo and open Android:
```bash
cd /Users/caseymiller/.gemini/antigravity/scratch/the-engine
npx expo start --android
```

## Troubleshooting

If you see a blank screen on web:
1. Stop the server (Ctrl+C)
2. Clear cache and restart:
```bash
rm -rf node_modules/.cache .expo
npm run web
```

If module errors occur:
```bash
npm install
npm run web
```
