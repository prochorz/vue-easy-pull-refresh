import type { ComponentPublicInstance } from 'vue';
import type {
    TQueueCallback,
    IPullRefreshProps,
    IPullRefreshContext
} from './index.types';

import {
    ref,
    watch,
    inject,
    provide,
    computed,
    shallowRef,
    onBeforeUnmount
} from 'vue';

const selectInjectionKey = Symbol('pull-refresh');

function useProvide(props: Readonly<IPullRefreshProps>): IPullRefreshContext {
    const queue = new Set<TQueueCallback>();

    let touchstartY = 0;
    const touchDiff = shallowRef(0);
    const isTouching = shallowRef(false);
    const isRefreshing = shallowRef(false);
    const isAsyncInProgress = shallowRef(false);

    const isCanRefresh = computed(() => touchDiff.value >= (props.pullDownThreshold || 0) && !isRefreshing.value);
    const topOffset = computed(() => Math.max(0, Math.min(props.pullDownThreshold || 0, touchDiff.value)));
    
    function refreshEnd() {
        if (!isRefreshing.value || isAsyncInProgress.value) return;
    
        touchDiff.value = 0;
        isRefreshing.value = false;
    }
    
    async function refreshStart() {
        isRefreshing.value = true;

        if (queue.size) {
            isAsyncInProgress.value = true;
            await Promise.all(Array.from(queue).map(callback => callback()));
            isAsyncInProgress.value = false;

            refreshEnd();
        }
    }
    
    function touchStartHandler (e: TouchEvent | MouseEvent) {
        if (isRefreshing.value || props.isDisabled) return;
    
        isTouching.value = true;
        touchstartY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    }
    
    function touchMoveHandler (e: TouchEvent | MouseEvent) {
        if (isRefreshing.value || !isTouching.value || props.isDisabled) return;
    
        const touchY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    
        touchDiff.value = touchY - touchstartY;
    }
    
    function touchEndHandler () {
        if (isRefreshing.value || props.isDisabled) return;
    
        isTouching.value = false;
    
        if (isCanRefresh.value) {
            refreshStart();
        } else {
            touchDiff.value = 0;
        }
    }

    function updateInitialQueue(currentFn?: TQueueCallback, prevFn?: TQueueCallback) {
        if (prevFn) {
            queue.delete(prevFn);
        }

        if (currentFn) {
            queue.add(currentFn);
            
        }
    }

    onBeforeUnmount(() => {
        queue.clear();
    });

    watch(() => props.initialQueue, updateInitialQueue, { immediate: true });

    const context = {
        queue,
        topOffset,
        isRefreshing,
        refreshEnd,
        touchEndHandler,
        touchMoveHandler,
        touchStartHandler
    };

    provide(selectInjectionKey, context);

    return context;
}

function useEasyPullRefresh() {
    const refRefresh = ref<ComponentPublicInstance<{ queue: IPullRefreshContext['queue'] }> | null>(null);

    /**
     * @deprecated since v1.1.0. Use initial-queue prop instead.
     */
    function waiter() {
        return new Promise((resolve, reject) => {
            const decline = setTimeout(reject, 1000, new Error('PullToRefresh: context not found'));

            const check = () => {
                if (!refRefresh.value) {
                    window.requestAnimationFrame(check);
                } else {
                    clearTimeout(decline);
                    resolve(true);
                }
            };

            check();
        });
    }

    const defaultContext = {
        queue: new Proxy(new Set(), {
            get(target, prop: keyof Set<TQueueCallback>) {
                if (typeof target[prop] === 'function') {
                    return async () => {
                        await waiter();

                        return refRefresh.value?.queue
                            ? (refRefresh.value.queue[prop] as TQueueCallback)()
                            : undefined;
                    }
                }

                return refRefresh.value?.queue[prop];
            }
        })
    };

    const context = inject(selectInjectionKey, defaultContext as IPullRefreshContext) as ReturnType<typeof useProvide>;

    function pullDownQueueAdd(callback: TQueueCallback) {
        context.queue.add(callback);

        onBeforeUnmount(() => {
            context.queue.delete(callback);
        });
    }

    return {
        refRefresh,
        pullDownQueueAdd
    };
}

export {
    useProvide,
    useEasyPullRefresh
};
