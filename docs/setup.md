# **Setup**

The **`useEasyPullRefresh`** function and the **`VueEasyPullRefresh`** component are designed to be used together in your Vue3 project to provide an easy-to-use pull-to-refresh experience. Follow the steps below to integrate them into your Vue components.

## **Installation**

Before you begin using `useEasyPullRefresh` and `VueEasyPullRefresh`, ensure that the library is installed in your project.

### **Install Dependencies**

If you haven’t installed the necessary package yet, you can do so via npm:

```bash
npm install vue-easy-pull-refresh
```

## Basic Setup

Once the library is installed, you can start using it in your Vue components.

### Importing `VueEasyPullRefresh` and `useEasyPullRefresh`

In your component, import both the `VueEasyPullRefresh` component and the `useEasyPullRefresh` function from the library:
```vue
<script setup>
import { VueEasyPullRefresh, useEasyPullRefresh } from 'vue-easy-pull-refresh';
</script>
```