# **Setup**

The **`VueEasyPullRefresh`** component wraps your content and handles the pull gesture. Optionally, use the **`useEasyPullRefresh`** composable in descendant components to register async refresh tasks. Follow the steps below to integrate them into your Vue project.

## **Installation**

Before you begin using `useEasyPullRefresh` and `VueEasyPullRefresh`, ensure that the library is installed in your project.

### **Install Dependencies**

If you haven’t installed the necessary package yet, you can do so via npm:

```bash
npm install vue-easy-pull-refresh
```

## Basic Setup

Once the library is installed, wrap your content with `VueEasyPullRefresh`:

```vue
<template>
    <VueEasyPullRefresh>
        <YourContent />
    </VueEasyPullRefresh>
</template>

<script setup>
import { VueEasyPullRefresh } from 'vue-easy-pull-refresh';
</script>
```

Need to fetch data on refresh? Pass an async callback via `initial-queue`:

```vue
<VueEasyPullRefresh :initial-queue="loadData">
    <YourContent />
</VueEasyPullRefresh>
```

For multiple tasks from child components, import `useEasyPullRefresh` in those descendants — see [Composables](/composables).