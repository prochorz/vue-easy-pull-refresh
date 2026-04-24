import type { ComputedRef, ShallowRef } from 'vue';

type TQueueCallback = () => Promise<unknown>;

interface IPullRefreshContext {
    queue: Set<TQueueCallback>;
    topOffset: ComputedRef<number>;
    isRefreshing: ShallowRef<boolean>;
    waitForRefresh: () => Promise<unknown>;
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
     * Freeze refreshing content until the loader is fully hidden.
     * When true, enter/leave opacity animations are deferred until the `settled` event.
     */
    isFreezeContent?: boolean;

    /**
     * Enable/Disable
     */
    isDisabled?: boolean;
  
    /**
     * d&d height
     */
    pullDownThreshold?: number;

    /**
     * Max angle (in degrees) from the vertical axis that still counts as a
     * pull-down. Larger angles are treated as horizontal and ignored until
     * the gesture ends — prevents nested carousels/tabs from triggering a
     * refresh. Use 90 to disable the lock.
     */
    directionLockAngle?: number;

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