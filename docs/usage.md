# Usage

## Playground
Interactive sandbox for `VueEasyPullRefresh`. Toggle any prop on the left and pull down inside the preview on the right to see the result. Event counters show how many times `reached` and `settled` have fired.

<ClientOnly>
    <TestPlayground />
</ClientOnly>

---

## Basic example
The smallest possible usage. Pull down inside the preview — the timestamp and session badge update so you can see the refresh happen. Each preview on this page contains a `⬇ Pull down ⬇` hint: the gesture works with the mouse too (press-drag).

<ClientOnly>
    <DemoBox />
</ClientOnly>

::: details Show code
```vue
<template>
    <VueEasyPullRefresh>
        <!-- content -->
    </VueEasyPullRefresh>
</template>
```
:::

---

## `pullDownThreshold`
Distance the user must pull before a refresh fires. Try both — the right one fires only after a longer drag.

<ClientOnly>
    <DemoPair>
        <DemoBox
            label="pullDownThreshold = 40"
            :pull-down-threshold="40"
        />
        <DemoBox
            label="pullDownThreshold = 120"
            :pull-down-threshold="120"
        />
    </DemoPair>
</ClientOnly>

::: details Show code
```vue
<template>
    <VueEasyPullRefresh :pull-down-threshold="40" />
    <VueEasyPullRefresh :pull-down-threshold="120" />
</template>
```
:::

---

## `isAppearAnimation`
Controls the fade-in of the refreshed content. Pull both and compare — the right one swaps without animation.

<ClientOnly>
    <DemoPair>
        <DemoBox label="with fade (default)" />
        <DemoBox
            label="isAppearAnimation = false"
            :is-appear-animation="false"
        />
    </DemoPair>
</ClientOnly>

::: details Show code
```vue
<template>
    <VueEasyPullRefresh />
    <VueEasyPullRefresh :is-appear-animation="false" />
</template>
```
:::

---

## `isFreezeContent`
Defers the content swap until the loader is fully hidden. Pull both — on the left the new content fades in while the loader is still rolling up; on the right the old content stays put until the loader disappears, then the new content appears.

<ClientOnly>
    <DemoPair>
        <DemoBox label="default" />
        <DemoBox
            label="isFreezeContent = true"
            :is-freeze-content="true"
        />
    </DemoPair>
</ClientOnly>

::: details Show code
```vue
<template>
    <VueEasyPullRefresh />
    <VueEasyPullRefresh :is-freeze-content="true" />
</template>
```
:::

---

## `isRefreshContent`
When `true` (default), the slot is re-keyed on every refresh so its child components re-mount. When `false`, the slot stays in place and you update data yourself via the queue.

<ClientOnly>
    <DemoPair>
        <DemoBox label="isRefreshContent = true (remount)" />
        <DemoBox
            label="isRefreshContent = false (stay)"
            :is-refresh-content="false"
        />
    </DemoPair>
</ClientOnly>

In both previews the data still updates because the demo content registers a task via `pullDownQueueAdd`. On the left the whole slot also re-mounts; on the right the same instance keeps running.

::: details Show code
```vue
<template>
    <VueEasyPullRefresh />
    <VueEasyPullRefresh :is-refresh-content="false" />
</template>
```
:::

---

## `isDisabled`
Turns the gesture off completely — no pull, no loader, no refresh.

<ClientOnly>
    <DemoBox
        label="isDisabled = true (try pulling — nothing happens)"
        :is-disabled="true"
    />
</ClientOnly>

::: details Show code
```vue
<template>
    <VueEasyPullRefresh :is-disabled="true" />
</template>
```
:::

---

## Custom loader
Replace the default spinner via the `loader` slot.

<ClientOnly>
    <DemoBox>
        <template #loader>
            <div style="background: #333; color: white; height: 100%; display: flex; justify-content: center; align-items: center;">
                <span>Loading…</span>
            </div>
        </template>
    </DemoBox>
</ClientOnly>

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

---

## `initialQueue`
Pass a refresh callback as a prop. It runs every time the gesture completes, before the loader hides. The preview below waits 1.2&nbsp;s to resolve.

<ClientOnly>
    <DemoBox
        label="initialQueue = () => wait 1200ms"
        :use-initial-queue="true"
        :initial-queue-delay="1200"
    />
</ClientOnly>

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
        setTimeout(resolve, 1200, true);
    });
}
</script>
```
:::

---

## Queue from a child component
Descendants can register async tasks on the same refresh via `useEasyPullRefresh().pullDownQueueAdd`. All tasks run in parallel; the loader stays visible until the slowest one resolves. Pull the preview below — **Child A** (600&nbsp;ms) lands first, **Child B** (3000&nbsp;ms) lands later, and only then does the loader roll up.

<ClientOnly>
    <div style="height: 400px;">
        <VueEasyPullRefresh :is-refresh-content="false">
            <DemoQueue />
        </VueEasyPullRefresh>
    </div>
</ClientOnly>

::: details Show code
```vue
<!-- parent -->
<template>
    <VueEasyPullRefresh :is-refresh-content="false">
        <ChildA />
        <ChildB />
    </VueEasyPullRefresh>
</template>
```
```vue
<!-- ChildA.vue -->
<script setup>
import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(() => fetch('/api/feed').then(r => r.json()));
</script>
```
```vue
<!-- ChildB.vue -->
<script setup>
import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(() => fetch('/api/notifications').then(r => r.json()));
</script>
```
:::

Callbacks registered this way are automatically removed when their component unmounts.

---

## Deprecated: ref-based controlled refresh
::: warning Deprecated
This approach is deprecated starting from version 1.1.3. Use the [`initialQueue`](#initialqueue) prop or [queue from a child component](#queue-from-a-child-component) instead.
:::

Older versions exposed the queue through a template ref. It still works but new code should prefer the patterns above.

<ClientOnly>
    <TestContentFetch />
</ClientOnly>

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

pullDownQueueAdd(() => Promise.resolve());
</script>
```
:::
