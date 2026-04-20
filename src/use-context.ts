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

import { isSSR } from './utils';

const selectInjectionKey = Symbol('pull-refresh');

const ANIMATION_DURATION = 1500;

function useProvide(props: Readonly<IPullRefreshProps>): IPullRefreshContext {
    const queue = new Set<TQueueCallback>();

    let touchstartY = 0;
    const touchDiff = shallowRef(0);
    const isTouching = shallowRef(false);
    const isRefreshing = shallowRef(false);

    const isCanRefresh = computed(() => touchDiff.value >= (props.pullDownThreshold || 0) && !isRefreshing.value);
    const topOffset = computed(() => Math.max(0, Math.min(props.pullDownThreshold || 0, touchDiff.value)));

    let refreshingPromise: Promise<unknown> | null = null;
    let isUnmounted = false;

    async function refreshStart() {
        isRefreshing.value = true;

        refreshingPromise = Promise.all([
            new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION)),
            ...Array.from(queue, cb => cb())
        ]);
        try {
            await refreshingPromise;
        } catch {
            // Swallow queue-callback rejections so UI state still resets.
        } finally {
            refreshingPromise = null;
            if (!isUnmounted) {
                touchDiff.value = 0;
                isRefreshing.value = false;
            }
        }
    }

    function waitForRefresh(): Promise<unknown> {
        return refreshingPromise ?? Promise.resolve();
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
        isUnmounted = true;
        queue.clear();
    });

    watch(() => props.initialQueue, updateInitialQueue, { immediate: true });

    const context = {
        queue,
        topOffset,
        isRefreshing,
        waitForRefresh,
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
        if (isSSR) return Promise.resolve(true);

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
                    return async (...args: unknown[]) => {
                        await waiter();

                        return refRefresh.value?.queue
                            ? (refRefresh.value.queue[prop] as (...args: unknown[]) => unknown)(...args)
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
    ANIMATION_DURATION,
    useProvide,
    useEasyPullRefresh
};
