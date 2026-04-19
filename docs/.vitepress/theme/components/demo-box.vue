<template>
    <div class="demo-box">
        <div
            v-if="label"
            class="demo-box__label"
        >
            {{ label }}
        </div>
        <div class="demo-box__frame">
            <VueEasyPullRefresh
                v-bind="$attrs"
                :initial-queue="useInitialQueue ? initialQueueFn : undefined"
            >
                <template
                    v-if="$slots.loader"
                    #loader
                >
                    <slot name="loader" />
                </template>
                <slot>
                    <DemoContent />
                </slot>
            </VueEasyPullRefresh>
        </div>
    </div>
</template>

<script setup lang="ts">
import DemoContent from './demo-content.vue';
import { VueEasyPullRefresh } from '../../../../src';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
    label?: string;
    useInitialQueue?: boolean;
    initialQueueDelay?: number;
}>(), {
    label: '',
    useInitialQueue: false,
    initialQueueDelay: 1200
});

function initialQueueFn() {
    return new Promise(resolve => {
        setTimeout(resolve, props.initialQueueDelay, true);
    });
}
</script>

<style scoped>
    .demo-box {
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .demo-box__label {
        font-size: 12px;
        font-weight: 600;
        padding: 6px 12px;
        background: var(--vp-c-bg-soft);
        border-bottom: 1px solid var(--vp-c-divider);
    }

    .demo-box__frame {
        flex: 1;
        min-height: 0;
    }
</style>
