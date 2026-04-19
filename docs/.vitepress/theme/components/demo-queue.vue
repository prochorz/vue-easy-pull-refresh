<template>
    <div class="queue-demo">
        <div class="queue-demo__hint">
            <span>⬇ Pull down ⬇</span>
        </div>
        <DemoQueueChild
            title="Child A — feed"
            :delay="600"
        />
        <DemoQueueChild
            title="Child B — notifications"
            :delay="3000"
        />
    </div>
</template>

<script setup lang="ts">
import DemoQueueChild from './demo-queue-child.vue';
</script>

<style scoped>
    .queue-demo {
        background: white;
        color: black;
        padding: 14px;
        min-height: 220px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .queue-demo__hint {
        text-align: center;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #888;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 6px;
    }
</style>
