/**
 * Event Bus — Typed pub/sub with middleware and history
 */
export class EventBus {
    private listeners = new Map<string, Set<(data: unknown) => void>>();
    private middleware: Array<(event: string, data: unknown) => unknown> = [];
    private history: Array<{ event: string; data: unknown; timestamp: number }> = [];
    private maxHistory: number;

    constructor(maxHistory: number = 100) { this.maxHistory = maxHistory; }

    /** Subscribe to event */
    on(event: string, callback: (data: unknown) => void): () => void {
        const set = this.listeners.get(event) || new Set();
        set.add(callback);
        this.listeners.set(event, set);
        return () => set.delete(callback);
    }

    /** Subscribe once */
    once(event: string, callback: (data: unknown) => void): void {
        const unsub = this.on(event, (data) => { unsub(); callback(data); });
    }

    /** Emit event */
    emit(event: string, data?: unknown): void {
        let processed = data;
        for (const mw of this.middleware) processed = mw(event, processed);
        this.history.push({ event, data: processed, timestamp: Date.now() });
        if (this.history.length > this.maxHistory) this.history.shift();
        this.listeners.get(event)?.forEach((fn) => fn(processed));
        this.listeners.get('*')?.forEach((fn) => fn({ event, data: processed }));
    }

    /** Subscribe to all events (wildcard) */
    onAny(callback: (payload: { event: string; data: unknown }) => void): () => void {
        return this.on('*', callback as any);
    }

    /** Add middleware */
    use(fn: (event: string, data: unknown) => unknown): this {
        this.middleware.push(fn); return this;
    }

    /** Get event history */
    getHistory(event?: string): Array<{ event: string; data: unknown; timestamp: number }> {
        return event ? this.history.filter((h) => h.event === event) : [...this.history];
    }

    /** Clear all listeners */
    clear(): void { this.listeners.clear(); }

    /** Remove all listeners for event */
    off(event: string): void { this.listeners.delete(event); }

    /** Broadcast via chrome.runtime (cross-context) */
    broadcast(event: string, data?: unknown): void {
        chrome.runtime.sendMessage({ __eventBus: true, event, data }).catch(() => { });
        this.emit(event, data);
    }

    /** Listen for broadcasts from other contexts */
    listenBroadcasts(): void {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg?.__eventBus) this.emit(msg.event, msg.data);
        });
    }
}
