import { registerRootComponent } from 'expo';
import React from 'react';

import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrap App with ErrorBoundary to catch runtime errors and show helpful error UI
const RootApp = () => (
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(RootApp);

