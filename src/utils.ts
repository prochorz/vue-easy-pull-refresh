export function hasScrollbar (el?: Element | null) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    const style = window.getComputedStyle(el);
    return style.overflowY === 'scroll' || (style.overflowY === 'auto' && el.scrollHeight > el.clientHeight);
}

export function getScrollParents (el?: Element | null, stopAt?: Element | null) {
    const elements: HTMLElement[] = [];
    let currentEl = el;

    if (stopAt && currentEl && !stopAt.contains(currentEl)) return elements;

    while (currentEl) {
        if (hasScrollbar(currentEl)) {
            elements.push(currentEl as HTMLElement);
        }
        if (currentEl === stopAt) {
            break;
        }

        currentEl = currentEl.parentElement!;
    }

    return elements;
}

export function debounce(callback: (...args: Array<any>) => void, wait = 150) {
    let timeoutId: ReturnType<typeof setTimeout>;

    return new Proxy(callback, {
        apply(target, thisArg, argumentsList) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                Reflect.apply(target, thisArg, argumentsList);
            }, wait);
        },
    });
}