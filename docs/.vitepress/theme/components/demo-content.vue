<template>
    <div class="demo">
        <div class="demo__hint">
            <span>⬇ Pull down ⬇</span>
        </div>
        <div class="demo__meta">
            <div class="demo__time">
                Refreshed at <strong>{{ tick }}</strong>
            </div>
            <div class="demo__session">
                Session #{{ session }}
            </div>
        </div>
        <TransitionGroup
            name="demo-list"
            tag="ul"
            class="demo__list"
        >
            <li
                v-for="n in items"
                :key="n"
            >
                Item #{{ n }}
            </li>
        </TransitionGroup>
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

const POOL = Array.from({ length: 12 }, (_, i) => i + 1);

function buildItems() {
    const shuffled = [...POOL].sort(() => Math.random() - 0.5);
    const size = 3 + Math.floor(Math.random() * 3);
    return shuffled.slice(0, size);
}

const tick = ref(formatTime());
const session = ref(buildSession());
const items = ref(buildItems());

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(() => new Promise(resolve => {
    setTimeout(() => {
        tick.value = formatTime();
        session.value = buildSession();
        items.value = buildItems();
        resolve(true);
    }, INNER_DELAY);
}));
</script>

<style scoped>
    .demo {
        color: black;
        background: white;
        padding: 14px;
        min-height: 220px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .demo__hint {
        text-align: center;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #888;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 6px;
    }

    .demo__meta {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        font-size: 13px;
    }

    .demo__time strong {
        font-variant-numeric: tabular-nums;
    }

    .demo__session {
        background: #f1f1f1;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        color: #555;
    }

    .demo__list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .demo__list li {
        background: wheat;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 13px;
    }

    .demo-list-move,
    .demo-list-enter-active,
    .demo-list-leave-active {
        transition: all 0.4s ease;
    }

    .demo-list-enter-from,
    .demo-list-leave-to {
        opacity: 0;
        transform: translateX(16px);
    }

    .demo-list-leave-active {
        position: absolute;
    }
</style>
