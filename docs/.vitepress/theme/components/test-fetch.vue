<template>
    <div class="test-screen">
        <TransitionGroup
            name="list"
            :class="isLoadingOne ? 'test-screen--loading' : null"
            tag="ul"
        >
            <li
                v-for="item in listOne"
                v-text="item"
                :key="10+item"
            />
        </TransitionGroup>
        <TransitionGroup
            name="list"
            :class="isLoadingTwo ? 'test-screen--loading' : null"
            tag="ul"
        >
            <li
                v-for="item in listTwo"
                v-text="item"
                :key="20+item"
            />
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useEasyPullRefresh } from '../../../../src';

const { pullDownQueueAdd } = useEasyPullRefresh();

const DATA = new Array(10).fill(null).map((_, index) => index);

function getRandomList() {
    let shuffled = DATA.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

const isLoadingOne = ref(false);
const isLoadingTwo = ref(false);

const listOne = ref<Array<number>>([]);
const listTwo = ref<Array<number>>([]);

function requestOne() {
    isLoadingOne.value = true;

    return new Promise(resolve => {
        setTimeout(() => {
            listOne.value = getRandomList();
            isLoadingOne.value = false;
            resolve(true);
        }, 1500);
    });
}

function requestTwo() {
    isLoadingTwo.value = true;

    return new Promise(resolve => {
        setTimeout(() => {
            setTimeout(() => {
                listTwo.value = getRandomList();
                isLoadingTwo.value = false;
                resolve(true);
            }, 1500);
        }, 1500);
    });
}

pullDownQueueAdd(requestOne);
pullDownQueueAdd(requestTwo);

requestOne();
requestTwo();
</script>

<style scoped>
    .test-screen {
        color: black;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .test-screen--loading {
        position: relative;
        min-height: 100px;
    }

    .test-screen--loading:before {
        content: '';
        position: absolute;
        inset: 0;
        background: white;
        opacity: .5;
    }

    .test-screen--loading:after {
        content: 'Loading...';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .test-screen ul {
        list-style: none;
    }

    .test-screen li {
        background: wheat;
        padding: 2px 6px;
        margin: 0;
        margin-bottom: 2px;
    }

    .list-move,
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .list-leave-active {
        position: absolute;
    }
</style>