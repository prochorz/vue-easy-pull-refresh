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
            :enter-active-class="classEnter"
            :leave-active-class="classLeave"
            @after-leave="refreshEnd"
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

import { useProvide } from './use-context';
import { getScrollParents } from './utils';
import useResizeObserver from './use-resize-observer';
import { MIN_REFRESH_DURATION_MS } from './constants';

defineOptions({ name: 'VueEasyPullRefresh' });

const props = withDefaults(defineProps<IPullRefreshProps>(), {
    isRefreshContent: true,
    isAppearAnimation: true,
    isDisabled: false,
    pullDownThreshold: 64
});

const emit = defineEmits({
    started: null,
    settled: null,
    reached: null
});

const {
    queue,
    topOffset,
    refreshEnd,
    isRefreshing,
    touchEndHandler,
    touchMoveHandler,
    touchStartHandler
} = useProvide(props);
const classes = useCssModule();
const { refEl, height } = useResizeObserver();

let scrollParents: HTMLElement[] = [];

const uniqKey = shallowRef();
const isReady = shallowRef(false);
const isGoingUp = shallowRef(false);

const isLoaderExist = computed(() => !props.isDisabled && (isGoingUp.value || topOffset.value));

const classLeave = computed(() => {
    if (!isReady.value) {
        return "";
    }

    return [
        classes.refreshLeave,
        props.isAppearAnimation ? classes.refreshFadeLeave : null
    ].join(" ");
});
const classEnter = computed(() => {
    if (!isReady.value) {
        return "";
    }

    return [
        classes.refreshEnter,
        props.isAppearAnimation ? classes.refreshFadeEnter : null
    ].join(" ");
});

const contentStyle = computed(() => ({
    duration: `${MIN_REFRESH_DURATION_MS}ms`,
    overflow: topOffset.value ? 'hidden' : 'unset',
    userSelect: topOffset.value ? 'none' : 'auto',
    transform: `translateY(${topOffset.value}px)`,
    transition: isGoingUp.value ? `all .3s cubic-bezier(0.25, 1.5, 0.5, 1)` : 'unset'
}));
const loaderStyle = computed(() => ({ maxHeight: `${topOffset.value}px` }));

async function updateKey() {
    if (isRefreshing.value) {
        await nextTick();
        uniqKey.value = Date.now();
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

    if (!oldVal && newVal) {
        /**
         * Emitted when the pull-to-refresh gesture is initiated by the user.
         */
        emit('started');
    }

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

<style scoped module>
@keyframes loading { 
    100% { transform: rotate(1turn) }
}

@keyframes staticLeave { 
    0% { opacity: 1; }
    100% { opacity: 1; }
}

@keyframes staticEnter { 
    0% { opacity: 0; }
    100% { opacity: 0; }
}

@keyframes fadeLeave { 
    0% { opacity: 1; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes fadeEnter { 
    0% { opacity: 0; }
    50% { opacity: 0; }
    100% { opacity: 1; }
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

.refreshLeave,
.refreshEnter {
    pointer-events: none;
    animation-duration: v-bind('contentStyle.duration');
}

.refreshLeave {
    animation-name: staticLeave;
}

.refreshEnter {
    animation-name: staticEnter;
    position: absolute;
    inset: 0;
    z-index: 10000;
}

.refreshFadeLeave {
    animation-name: fadeLeave;
}

.refreshFadeEnter {
    animation-name: fadeEnter;
}
</style>
