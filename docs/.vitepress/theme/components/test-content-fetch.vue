<template>
    <VueEasyPullRefresh
        :is-controled="true"
        ref="refRefresh"
    >
        <div class="test-screen">
            <div
                v-if="!isLoading"
                class="text"
            >
                {{ rundomText }}
            </div>
            <div v-else>
                Loading Request {{ currentRequest }}...
            </div>
        </div>
    </VueEasyPullRefresh>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { VueEasyPullRefresh, useEasyPullRefresh } from '../../../../src';

const { refRefresh, pullDownQueueAdd } = useEasyPullRefresh();

const isLoading = ref(false);
const currentRequest = ref(0);
const rundomText = ref();

function updateText() {
    const dateNow = new Date();
    const message = dateNow.getTime() % 2 === 0 ? 'I was fetch at: ' : 'I was fetch again at: ';
    rundomText.value = message + dateNow.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function someRequest() {
    isLoading.value = true;
    currentRequest.value = 1;

    return new Promise(resolve => {
        setTimeout(() => {
            updateText();
            isLoading.value = false;
            resolve(true);
        }, 1500);
    });
}

function someRequest2() {
    return new Promise(resolve => {
        setTimeout(() => {
            isLoading.value = true;
            currentRequest.value = 2;

            setTimeout(() => {
                updateText();
                isLoading.value = false;
                resolve(true);
            }, 1500);
        }, 1500);
    });
}

pullDownQueueAdd(someRequest);
pullDownQueueAdd(someRequest2);

someRequest();
</script>

<style scoped lang="scss">
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