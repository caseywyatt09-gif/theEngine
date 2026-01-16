# The Engine 🔥

A fitness social app for connecting athletes - HYROX training partners, running buddies, and fitness enthusiasts.

## Quick Start

```bash
npm install
npm run web
```

Open http://localhost:8081

## Setting as Active Workspace

In Antigravity/your IDE:
1. Open Settings/Preferences
2. Find "Workspace" or "Project Root" setting
3. Set to: `/Users/caseymiller/.gemini/antigravity/scratch/the-engine`

## Available Workflows

Use these slash commands:
- `/run-app` - Start development server
- `/add-feature` - How to add new screens
- `/deploy` - Deploy to production

## Deployment

The app is deployed on Vercel:
[https://the-engine-five.vercel.app](https://the-engine-five.vercel.app)

## Project Structure

```
the-engine/
├── App.tsx              # Main app (standalone for web compat)
├── components/          # Reusable UI
│   ├── social/          # Match cards, profiles
│   ├── events/          # Event cards
│   └── growth/          # Referrals
├── data/                # Mock data
├── store/               # Zustand state
└── constants/           # Theme colors
```

## Features

- 🔥 Onboarding with Race/Fun mode selection
- 👤 Swipeable athlete match cards
- 🏋️ Training dashboard (War Room)
- 📅 HYROX event listings
- 🛒 Marketplace (coming soon)

## Tech Stack

- Expo SDK 54
- React Native + React Native Web
- TypeScript
- Zustand (state management)
- expo-linear-gradient
