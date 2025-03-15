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
            v-if="!isDisabled"
            :class="classes.loaderWrapper"
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

const classes = useCssModule();

const {
    queue,
    topOffset,
    refreshEnd,
    isRefreshing,
    touchEndHandler,
    touchMoveHandler,
    touchStartHandler
} = useProvide(props);

const uniqKey = shallowRef();

const classLeave = computed(() => {
    return [
        classes.refreshLeave,
        props.isAppearAnimation ? classes.refreshFadeLeave : null
    ].join(" ");
});
const classEnter = computed(() => {
    return [
        classes.refreshEnter,
        props.isAppearAnimation ? classes.refreshEFadenter : null
    ].join(" ");
});

const contentStyle = computed(() => ({ transform: `translateY(${topOffset.value}px)` }));
const loaderStyle = computed(() => ({ top: `-${topOffset.value}px`, maxHeight: `${topOffset.value}px` }));

    
function pullDownReached() {
    if (topOffset.value === props.pullDownThreshold) {
        /**
         * Emitted when pull to down reached
         */
        emit('reached');
    }
}

watch(isRefreshing, () => {
    if (isRefreshing.value) {
        uniqKey.value = Date.now();
    }
});

watch(topOffset, pullDownReached);

defineExpose({ queue });
</script>

<style scoped module lang="scss">
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
    transform: v-bind('contentStyle.transform');
    transition: transform .3s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.loaderWrapper {
    position: absolute;
    height: 9999px;
    right: 0;
    left: 0;
    transition: all .3s cubic-bezier(0.25, 1.5, 0.5, 1);
    overflow: hidden;
    top: v-bind('loaderStyle.top');
    max-height: v-bind('loaderStyle.maxHeight');
}

.defaultLoader {
    width: 100%;
    height: 100%;

    &:after {
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

    &:before {
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
}

.refreshLeave,
.refreshEnter {
    user-select: none;
    animation-duration: 1.5s;
}

.refreshLeave {
    animation-name: staticLeave;
}

.refreshEnter {
    animation-name: staticEnter;
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 10000;
}

.refreshFadeLeave {
    animation-name: fadeLeave;
}

.refreshEFadenter {
    animation-name: fadeEnter;
}
</style>
