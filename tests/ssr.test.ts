// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import VueEasyPullRefresh from '../src/vue-easy-pull-refresh.vue';
import { useEasyPullRefresh } from '../src/use-context';
import useResizeObserver from '../src/use-resize-observer';
import { getScrollParents, hasScrollbar } from '../src/utils';

describe('SSR safety', () => {
    it('renders component to string without touching browser globals', async () => {
        const html = await renderToString(h(VueEasyPullRefresh, null, () => h('p', 'content')));
        expect(html).toContain('content');
    });

    it('mounts component inside a parent during SSR', async () => {
        const Parent = defineComponent({
            setup() {
                return () => h(VueEasyPullRefresh, null, { default: () => h('p', 'inner') });
            }
        });
        await expect(renderToString(h(Parent))).resolves.toContain('inner');
    });

    it('useEasyPullRefresh sets up without browser globals', async () => {
        const Comp = defineComponent({
            setup() {
                useEasyPullRefresh();
                return () => h('div');
            }
        });
        await expect(renderToString(h(Comp))).resolves.toBeTypeOf('string');
    });

    it('hasScrollbar returns false on server without accessing window', () => {
        expect(hasScrollbar(null)).toBe(false);
        expect(hasScrollbar(undefined)).toBe(false);
    });

    it('getScrollParents returns empty array on server', () => {
        expect(getScrollParents(null)).toEqual([]);
        expect(getScrollParents(undefined)).toEqual([]);
    });

    it('hasScrollbar does not reach window.getComputedStyle on server', () => {
        const fakeEl = { nodeType: 1 } as unknown as Element;
        expect(() => hasScrollbar(fakeEl)).not.toThrow();
        expect(hasScrollbar(fakeEl)).toBe(false);
    });

    it('useResizeObserver does not instantiate ResizeObserver on server', async () => {
        const Comp = defineComponent({
            setup() {
                const { refEl } = useResizeObserver();
                refEl.value = { clientHeight: 100 } as unknown as HTMLElement;
                return () => h('div');
            }
        });
        await expect(renderToString(h(Comp))).resolves.toBeTypeOf('string');
    });
});
