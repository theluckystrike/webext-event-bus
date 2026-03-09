[![CI](https://github.com/theluckystrike/webext-event-bus/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-event-bus/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-event-bus)](https://www.npmjs.com/package/@theluckystrike/webext-event-bus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/theluckystrike/webext-event-bus)](https://github.com/theluckystrike/webext-event-bus/commits)

# Webext Event Bus

A typed pub/sub event bus for Chrome extensions with cross-context broadcasting, middleware support, and event history. Built for Manifest V3.

## Overview

Webext Event Bus enables seamless communication across all Chrome extension contexts (popup, background script, content scripts, side panels, offscreen documents) using a clean pub/sub pattern. It supports typed events, wildcard listeners, middleware for data transformation, and event history tracking.

## Features

- **Typed Pub/Sub** — Subscribe to events with type-safe callbacks
- **Cross-Context Broadcasting** — Communicate between popup, background, and content scripts
- **Wildcard Listeners** — Listen to all events with `onAny()`
- **Middleware Support** — Transform data before it reaches subscribers
- **Event History** — Access past events with timestamp tracking
- **Manifest V3 Compatible** — Works with Chrome's message passing API

## Installation

```bash
npm install @theluckystrike/webext-event-bus
```

or

```bash
npm i @theluckystrike/webext-event-bus
```

## Usage

### Basic Pub/Sub

```typescript
import { EventBus } from '@theluckystrike/webext-event-bus';

const bus = new EventBus();

// Subscribe to events
const unsubscribe = bus.on('user-login', (data) => {
    console.log('User logged in:', data);
});

// Emit events locally
bus.emit('user-login', { userId: '123', timestamp: Date.now() });

// Unsubscribe when done
unsubscribe();
```

### One-Time Subscriptions

```typescript
// Subscribe that automatically unsubscribes after first event
bus.once('config-loaded', (data) => {
    console.log('Config:', data);
});
```

### Middleware

Transform data before it reaches subscribers:

```typescript
bus.use((event, data) => {
    console.log(`[${event}]`, data);
    return data; // Return transformed data
});

bus.use((event, data) => {
    // Add timestamp to all events
    return { ...data as object, processedAt: Date.now() };
});
```

### Event History

Access past events for debugging or state reconstruction:

```typescript
// Get all events
const history = bus.getHistory();

// Get specific event history
const loginHistory = bus.getHistory('user-login');
console.log(loginHistory);
// [{ event: 'user-login', data: {...}, timestamp: 1234567890 }]
```

### Cross-Context Broadcasting

Broadcast events across all extension contexts:

```typescript
// In your background script (or any context that listens)
const bus = new EventBus();
bus.listenBroadcasts();

bus.on('settings-changed', (data) => {
    console.log('New settings:', data);
});

// In popup, content script, or other context
const bus = new EventBus();
bus.broadcast('settings-changed', { theme: 'dark', language: 'en' });
```

#### Complete Cross-Context Example

**background.ts:**
```typescript
import { EventBus } from '@theluckystrike/webext-event-bus';

const bus = new EventBus();
bus.listenBroadcasts();

// Handle events from other contexts
bus.on('sync-data', async (data) => {
    // Process and store data
    await chrome.storage.local.set({ syncData: data });
    bus.emit('sync-complete', { success: true });
});

bus.on('fetch-user', async () => {
    const { user } = await chrome.storage.local.get('user');
    bus.emit('user-data', user);
});
```

**popup.ts:**
```typescript
import { EventBus } from '@theluckystrike/webext-event-bus';

const bus = new EventBus();

// Request data from background
bus.broadcast('fetch-user');

bus.on('user-data', (user) => {
    console.log('Received user:', user);
});
```

**content-script.ts:**
```typescript
import { EventBus } from '@theluckystrike/webext-event-bus';

const bus = new EventBus();
bus.listenBroadcasts();

// Notify background of page actions
bus.broadcast('page-action', { url: window.location.href });

bus.on('settings-changed', (settings) => {
    applyStyles(settings);
});
```

## API Reference

### Constructor

```typescript
new EventBus(maxHistory?: number): EventBus
```

Creates an event bus instance. The `maxHistory` parameter limits stored events (default: 100).

### Subscribing

```typescript
bus.on(event: string, callback: (data: unknown) => void): () => void
```

Subscribe to a specific event. Returns an unsubscribe function.

```typescript
bus.once(event: string, callback: (data: unknown) => void): void
```

Subscribe to an event exactly once.

```typescript
bus.onAny(callback: (payload: { event: string; data: unknown }) => void): () => void
```

Subscribe to all events. The payload contains both the event name and data.

### Emitting

```typescript
bus.emit(event: string, data?: unknown): void
```

Emit an event to all local subscribers.

```typescript
bus.broadcast(event: string, data?: unknown): void
```

Broadcast an event to all extension contexts using `chrome.runtime.sendMessage`.

### Listening for Broadcasts

```typescript
bus.listenBroadcasts(): void
```

Start listening for broadcasts from other extension contexts. Call this in contexts that need to receive cross-context events.

### Middleware

```typescript
bus.use(fn: (event: string, data: unknown) => unknown): this
```

Add middleware to process events. Middleware runs in order and can transform data. Returns `this` for chaining.

### History

```typescript
bus.getHistory(event?: string): Array<{ event: string; data: unknown; timestamp: number }>
```

Get recorded history of emitted events. Optionally filter by event name.

### Removing Listeners

```typescript
bus.off(event: string): void
bus.clear(): void
```

Remove all listeners for a specific event, or clear all listeners entirely.

## Project Structure

```
webext-event-bus/
├── src/
│   ├── bus.ts        # EventBus implementation
│   └── index.ts      # Public exports
├── tests/
│   └── bus.test.ts   # Unit tests
├── .github/
│   └── workflows/
│       └── ci.yml    # GitHub Actions CI
├── package.json
├── tsconfig.json
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md
```

## Requirements

- TypeScript 5.0+
- Chrome Extensions with Manifest V3

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
