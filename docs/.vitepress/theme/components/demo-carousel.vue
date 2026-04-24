<template>
    <div class="carousel-demo">
        <div class="carousel-demo__hint">
            <span>⬇ Pull down to refresh · ← swipe carousel →</span>
        </div>
        <div class="carousel-demo__meta">
            <div>Refreshed at <strong>{{ tick }}</strong></div>
            <div class="carousel-demo__badge">Session #{{ session }}</div>
        </div>
        <div class="carousel-demo__carousel">
            <div
                v-for="n in 12"
                :key="n"
                class="carousel-demo__slide"
            >
                Slide #{{ n }}
            </div>
        </div>
        <p class="carousel-demo__note">
            Swipe the strip above horizontally — loader must stay hidden even with
            a slight vertical drift. Pull straight down on the background to refresh.
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useEasyPullRefresh } from '../../../../src';

const INNER_DELAY = 500;

function formatTime() {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function buildSession() {
    return Math.floor(1000 + Math.random() * 9000);
}

const tick = ref(formatTime());
const session = ref(buildSession());

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(() => new Promise(resolve => {
    setTimeout(() => {
        tick.value = formatTime();
        session.value = buildSession();
        resolve(true);
    }, INNER_DELAY);
}));
</script>

<style scoped>
    .carousel-demo {
        color: black;
        background: white;
        padding: 14px;
        min-height: 240px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .carousel-demo__hint {
        text-align: center;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #888;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 6px;
    }

    .carousel-demo__meta {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        font-size: 13px;
    }

    .carousel-demo__meta strong {
        font-variant-numeric: tabular-nums;
    }

    .carousel-demo__badge {
        background: #f1f1f1;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        color: #555;
    }

    .carousel-demo__carousel {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 6px 2px;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
    }

    .carousel-demo__slide {
        flex: 0 0 70%;
        height: 90px;
        border-radius: 8px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        scroll-snap-align: start;
        user-select: none;
    }

    .carousel-demo__note {
        font-size: 12px;
        color: #666;
        margin: 0;
        line-height: 1.4;
    }
</style>
