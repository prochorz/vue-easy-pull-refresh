<template>
    <div class="playground">
        <div class="playground__controls">
            <div class="playground__row">
                <label class="playground__label">
                    <input
                        v-model="isRefreshContent"
                        type="checkbox"
                    >
                    <span>isRefreshContent</span>
                </label>
                <code class="playground__value">{{ isRefreshContent }}</code>
            </div>

            <div class="playground__row">
                <label class="playground__label">
                    <input
                        v-model="isAppearAnimation"
                        type="checkbox"
                        :disabled="!isRefreshContent"
                    >
                    <span>isAppearAnimation</span>
                </label>
                <code class="playground__value">{{ isAppearAnimation }}</code>
            </div>

            <div class="playground__row">
                <label class="playground__label">
                    <input
                        v-model="isFreezeContent"
                        type="checkbox"
                        :disabled="!isRefreshContent"
                    >
                    <span>isFreezeContent</span>
                </label>
                <code class="playground__value">{{ isFreezeContent }}</code>
            </div>

            <div class="playground__row">
                <label class="playground__label">
                    <input
                        v-model="isDisabled"
                        type="checkbox"
                    >
                    <span>isDisabled</span>
                </label>
                <code class="playground__value">{{ isDisabled }}</code>
            </div>

            <div class="playground__row playground__row--stack">
                <div class="playground__row-head">
                    <span>pullDownThreshold</span>
                    <code class="playground__value">{{ pullDownThreshold }}</code>
                </div>
                <input
                    v-model.number="pullDownThreshold"
                    type="range"
                    min="24"
                    max="200"
                    step="1"
                >
            </div>

            <div class="playground__row">
                <label class="playground__label">
                    <input
                        v-model="hasInitialQueue"
                        type="checkbox"
                    >
                    <span>initialQueue</span>
                </label>
                <code class="playground__value">{{ hasInitialQueue ? 'enabled' : 'undefined' }}</code>
            </div>

            <div class="playground__row playground__row--stack">
                <div class="playground__row-head">
                    <span>initialQueue delay (ms)</span>
                    <code class="playground__value">{{ delay }}</code>
                </div>
                <input
                    v-model.number="delay"
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    :disabled="!hasInitialQueue"
                >
            </div>

            <div class="playground__row playground__events">
                <span class="playground__label">Events</span>
                <code class="playground__value">reached: {{ reachedCount }} / settled: {{ settledCount }}</code>
            </div>

            <button
                class="playground__reset"
                type="button"
                @click="reset"
            >
                Reset
            </button>
        </div>

        <div
            :key="resetKey"
            class="playground__preview"
        >
            <VueEasyPullRefresh
                :is-refresh-content="isRefreshContent"
                :is-appear-animation="isAppearAnimation"
                :is-freeze-content="isFreezeContent"
                :is-disabled="isDisabled"
                :pull-down-threshold="pullDownThreshold"
                :initial-queue="hasInitialQueue ? initialQueueFn : undefined"
                @reached="reachedCount++"
                @settled="settledCount++"
            >
                <DemoContent />
            </VueEasyPullRefresh>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import DemoContent from './demo-content.vue';

const isRefreshContent = ref(true);
const isAppearAnimation = ref(true);
const isFreezeContent = ref(false);
const isDisabled = ref(false);
const pullDownThreshold = ref(64);
const hasInitialQueue = ref(false);
const delay = ref(1500);

const reachedCount = ref(0);
const settledCount = ref(0);
const resetKey = ref(0);

function initialQueueFn() {
    return new Promise(resolve => {
        setTimeout(resolve, delay.value, true);
    });
}

function reset() {
    isRefreshContent.value = true;
    isAppearAnimation.value = true;
    isFreezeContent.value = false;
    isDisabled.value = false;
    pullDownThreshold.value = 64;
    hasInitialQueue.value = false;
    delay.value = 1500;
    reachedCount.value = 0;
    settledCount.value = 0;
    resetKey.value++;
}
</script>

<style scoped>
    .playground {
        display: grid;
        grid-template-columns: minmax(220px, 280px) 1fr;
        gap: 16px;
        align-items: start;
    }

    @media (max-width: 640px) {
        .playground {
            grid-template-columns: 1fr;
        }
    }

    .playground__controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        background: var(--vp-c-bg-soft);
    }

    .playground__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 13px;
    }

    .playground__row--stack {
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
    }

    .playground__row--stack input[type="range"] {
        width: 100%;
    }

    .playground__row-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .playground__label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        flex: 1;
    }

    .playground__label input[type="range"] {
        flex: 1;
        min-width: 0;
    }

    .playground__value {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--vp-c-bg-alt);
        white-space: nowrap;
    }

    .playground__events {
        margin-top: 4px;
        padding-top: 8px;
        border-top: 1px dashed var(--vp-c-divider);
    }

    .playground__reset {
        margin-top: 4px;
        padding: 6px 10px;
        border: 1px solid var(--vp-c-divider);
        border-radius: 6px;
        background: var(--vp-c-bg);
        cursor: pointer;
        font-size: 13px;
    }

    .playground__reset:hover {
        background: var(--vp-c-bg-alt);
    }

    .playground__preview {
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        overflow: hidden;
    }
</style>
