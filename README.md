<div align="center">

# webext-event-bus

Pub/sub event bus for Chrome extensions. Typed events, wildcard listeners, cross-context broadcasting, event history, and middleware for MV3.

[![npm version](https://img.shields.io/npm/v/webext-event-bus)](https://www.npmjs.com/package/webext-event-bus)
[![npm downloads](https://img.shields.io/npm/dm/webext-event-bus)](https://www.npmjs.com/package/webext-event-bus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/webext-event-bus)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Typed events** -- define event payloads as TypeScript types
- **Wildcard listeners** -- subscribe to event patterns with `*`
- **Cross-context** -- broadcast events between background, popup, and content scripts
- **Event history** -- replay past events for late subscribers
- **Middleware** -- intercept and transform events before delivery
- **Unsubscribe** -- clean up listeners to prevent memory leaks

## Installation

```bash
npm install webext-event-bus
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add webext-event-bus
# or
yarn add webext-event-bus
```

</details>

## Quick Start

```typescript
import { createEventBus } from "webext-event-bus";

type Events = {
  "user:login": { userId: string };
  "user:logout": void;
  "data:updated": { key: string; value: unknown };
};

const bus = createEventBus<Events>();

bus.on("user:login", ({ userId }) => console.log("Logged in:", userId));
bus.on("user:*", (data) => console.log("User event:", data));
bus.emit("user:login", { userId: "123" });
```

## API

| Method | Description |
|--------|-------------|
| `createEventBus<E>()` | Create a typed event bus |
| `on(event, handler)` | Subscribe to an event (supports wildcards) |
| `once(event, handler)` | Subscribe to a single occurrence |
| `off(event, handler)` | Unsubscribe a handler |
| `emit(event, data)` | Emit an event to all listeners |
| `history(event)` | Get past events for replay |
| `use(middleware)` | Add middleware to the event pipeline |



## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
