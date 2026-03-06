import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus } from '../src/index';

describe('EventBus', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = new EventBus();
    });

    it('should subscribe and emit events', () => {
        const received: unknown[] = [];
        bus.on('test', (data) => received.push(data));
        bus.emit('test', { message: 'hello' });
        expect(received).toHaveLength(1);
        expect(received[0]).toEqual({ message: 'hello' });
    });

    it('should return unsubscribe function', () => {
        const received: unknown[] = [];
        const unsubscribe = bus.on('test', (data) => received.push(data));
        bus.emit('test', 1);
        unsubscribe();
        bus.emit('test', 2);
        expect(received).toHaveLength(1);
    });

    it('should handle once listeners', () => {
        const received: unknown[] = [];
        bus.once('test', (data) => received.push(data));
        bus.emit('test', 1);
        bus.emit('test', 2);
        expect(received).toHaveLength(1);
    });

    it('should handle wildcard listeners', () => {
        const received: { event: string; data: unknown }[] = [];
        bus.onAny((payload) => received.push(payload));
        bus.emit('foo', 'bar');
        bus.emit('baz', 'qux');
        expect(received).toHaveLength(2);
        expect(received[0].event).toBe('foo');
    });

    it('should run middleware', () => {
        bus.use((event, data) => {
            return { ...(data as object), processed: true };
        });
        const received: unknown[] = [];
        bus.on('test', (data) => received.push(data));
        bus.emit('test', { original: true });
        expect(received[0]).toEqual({ original: true, processed: true });
    });

    it('should track event history', () => {
        bus.emit('event1', 'data1');
        bus.emit('event2', 'data2');
        const history = bus.getHistory();
        expect(history).toHaveLength(2);
        
        const filtered = bus.getHistory('event1');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].event).toBe('event1');
    });

    it('should clear all listeners', () => {
        bus.on('test', () => {});
        bus.on('other', () => {});
        bus.clear();
        const history = bus.getHistory();
        bus.emit('test', null);
        expect(history).toHaveLength(0);
    });

    it('should remove listeners for specific event', () => {
        bus.on('test', () => {});
        bus.off('test');
        const history = bus.getHistory();
        bus.emit('test', null);
        expect(history).toHaveLength(0);
    });
});
