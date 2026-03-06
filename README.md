# Webext Event Bus

Event bus for Chrome extensions with typed pub/sub, middleware, event history, wildcard listeners, and cross-context broadcasting.

## Installation

```bash
npm i webext-event-bus
```

## Usage

```typescript
import { EventBus } from 'webext-event-bus';

const bus = new EventBus();

// Subscribe to events
bus.on('save', (data) => {
    console.log('Saved:', data);
});

// Emit events locally
bus.emit('save', { items: [1, 2, 3] });
```

## API Reference

### Constructor

```typescript
new EventBus(maxHistory?: number)
```

Creates an instance with optional history limit. Default maxHistory is 100.

### Subscribe

```typescript
bus.on(event: string, callback: (data: unknown) => void): () => void
```

Subscribe to an event. Returns an unsubscribe function.

```typescript
bus.once(event: string, callback: (data: unknown) => void): void
```

Subscribe to an event once.

### Emit

```typescript
bus.emit(event: string, data?: unknown): void
```

Emit an event to all local subscribers.

### Wildcard Listeners

```typescript
bus.onAny(callback: (payload: { event: string; data: unknown }) => void): () => void
```

Subscribe to all events. The payload contains the event name and data.

### Middleware

```typescript
bus.use(fn: (event: string, data: unknown) => unknown): this
```

Add middleware to process events before they reach subscribers. Middleware runs in order and can transform data.

```typescript
bus.use((event, data) => {
    console.log(`Event: ${event}`);
    return data;
});
```

### Event History

```typescript
bus.getHistory(event?: string): Array<{ event: string; data: unknown; timestamp: number }>
```

Get recorded history of emitted events. Filter by event name optionally.

### Remove Listeners

```typescript
bus.off(event: string): void
bus.clear(): void
```

Remove all listeners for a specific event or clear all listeners.

### Cross-Context Broadcasting

```typescript
bus.broadcast(event: string, data?: unknown): void
```

Broadcast an event across all extension contexts (popup, background, content scripts) using chrome.runtime.sendMessage.

```typescript
bus.listenBroadcasts(): void
```

Listen for broadcasts from other extension contexts. Call this in your background script or content script.

## Example

```typescript
// Background script
const bus = new EventBus();
bus.listenBroadcasts();

bus.on('settings-updated', (data) => {
    console.log('New settings:', data);
});

// Popup script
const bus = new EventBus();
bus.broadcast('settings-updated', { theme: 'dark' });
```

## Requirements

- TypeScript 5.0+
- Chrome Extensions with Manifest V3

## License

MIT License

## About

Maintained by theluckystrike. Built for Chrome extension developers who need a clean pub/sub implementation.

For issues and contributions, visit the GitHub repository.
