<template>
    <div class="demo-pair">
        <slot />
    </div>
</template>

<style scoped>
    .demo-pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    @media (max-width: 640px) {
        .demo-pair {
            grid-template-columns: 1fr;
        }
    }
</style>
