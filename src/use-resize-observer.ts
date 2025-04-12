import {
    watch,
    shallowRef,
    onUnmounted
} from 'vue';

import { debounce } from './utils';

function useResizeObserver() {
    const refEl = shallowRef();

    let resizeObserver: ResizeObserver;

    const width = shallowRef(0);
    const height = shallowRef(0);

    const updateResizeHandler = debounce(() => {
        width.value = refEl.value?.clientWidth;
        height.value = refEl.value?.clientHeight;
    });

    function init() {
        resizeObserver = new ResizeObserver(updateResizeHandler);
        resizeObserver.observe?.(refEl.value);
    }

    function destroy() {
        resizeObserver?.disconnect?.();
    }

    watch(refEl, () => {
        if (refEl.value) {
            init();
        } else {
            destroy();
        }
    }, { immediate: true });

    onUnmounted(destroy);

    return {
        refEl,
        width,
        height
    };
}

export default useResizeObserver;
