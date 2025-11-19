# Usage
## Basic example
Automatically refresh content when users pull down. The child component re-renders and updates with new state, making it a seamless way to fetch fresh data.

::: info Preview
<ClientOnly>
    <VueEasyPullRefresh>
        <TestScreen />
    </VueEasyPullRefresh>
</ClientOnly>
:::

::: details Show code
```vue
<template>
    <VueEasyPullRefresh>
        <!-- content -->
    </VueEasyPullRefresh>
</template>
```
:::

## Custom Loader
Easily customize the loading indicator by using the loader slot. Replace the default spinner with your own design to match your app's style.

::: info Preview
<ClientOnly>
    <VueEasyPullRefresh>
        <template #loader>
            <div style="background: grey; height: 100%; display: flex; justify-content: center; align-items: center;">
                <span>Loading...</span>
            </div>
        </template>
        <TestScreen />
    </VueEasyPullRefresh>
</ClientOnly>
:::

::: details Show code
```vue
<template>
    <VueEasyPullRefresh>
        <template #loader>
            <!-- custom loader -->
        </template>
        <!-- content -->
    </VueEasyPullRefresh>
</template>
```
:::

## Controlled Refresh
Use `useEasyPullRefresh` to queue async requests during a refresh, ensuring the content updates only after all operations are complete.

::: info Preview
<ClientOnly>
    <VueEasyPullRefresh :is-refresh-content="false">
        <TestFetch />
    </VueEasyPullRefresh>
</ClientOnly>
:::

::: details Show code
::: code-group
```vue [*.vue]
<template>
    <VueEasyPullRefresh :is-refresh-content="false">
        <ChildComponent>
            <DeepChildComponent>
        </ChildComponent>
    </VueEasyPullRefresh>
</template>
```
```vue [ChildComponent.vue]
<script setup>
    import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

    const { pullDownQueueAdd } = useEasyPullRefresh();

    const request1 = Promise.resolve;

    pullDownQueueAdd(request1);
</script>
```
```vue [DeepChildComponent.vue]
<script setup>
    import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

    const { pullDownQueueAdd } = useEasyPullRefresh();

    const request2 = Promise.resolve;

    pullDownQueueAdd(request2);
</script>
```
:::

## Use with initial Queue
Pass the first request in the queue as a prop to execute when pull-to-refresh is triggered.

::: info Preview
<ClientOnly>
    <TestInititialQueue />
</ClientOnly>
:::

::: details Show code
```vue
<template>
    <VueEasyPullRefresh :initial-queue="someRequest">
        <!-- content -->
    </VueEasyPullRefresh>
</template>

<script setup>
    function someRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500, true);
        });
    }
</script>
```
:::

## Controlled Refresh at Component Level
::: warning Deprecated
This approach is deprecated starting from version 1.1.3. Use the `initial-queue` prop instead.
:::

Use `useEasyPullRefresh` to manage pull-to-refresh and queue async requests directly within the component, ensuring content updates after all operations are finished.

::: info Preview
<ClientOnly>
    <TestContentFetch />
</ClientOnly>
:::

::: details Show code
```vue
<template>
    <VueEasyPullRefresh
        ref="refRefresh"
        :is-refresh-content="false"
    >
        <!-- content -->
    </VueEasyPullRefresh>
</template>

<script setup>
    import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

    const { refRefresh, pullDownQueueAdd } = useEasyPullRefresh();

    const request = Promise.resolve;

    pullDownQueueAdd(request);
</script>
```
:::