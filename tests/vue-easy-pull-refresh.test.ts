import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import VueEasyPullRefresh from '../src/vue-easy-pull-refresh.vue';
import { ANIMATION_DURATION } from '../src/use-context';

type MountOpts = Parameters<typeof mount<typeof VueEasyPullRefresh>>[1];

function mountRefresh(props: Record<string, unknown> = {}, opts: MountOpts = {}) {
    return mount(VueEasyPullRefresh, {
        props,
        slots: { default: '<p class="content">content</p>' },
        ...opts
    });
}

describe('VueEasyPullRefresh', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders slot content', () => {
        const wrapper = mountRefresh();
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('does not render loader when idle', () => {
        const wrapper = mountRefresh({ pullDownThreshold: 50 });
        expect(wrapper.find('[class*="loaderWrapper"]').exists()).toBe(false);
    });

    it('shows loader once user starts pulling', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 80 });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 30 });

        expect(wrapper.find('[class*="loaderWrapper"]').exists()).toBe(true);
    });

    it('emits "reached" when threshold is crossed', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 60 });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 200 });
        await nextTick();

        expect(wrapper.emitted('reached')).toHaveLength(1);
    });

    it('emits "reached" only once per pull', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 40 });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 100 });
        await root.trigger('mousemove', { clientY: 150 });
        await nextTick();

        expect(wrapper.emitted('reached')).toHaveLength(1);
    });

    it('starts refresh when pull is released past the threshold', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 40 });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 100 });
        await root.trigger('mouseup');
        await nextTick();

        expect(wrapper.find('[class*="loaderWrapper"]').exists()).toBe(true);

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
        await nextTick();
    });

    it('cancels pull when released below the threshold', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 80 });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 30 });
        await root.trigger('mouseup');
        await nextTick();

        expect(wrapper.emitted('reached')).toBeUndefined();
    });

    it('ignores gestures when isDisabled is true', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 40, isDisabled: true });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 200 });
        await nextTick();

        expect(wrapper.emitted('reached')).toBeUndefined();
        expect(wrapper.find('[class*="loaderWrapper"]').exists()).toBe(false);
    });

    it('supports touch events', async () => {
        const wrapper = mountRefresh({ pullDownThreshold: 40 });
        const root = wrapper.find('div');

        await root.trigger('touchstart', { touches: [{ clientY: 0 }] });
        await root.trigger('touchmove', { touches: [{ clientY: 100 }] });
        await nextTick();

        expect(wrapper.emitted('reached')).toHaveLength(1);
    });

    it('runs initialQueue callback when refreshing', async () => {
        const cb = vi.fn().mockResolvedValue(undefined);
        const wrapper = mountRefresh({ pullDownThreshold: 30, initialQueue: cb });
        const root = wrapper.find('div');

        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 60 });
        await root.trigger('mouseup');
        await nextTick();

        expect(cb).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(ANIMATION_DURATION);
    });

    it('exposes queue through template ref', () => {
        const wrapper = mountRefresh();
        const exposed = wrapper.vm as unknown as { queue: Set<unknown> };
        expect(exposed.queue).toBeInstanceOf(Set);
    });

    it('renders custom loader slot', async () => {
        const wrapper = mount(VueEasyPullRefresh, {
            props: { pullDownThreshold: 80 },
            slots: {
                default: '<p>content</p>',
                loader: '<span class="custom-loader">loading…</span>'
            }
        });

        const root = wrapper.find('div');
        await root.trigger('mousedown', { clientY: 0 });
        await root.trigger('mousemove', { clientY: 30 });

        expect(wrapper.html()).toContain('custom-loader');
    });
});
