import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';

import { debounce, getScrollParents, hasScrollbar } from '../src/utils';

function createEl(styles: Partial<CSSStyleDeclaration> = {}, opts: { scrollHeight?: number; clientHeight?: number } = {}) {
    const el = document.createElement('div');
    Object.assign(el.style, styles);
    if (opts.scrollHeight !== undefined) {
        Object.defineProperty(el, 'scrollHeight', { value: opts.scrollHeight, configurable: true });
    }
    if (opts.clientHeight !== undefined) {
        Object.defineProperty(el, 'clientHeight', { value: opts.clientHeight, configurable: true });
    }
    return el;
}

describe('hasScrollbar', () => {
    it('returns false when element is missing', () => {
        expect(hasScrollbar(null)).toBe(false);
        expect(hasScrollbar(undefined)).toBe(false);
    });

    it('returns false for non-element nodes', () => {
        const textNode = document.createTextNode('hello') as unknown as Element;
        expect(hasScrollbar(textNode)).toBe(false);
    });

    type Case = {
        label: string;
        style: Partial<CSSStyleDeclaration>;
        scrollHeight?: number;
        clientHeight?: number;
        expected: boolean;
    };

    test.for<Case>([
        { label: 'overflow-y: scroll', style: { overflowY: 'scroll' }, expected: true },
        { label: 'overflow-y: auto with overflowing content', style: { overflowY: 'auto' }, scrollHeight: 500, clientHeight: 100, expected: true },
        { label: 'overflow-y: auto without overflow', style: { overflowY: 'auto' }, scrollHeight: 100, clientHeight: 100, expected: false },
        { label: 'overflow-y: visible', style: { overflowY: 'visible' }, scrollHeight: 500, clientHeight: 100, expected: false }
    ])('returns $expected for $label', ({ style, scrollHeight, clientHeight, expected }, { expect }) => {
        const el = createEl(style, { scrollHeight, clientHeight });
        document.body.appendChild(el);
        expect(hasScrollbar(el)).toBe(expected);
    });
});

describe('getScrollParents', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('returns empty array when element is missing', () => {
        expect(getScrollParents(null)).toEqual([]);
    });

    it('collects every scrollable ancestor up the tree', () => {
        const outer = createEl({ overflowY: 'scroll' });
        const middle = createEl();
        const inner = createEl({ overflowY: 'scroll' });
        outer.appendChild(middle);
        middle.appendChild(inner);
        document.body.appendChild(outer);

        const parents = getScrollParents(inner);
        expect(parents).toEqual([inner, outer]);
    });

    it('stops collecting at stopAt element', () => {
        const outer = createEl({ overflowY: 'scroll' });
        const middle = createEl({ overflowY: 'scroll' });
        const inner = createEl({ overflowY: 'scroll' });
        outer.appendChild(middle);
        middle.appendChild(inner);
        document.body.appendChild(outer);

        const parents = getScrollParents(inner, middle);
        expect(parents).toEqual([inner, middle]);
    });

    it('returns empty array when stopAt does not contain target', () => {
        const container = createEl({ overflowY: 'scroll' });
        const outside = createEl({ overflowY: 'scroll' });
        document.body.appendChild(container);
        document.body.appendChild(outside);

        expect(getScrollParents(outside, container)).toEqual([]);
    });
});

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('invokes the callback once after wait elapses', () => {
        const cb = vi.fn();
        const debounced = debounce(cb, 100);

        debounced();
        debounced();
        debounced();

        expect(cb).not.toHaveBeenCalled();
        vi.advanceTimersByTime(100);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('defaults wait to 150ms', () => {
        const cb = vi.fn();
        const debounced = debounce(cb);

        debounced();
        vi.advanceTimersByTime(149);
        expect(cb).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('forwards arguments from the latest call', () => {
        const cb = vi.fn();
        const debounced = debounce(cb, 50) as unknown as (...args: unknown[]) => void;

        debounced('first');
        debounced('second', 42);
        vi.advanceTimersByTime(50);

        expect(cb).toHaveBeenCalledWith('second', 42);
    });
});
