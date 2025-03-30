<template>
    <div class="test-screen">
        <ul :class="isLoadingOne ? 'test-screen--loading' : null">
            <li
                v-for="item in listOne"
                v-text="item"
                :key="10+item"
            />
        </ul>
        <ul :class="isLoadingTwo ? 'test-screen--loading' : null">
            <li
                v-for="item in listTwo"
                v-text="item"
                :key="20+item"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
        }, 500);
    });
}

function requestTwo() {
    isLoadingTwo.value = true;

    return new Promise(resolve => {
        setTimeout(() => {
            listTwo.value = getRandomList();
            isLoadingTwo.value = false;
            resolve(true);
        }, 500);
    });
}

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
</style>