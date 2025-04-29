import {
    watch,
    shallowRef,
    onUnmounted
} from 'vue';

import { debounce } from './utils';

function useResizeObserver() {
    const refEl = shallowRef();

    let resizeObserver: ResizeObserver;

    const height = shallowRef(0);

    const updateResizeHandler = debounce(() => {
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
        height
    };
}

export default useResizeObserver;
