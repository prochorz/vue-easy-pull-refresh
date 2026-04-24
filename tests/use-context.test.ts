import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import type { IPullRefreshProps, TQueueCallback } from '../src/index.types';

import { ANIMATION_DURATION, useEasyPullRefresh, useProvide } from '../src/use-context';

function mountProvider(props: IPullRefreshProps = {}) {
    let api!: ReturnType<typeof useProvide>;
    const Comp = defineComponent({
        props: {
            isRefreshContent: Boolean,
            isAppearAnimation: Boolean,
            isFreezeContent: Boolean,
            isDisabled: Boolean,
            pullDownThreshold: { type: Number, default: 0 },
            directionLockAngle: Number,
            initialQueue: Function
        },
        setup(p) {
            api = useProvide(p as IPullRefreshProps);
            return () => h('div');
        }
    });
    const wrapper = mount(Comp, { props });
    return { wrapper, api: () => api };
}

function mountConsumer() {
    let api!: ReturnType<typeof useEasyPullRefresh>;
    const Child = defineComponent({
        setup() {
            api = useEasyPullRefresh();
            return () => h('div');
        }
    });
    const Parent = defineComponent({
        components: { Child },
        setup() {
            useProvide({});
            return () => h(Child);
        }
    });
    const wrapper = mount(Parent);
    return { wrapper, api: () => api };
}

describe('useProvide', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('exposes initial context shape', () => {
        const { api } = mountProvider();
        const ctx = api();

        expect(ctx.queue).toBeInstanceOf(Set);
        expect(ctx.topOffset.value).toBe(0);
        expect(ctx.isRefreshing.value).toBe(false);
    });

    it('tracks touch diff via touch handlers', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        ctx.touchStartHandler({ touches: [{ clientX: 0, clientY: 10 }] } as unknown as TouchEvent);
        ctx.touchMoveHandler({ touches: [{ clientX: 0, clientY: 60 }] } as unknown as TouchEvent);

        expect(ctx.topOffset.value).toBe(50);
    });

    it('ignores the pull when the gesture is mostly horizontal', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        // dy=20, dx=60 -> angle from vertical ~71° > 30°, treated as horizontal.
        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 60, clientY: 20 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(0);
    });

    it('stays locked horizontally even after subsequent vertical travel', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 60, clientY: 20 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 60, clientY: 200 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(0);
    });

    it('allows the pull when the angle from the vertical is within 30°', () => {
        const { api } = mountProvider({ pullDownThreshold: 200 });
        const ctx = api();

        // dy=100, dx=40 -> |dx|/|dy| = 0.4 < tan(30°) ≈ 0.577.
        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 40, clientY: 100 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(100);
    });

    it('does not lock the direction before the movement threshold is crossed', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        // Tiny drift below the 5px threshold must not decide the direction.
        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 3, clientY: 2 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 80 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(80);
    });

    it('widens the direction lock when directionLockAngle is increased', () => {
        // dx=60, dy=40 -> ~56° from vertical: locked at default 30°, allowed at 60°.
        const strict = mountProvider({ pullDownThreshold: 100 });
        strict.api().touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        strict.api().touchMoveHandler({ clientX: 60, clientY: 40 } as MouseEvent);
        expect(strict.api().topOffset.value).toBe(0);

        const relaxed = mountProvider({ pullDownThreshold: 100, directionLockAngle: 60 });
        relaxed.api().touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        relaxed.api().touchMoveHandler({ clientX: 60, clientY: 40 } as MouseEvent);
        expect(relaxed.api().topOffset.value).toBe(40);
    });

    it('effectively disables the direction lock when directionLockAngle is 90', () => {
        const { api } = mountProvider({ pullDownThreshold: 100, directionLockAngle: 90 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 200, clientY: 30 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(30);
    });

    it('resets the direction lock between gestures', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 60, clientY: 20 } as MouseEvent);
        ctx.touchEndHandler();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(50);
    });

    it('clamps topOffset to pullDownThreshold', () => {
        const { api } = mountProvider({ pullDownThreshold: 40 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 500 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(40);
    });

    it('clamps topOffset to 0 for negative pull', () => {
        const { api } = mountProvider({ pullDownThreshold: 40 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 100 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(0);
    });

    it('ignores handlers when isDisabled', () => {
        const { api } = mountProvider({ pullDownThreshold: 100, isDisabled: true });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 80 } as MouseEvent);

        expect(ctx.topOffset.value).toBe(0);
    });

    it('resets topOffset on touchEnd below threshold', () => {
        const { api } = mountProvider({ pullDownThreshold: 100 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();

        expect(ctx.topOffset.value).toBe(0);
        expect(ctx.isRefreshing.value).toBe(false);
    });

    it('starts refresh flow when threshold reached', async () => {
        const { api } = mountProvider({ pullDownThreshold: 50 });
        const ctx = api();
        const queueCb = vi.fn().mockResolvedValue(undefined);
        ctx.queue.add(queueCb);

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 100 } as MouseEvent);
        ctx.touchEndHandler();

        await nextTick();
        expect(ctx.isRefreshing.value).toBe(true);
        expect(queueCb).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);

        expect(ctx.isRefreshing.value).toBe(false);
        expect(ctx.topOffset.value).toBe(0);
    });

    it('waitForRefresh resolves after active refresh finishes', async () => {
        const { api } = mountProvider({ pullDownThreshold: 10 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();

        const waitPromise = ctx.waitForRefresh();
        let resolved = false;
        waitPromise.then(() => { resolved = true; });

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION - 1);
        expect(resolved).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        await waitPromise;
        expect(resolved).toBe(true);
    });

    it('waitForRefresh resolves immediately when idle', async () => {
        const { api } = mountProvider();
        const ctx = api();
        await expect(ctx.waitForRefresh()).resolves.toBeUndefined();
    });

    it('ignores further handlers while refreshing', async () => {
        const { api } = mountProvider({ pullDownThreshold: 10 });
        const ctx = api();

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 20 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();
        expect(ctx.isRefreshing.value).toBe(true);

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 100 } as MouseEvent);
        ctx.touchEndHandler();

        expect(ctx.topOffset.value).toBe(10);

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
    });

    it('adds initialQueue callback and swaps it on prop change', async () => {
        const first: TQueueCallback = vi.fn().mockResolvedValue(undefined);
        const second: TQueueCallback = vi.fn().mockResolvedValue(undefined);

        const { wrapper, api } = mountProvider({ pullDownThreshold: 10, initialQueue: first });
        const ctx = api();
        expect(ctx.queue.has(first)).toBe(true);

        await wrapper.setProps({ initialQueue: second });
        expect(ctx.queue.has(first)).toBe(false);
        expect(ctx.queue.has(second)).toBe(true);
    });

    it('resets refreshing state when a queue callback rejects', async () => {
        const { api } = mountProvider({ pullDownThreshold: 10 });
        const ctx = api();
        const failingCb: TQueueCallback = vi.fn().mockRejectedValue(new Error('boom'));
        ctx.queue.add(failingCb);

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();
        expect(ctx.isRefreshing.value).toBe(true);

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
        await nextTick();

        expect(ctx.isRefreshing.value).toBe(false);
        expect(ctx.topOffset.value).toBe(0);
    });

    it('allows a new pull after a failed refresh', async () => {
        const { api } = mountProvider({ pullDownThreshold: 10 });
        const ctx = api();
        const failingCb: TQueueCallback = vi.fn().mockRejectedValue(new Error('boom'));
        ctx.queue.add(failingCb);

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();
        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
        await nextTick();

        ctx.queue.delete(failingCb);
        const succeedingCb: TQueueCallback = vi.fn().mockResolvedValue(undefined);
        ctx.queue.add(succeedingCb);

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();

        expect(succeedingCb).toHaveBeenCalledTimes(1);
    });

    it('waitForRefresh returns to idle after a rejected refresh', async () => {
        const { api } = mountProvider({ pullDownThreshold: 10 });
        const ctx = api();
        ctx.queue.add(vi.fn().mockRejectedValue(new Error('boom')));

        ctx.touchStartHandler({ clientX: 0, clientY: 0 } as MouseEvent);
        ctx.touchMoveHandler({ clientX: 0, clientY: 50 } as MouseEvent);
        ctx.touchEndHandler();
        await nextTick();
        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
        await nextTick();

        await expect(ctx.waitForRefresh()).resolves.toBeUndefined();
    });

    it('clears queue on unmount', async () => {
        const cb: TQueueCallback = vi.fn().mockResolvedValue(undefined);
        const { wrapper, api } = mountProvider();
        const ctx = api();
        ctx.queue.add(cb);

        wrapper.unmount();

        expect(ctx.queue.size).toBe(0);
    });
});

