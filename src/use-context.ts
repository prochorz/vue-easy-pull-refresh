import type { ComponentPublicInstance } from 'vue';

import {
    ref,
    inject,
    provide,
    computed,
    shallowRef,
    onBeforeUnmount
} from 'vue';

const selectInjectionKey = Symbol('pull-refresh');

type TQueueCallback = () => Promise<any>;

function useProvide<Props extends Record<string, any>>(props: Readonly<Props>) {
    const queue = new Set<TQueueCallback>();

    let touchstartY = 0;
    const touchDiff = shallowRef(0);
    const isTouching = shallowRef(false);
    const isRefreshing = shallowRef(false);

    const isCanRefresh = computed(() => touchDiff.value >= props.pullDownThreshold && !isRefreshing.value);
    const topOffset = computed(() => Math.max(0, Math.min(props.pullDownThreshold, touchDiff.value)));
    
    function refreshEnd() {
        if (!isRefreshing.value) return;
    
        touchDiff.value = 0;
        isRefreshing.value = false;
    }
    
    async function refreshStart() {
        isRefreshing.value = true;

        if (props.isControled) {
            await Promise.all(Array.from(queue).map(callback => callback()));
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

    onBeforeUnmount(() => {
        queue.clear();
    });

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
    const refRefresh = ref<ComponentPublicInstance | null>(null);

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

    const defaultContext: any = {
        queue: new Proxy(new Set(), {
            get(target: any, prop) {
                if (typeof target[prop] === 'function') {
                    return async (...arg: Array<any>) => {
                        await waiter();
                        return (refRefresh.value as any).queue[prop](...arg);
                    }
                }

                return (refRefresh.value as any).queue[prop];
            }
        })
    };

    const context = inject(selectInjectionKey, defaultContext) as ReturnType<typeof useProvide>;

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
