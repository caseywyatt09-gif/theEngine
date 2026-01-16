---
description: How to add new screens/features to The Engine
---

# Add New Feature to The Engine

## Current Architecture

The app uses a **standalone App.tsx** pattern (not expo-router) for web compatibility.

**File Structure:**
- `App.tsx` - Main app with all screens inline
- `components/` - Reusable UI components
- `data/` - Mock data files  
- `store/useAppStore.ts` - Zustand global state
- `constants/Colors.ts` - Theme colors

## Adding a New Tab Screen

1. **Add tab definition** in `App.tsx`:
```typescript
const TABS = [
    // ... existing tabs
    { name: 'newscreen', label: 'New', icon: 'add-circle' },
];
```

2. **Add render case** in `renderContent()`:
```typescript
case 'newscreen':
    return <NewScreenContent />;
```

3. **Create the content component** inline or in a separate file

## Adding a New Component

1. Create file in appropriate folder:
   - `components/social/` - Match/profile related
   - `components/events/` - Event cards, registration
   - `components/growth/` - Referrals, sharing
   - `components/ai/` - AI coach features

2. Export and import where needed

## Adding Mock Data

Add to `data/` folder:
- `mockAthletes.ts` - User profiles
- `mockEvents.ts` - HYROX events
- `mockHyrox.ts` - Race data

## State Management

Use Zustand store in `store/useAppStore.ts`:
```typescript
// Add new state
newFeature: false,
setNewFeature: (val) => set({ newFeature: val }),
```

## Testing Changes

The dev server hot-reloads automatically. Just save your file and check the browser.