describe('useEasyPullRefresh', () => {
    it('adds callbacks to the provided queue', () => {
        const Child = defineComponent({
            setup() {
                const { pullDownQueueAdd } = useEasyPullRefresh();
                pullDownQueueAdd(async () => undefined);
                return () => h('div');
            }
        });
        let providerCtx!: ReturnType<typeof useProvide>;
        const Parent = defineComponent({
            components: { Child },
            setup() {
                providerCtx = useProvide({});
                return () => h(Child);
            }
        });

        mount(Parent);
        expect(providerCtx.queue.size).toBe(1);
    });

    it('removes callback when consumer unmounts', async () => {
        const cb: TQueueCallback = vi.fn().mockResolvedValue(undefined);
        const Child = defineComponent({
            setup() {
                const { pullDownQueueAdd } = useEasyPullRefresh();
                pullDownQueueAdd(cb);
                return () => h('div');
            }
        });
        let providerCtx!: ReturnType<typeof useProvide>;
        const visible = { value: true };
        const Parent = defineComponent({
            components: { Child },
            setup() {
                providerCtx = useProvide({});
                return () => (visible.value ? h(Child) : null);
            }
        });

        const wrapper = mount(Parent);
        expect(providerCtx.queue.size).toBe(1);

        visible.value = false;
        wrapper.vm.$forceUpdate();
        await nextTick();

        expect(providerCtx.queue.size).toBe(0);
    });

    it('returns a refRefresh template ref', () => {
        const { api } = mountConsumer();
        expect(api().refRefresh.value).toBe(null);
    });
});
