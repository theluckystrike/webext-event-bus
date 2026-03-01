# webext-event-bus — Event Bus for Chrome Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i webext-event-bus`

Typed pub/sub with middleware, event history, wildcard listeners, and cross-context broadcasting.

```typescript
import { EventBus } from 'webext-event-bus';
const bus = new EventBus();
bus.on('save', (data) => persist(data));
bus.broadcast('save', { items: [1, 2, 3] });
```
MIT License
