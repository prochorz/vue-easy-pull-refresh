<template>
    <div
        :class="classes.container"
        @touchstart="touchStartHandler"
        @touchmove="touchMoveHandler"
        @touchend="touchEndHandler"
        @mousedown="touchStartHandler"
        @mouseup="touchEndHandler"
        @mouseleave="touchEndHandler"
        @mousemove="touchMoveHandler"
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

        <slot v-if="isControled" />
        <transition
            v-else
            :appear="false"
            :enter-active-class="classEnter"
            :leave-active-class="classLeave"
            @after-leave="refreshEnd"
        >
            <slot :key="uniqKey" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import {
    watch,
    computed,
    shallowRef,
    useCssModule
} from 'vue';

import { useProvide } from './use-context';

defineOptions({ name: 'VueEasyPullRefresh' });

const props = defineProps({
    /**
     * Enable/Disable controled behavior
     */
     isControled: {
        type: Boolean,
        default: false
    },
    /**
     * Enable/Disable opacity animation
     * only for isControled === false
     */
     isAppearAnimation: {
        type: Boolean,
        default: true
    },
    /**
     * Enable/Disable
     */
     isDisabled: {
        type: Boolean,
        default: false
    },
    /**
     * d&d height
     */
    pullDownThreshold: {
        type: Number,
        default: 64
    }
});

const emit = defineEmits({
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

const uniqKey = shallowRef();
const isGoingUp = shallowRef(false);

const isLoaderExist = computed(() => !props.isDisabled && (isGoingUp.value || topOffset.value));

const classLeave = computed(() => {
    return [
        classes.refreshLeave,
        props.isAppearAnimation ? classes.refreshFadeLeave : null
    ].join(" ");
});
const classEnter = computed(() => {
    return [
        classes.refreshEnter,
        props.isAppearAnimation ? classes.refreshFadeEnter : null
    ].join(" ");
});

const contentStyle = computed(() => ({
    overflow: topOffset.value ? 'hidden' : 'unset',
    userSelect: topOffset.value ? 'none' : 'auto',
    transform: `translateY(${topOffset.value}px)`,
    transition: isGoingUp.value ? `all .3s cubic-bezier(0.25, 1.5, 0.5, 1)` : 'unset'
}));
const loaderStyle = computed(() => ({ maxHeight: `${topOffset.value}px` }));

function loaderEndHandler() {
    if (isGoingUp.value) {
        isGoingUp.value = false;
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
};

watch(isRefreshing, () => {
    if (isRefreshing.value) {
        uniqKey.value = Date.now();
    }
});

watch(topOffset, topOffsetUpdate);

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
    animation-duration: 1.5s;
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
