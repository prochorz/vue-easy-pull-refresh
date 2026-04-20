import { vi } from 'vitest';

class StubResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

if (typeof globalThis.ResizeObserver === 'undefined') {
    vi.stubGlobal('ResizeObserver', StubResizeObserver);
}

if (typeof Element.prototype.animate !== 'function') {
    Element.prototype.animate = function animateStub() {
        return {
            finished: Promise.resolve(undefined),
            cancel: () => undefined,
            finish: () => undefined,
            play: () => undefined,
            pause: () => undefined
        } as unknown as Animation;
    };
}
