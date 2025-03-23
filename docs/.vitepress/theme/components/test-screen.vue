<template>
    <div class="test-screen">
        <div class="text">
            {{ rundomText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const rundomText = computed(() => {
    const dateNow = new Date();
    const message = dateNow.getTime() % 2 === 0 ? 'I was updated at: ' : 'I was updated again at: ';
    return message + dateNow.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
});
</script>

<style scoped>
    .test-screen {
        color: black;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text {
        background-color: rgba(green, 0.3);
    }
</style>