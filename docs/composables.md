# **`useEasyPullRefresh`**

`useEasyPullRefresh` is a Vue composable for registering async tasks on the pull-to-refresh queue. Call it inside **descendant** components of `<VueEasyPullRefresh>` — the queue is shared via provide/inject.

For a single refresh callback in the parent component, use the [`initialQueue`](/component#initialqueue) prop instead.

## **Usage**

Register one or more async callbacks from a child component. Each callback is automatically removed when that component unmounts.

### Example:
```vue
<!-- Parent.vue -->
<template>
    <VueEasyPullRefresh :is-refresh-content="false">
        <FeedList />
    </VueEasyPullRefresh>
</template>

<!-- FeedList.vue -->
<script setup>
import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

const { pullDownQueueAdd } = useEasyPullRefresh();

pullDownQueueAdd(async () => {
    await fetch('/api/feed').then(r => r.json());
});
</script>
```

## Return Values

### **`pullDownQueueAdd`**
- **Type**: `(callback: () => Promise<unknown>) => void`
- **Description**: Adds an async callback to the refresh queue. Must be called inside a descendant of `<VueEasyPullRefresh>`. Multiple callbacks run in parallel; the loader waits for the slowest one.

### **`refRefresh`** (deprecated)
- **Type**: `Ref<ComponentPublicInstance | null>`
- **Description**: Template ref for the deprecated ref-based queue access. Do not use in new code — prefer [`initialQueue`](/component#initialqueue) or `pullDownQueueAdd` from a child component. Deprecated since v1.1.0.
