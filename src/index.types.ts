import type { ComputedRef, ShallowRef } from 'vue';

type TQueueCallback = () => Promise<unknown>;

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
     * Enable/Disable refresh content
     */
    isRefreshContent?: boolean;

    /**
     * Enable/Disable opacity animation
     * on refrashing content
     * only for isRefreshContent === true
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
  
    /**
     * Initial Queue
     */
    initialQueue?: TQueueCallback;
}

export type {
    TQueueCallback,
    IPullRefreshProps,
    IPullRefreshContext
}