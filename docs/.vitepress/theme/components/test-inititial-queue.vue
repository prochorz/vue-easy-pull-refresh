<template>
    <VueEasyPullRefresh
        :initial-queue="someRequest"
    >
        <div class="test-screen">
            <div
                v-if="!isLoading"
                class="text"
            >
                {{ rundomText }}
            </div>
            <div v-else>
                Loading Request...
            </div>
        </div>
    </VueEasyPullRefresh>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(false);
const rundomText = ref('Test');

function updateText() {
    const dateNow = new Date();
    const message = dateNow.getTime() % 2 === 0 ? 'I was fetch at: ' : 'I was fetch again at: ';
    rundomText.value = message + dateNow.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function someRequest() {
    isLoading.value = true;

    return new Promise(resolve => {
        setTimeout(() => {
            updateText();
            isLoading.value = false;
            resolve(true);
        }, 1500);
    });
}
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