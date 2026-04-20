import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import useResizeObserver from '../src/use-resize-observer';

type ObserverCallback = (entries: ResizeObserverEntry[]) => void;

const observers: Array<{ observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; trigger: ObserverCallback }> = [];

class MockResizeObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    trigger: ObserverCallback;

    constructor(cb: ObserverCallback) {
        this.trigger = cb;
        observers.push(this);
    }
}

function mountHost(initialEl: HTMLElement | null = null) {
    let api!: ReturnType<typeof useResizeObserver>;
    const Host = defineComponent({
        setup() {
            api = useResizeObserver();
            api.refEl.value = initialEl;
            return () => h('div');
        }
    });
    const wrapper = mount(Host);
    return { wrapper, api: () => api };
}

describe('useResizeObserver', () => {
    beforeEach(() => {
        observers.length = 0;
        vi.stubGlobal('ResizeObserver', MockResizeObserver);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('does not init observer when refEl is empty', () => {
        mountHost(null);
        expect(observers).toHaveLength(0);
    });

    it('observes refEl when assigned', async () => {
        const el = document.createElement('div');
        const { api } = mountHost();
        api().refEl.value = el;
        await nextTick();

        expect(observers).toHaveLength(1);
        expect(observers[0].observe).toHaveBeenCalledWith(el);
    });

    it('updates height after debounce elapses', async () => {
        const el = document.createElement('div');
        Object.defineProperty(el, 'clientHeight', { value: 250, configurable: true });
        const { api } = mountHost();
        api().refEl.value = el;
        await nextTick();

        observers[0].trigger([]);
        expect(api().height.value).toBe(0);

        await vi.advanceTimersByTimeAsync(150);
        expect(api().height.value).toBe(250);
    });

    it('disconnects on unmount', async () => {
        const el = document.createElement('div');
        const { wrapper, api } = mountHost();
        api().refEl.value = el;
        await nextTick();

        const observer = observers[0];
        wrapper.unmount();

        expect(observer.disconnect).toHaveBeenCalled();
    });

    it('disconnects when refEl is cleared', async () => {
        const el = document.createElement('div');
        const { api } = mountHost();
        api().refEl.value = el;
        await nextTick();
        const observer = observers[0];

        api().refEl.value = null;
        await nextTick();
        expect(observer.disconnect).toHaveBeenCalled();
    });
});
