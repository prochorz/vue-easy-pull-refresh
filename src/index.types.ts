import type { ComputedRef, ShallowRef } from 'vue';

type TQueueCallback = (...arg: Array<unknown>) => Promise<unknown>;

interface IPullRefreshContext {
    queue: Set<TQueueCallback>;
    topOffset: ComputedRef<number>;
    isRefreshing: ShallowRef<boolean>;
    refreshEnd: () => void;
    touchEndHandler: () => void;
    touchMoveHandler: (e: TouchEvent | MouseEvent) => void;
    touchStartHandler: (e: TouchEvent | MouseEvent) => void;
}

interface IPullRefreshProps {
    /**
     * Enable/Disable controled behavior
     */
    isControled?: boolean;
  
    /**
     * Enable/Disable opacity animation
     * only for isControled === false
     */
    isAppearAnimation?: boolean;
  
    /**
     * Enable/Disable
     */
    isDisabled?: boolean;
  
    /**
     * d&d height
     */
    pullDownThreshold?: number;
}

export type {
    TQueueCallback,
    IPullRefreshProps,
    IPullRefreshContext
}