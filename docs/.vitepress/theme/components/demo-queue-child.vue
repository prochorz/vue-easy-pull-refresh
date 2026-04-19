<template>
    <div class="queue-child">
        <div class="queue-child__head">
            <strong>{{ title }}</strong>
            <span
                :class="[
                    'queue-child__badge',
                    isLoading ? 'queue-child__badge--loading' : 'queue-child__badge--ready'
                ]"
            >
                {{ isLoading ? 'loading…' : 'ready' }}
            </span>
        </div>
        <div class="queue-child__body">
            <template v-if="isLoading">
                Fetching for {{ delay }} ms…
            </template>
            <template v-else>
                Updated at <strong>{{ tick }}</strong>
                <br>Payload: <code>{{ payload }}</code>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useEasyPullRefresh } from '../../../../src';

const props = defineProps<{
    title: string;
    delay: number;
}>();

function formatTime() {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function buildPayload() {
    return '0x' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

const isLoading = ref(false);
const tick = ref(formatTime());
const payload = ref(buildPayload());

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(() => {
    isLoading.value = true;
    return new Promise(resolve => {
        setTimeout(() => {
            tick.value = formatTime();
            payload.value = buildPayload();
            isLoading.value = false;
            resolve(true);
        }, props.delay);
    });
});
</script>

<style scoped>
    .queue-child {
        background: white;
        color: black;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 13px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .queue-child__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .queue-child__badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;
    }

    .queue-child__badge--loading {
        background: #fff3cd;
        color: #7a5d00;
    }

    .queue-child__badge--ready {
        background: #d1e7dd;
        color: #0f5132;
    }

    .queue-child__body code {
        background: #f3f3f3;
        padding: 0 4px;
        border-radius: 3px;
    }
</style>
