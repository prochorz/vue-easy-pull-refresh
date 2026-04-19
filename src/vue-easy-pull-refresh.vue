<template>
    <div
        ref="refEl"
        :class="classes.container"
        @touchstart="readyTouchStartHandler"
        @touchmove="preventedTouchMoveHandler"
        @touchend="touchEndHandler"
        @mousedown="readyTouchStartHandler"
        @mouseup="touchEndHandler"
        @mouseleave="touchEndHandler"
        @mousemove="preventedTouchMoveHandler"
    >
        <div
            v-if="isLoaderExist"
            :class="classes.loaderWrapper"
            @transitionend="loaderEndHandler"
        >
            <slot name="loader">
                <div :class="classes.defaultLoader" />
            </slot>
        </div>

        <transition
            :css="false"
            @enter="enterHandler"
            @leave="leaveHandler"
        >
            <slot
                v-if="isRefreshContent"
                :key="uniqKey"
            />
            <slot v-else />
        </transition>
    </div>
</template>

<script setup lang="ts">
import type { IPullRefreshProps } from './index.types';

import {
    watch,
    computed,
    nextTick,
    shallowRef,
    withDefaults,
    useCssModule
} from 'vue';

import {
    useProvide,
    ANIMATION_DURATION
} from './use-context';
import { getScrollParents } from './utils';
import useResizeObserver from './use-resize-observer';

const FADE_IN_DELAYED: Keyframe[] = [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }];
const FADE_OUT_EARLY: Keyframe[] = [{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }];
const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

defineOptions({ name: 'VueEasyPullRefresh' });

const props = withDefaults(defineProps<IPullRefreshProps>(), {
    isRefreshContent: true,
    isAppearAnimation: true,
    isFreezeContent: false,
    isDisabled: false,
    pullDownThreshold: 64,
    initialQueue: undefined
});

const emit = defineEmits({
    settled: () => true,
    reached: () => true
});

const {
    queue,
    topOffset,
    isRefreshing,
    waitForRefresh,
    touchEndHandler,
    touchMoveHandler,
    touchStartHandler
} = useProvide(props);
const classes = useCssModule();
const { refEl, height } = useResizeObserver();

let scrollParents: HTMLElement[] = [];

let keyCounter = 0;
const uniqKey = shallowRef(0);
const isReady = shallowRef(false);
const isGoingUp = shallowRef(false);

const isLoaderExist = computed(() => !props.isDisabled && (isGoingUp.value || topOffset.value));

// Apply className, optionally wait for the queue (freeze mode), optionally
// play a WAAPI animation, then clean up. The className is applied before the
// wait so freeze mode gets pointer-events/positioning overrides during it.
async function transition(
    el: HTMLElement,
    keyframes: Keyframe[] | null,
    className: string,
    duration: number,
) {
    if (!isReady.value) return;
    if (!keyframes && !props.isFreezeContent) return;

    el.classList.add(className);
    if (props.isFreezeContent) await waitForRefresh();
    try {
        if (keyframes) {
            await el.animate(keyframes, { duration, fill: 'forwards' }).finished;
        }
    } finally {
        el.classList.remove(className);
    }
}

async function enterHandler(el: Element, done: () => void) {
    const [keyframes, duration] = props.isAppearAnimation
        ? (props.isFreezeContent
            ? [FADE_IN, ANIMATION_DURATION / 2]
            : [FADE_IN_DELAYED, ANIMATION_DURATION])
        : [null, 0];
    await transition(el as HTMLElement, keyframes, classes.refreshEnter, duration);
    done();
}

async function leaveHandler(el: Element, done: () => void) {
    const [keyframes, duration] = props.isAppearAnimation
        ? (props.isFreezeContent
            ? [HOLD, ANIMATION_DURATION / 2]
            : [FADE_OUT_EARLY, ANIMATION_DURATION])
        : [null, 0];
    await transition(el as HTMLElement, keyframes, classes.refreshLeave, duration);
    done();
}

const contentStyle = computed(() => ({
    overflow: topOffset.value ? 'hidden' : 'unset',
    userSelect: topOffset.value ? 'none' : 'auto',
    transform: `translateY(${topOffset.value}px)`,
    transition: isGoingUp.value ? `all .3s cubic-bezier(0.25, 1.5, 0.5, 1)` : 'unset'
}));
const loaderStyle = computed(() => ({ maxHeight: `${topOffset.value}px` }));

async function updateKey() {
    if (isRefreshing.value) {
        if (!props.isFreezeContent) {
            await nextTick();
        }
        uniqKey.value = ++keyCounter;
    }
}

function updateScrollParents() {
    scrollParents = getScrollParents(refEl.value);
}

function preventScrollParents() {
    if (scrollParents.length) {
        const stopScrolling = topOffset.value && !isRefreshing.value;

        scrollParents.forEach(p => {
            if (stopScrolling) {
                p.style.overflow = 'hidden';
            } else {
                p.style.removeProperty('overflow');
            }
        });
    }
}

function readyTouchStartHandler(e: TouchEvent | MouseEvent) {
    isReady.value = true;

    touchStartHandler(e);
}

function preventedTouchMoveHandler(e: TouchEvent | MouseEvent) {
    const isScrollParentsTop = scrollParents.length && !scrollParents[0].scrollTop;
    const isParentsTop = !scrollParents.length && !refEl.value.parentElement?.scrollTop;
    
    if (isScrollParentsTop || isParentsTop) {
        touchMoveHandler(e);
    }
}

function loaderEndHandler() {
    if (isGoingUp.value) {
        isGoingUp.value = false;
        /**
         * Emitted when the refresh animation is fully completed and the UI is idle.
         */
        emit('settled');
    }
}

    
function topOffsetUpdate(newVal: number, oldVal: number) {
    isGoingUp.value = newVal < oldVal;

    if (topOffset.value === props.pullDownThreshold) {
        /**
         * Emitted when pull to down reached
         */
        emit('reached');
    }
}

watch(isRefreshing, updateKey);
watch(topOffset, topOffsetUpdate);
watch(height, updateScrollParents);
watch([topOffset, isRefreshing], preventScrollParents);

defineExpose({ queue });
</script>

<style module>
@keyframes loading {
    100% { transform: rotate(1turn) }
}

.container {
    position: relative;
    height: 100%;
    overflow: v-bind('contentStyle.overflow');
    user-select: v-bind('contentStyle.userSelect');
    transition: v-bind('contentStyle.transition');
}

.container > * {
    transform: v-bind('contentStyle.transform');
    transition: inherit;
}

.loaderWrapper {
    position: absolute;
    height: 9999px;
    right: 0;
    left: 0;
    transition: inherit;
    overflow: hidden;
    transform: unset !important;
    max-height: v-bind('loaderStyle.maxHeight');
}

.defaultLoader {
    width: 100%;
    height: 100%;
}

.defaultLoader:after {
    content: "";
    position: absolute;
    right: 20px;
    bottom: -5px;
    left: 20px;
    height: 10px;
    border-radius: 50%;
    background-color: black;
    box-shadow: 0 0 12px 8px black;
    opacity: .1;
}

.defaultLoader:before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 25px;
    height: 25px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: 
        radial-gradient(farthest-side,black 94%,#0000) top/2px 2px no-repeat,
        conic-gradient(#0000 30%,black);
    -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 2px),#000 0);
    animation: loading 1s infinite linear;
}

.refreshLeave {
    pointer-events: none;
}

.refreshEnter {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 10000;
    opacity: 0;
}

</style>
