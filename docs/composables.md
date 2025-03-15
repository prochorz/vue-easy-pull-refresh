# **`useEasyPullRefresh`**

`useEasyPullRefresh` is a custom Vue composition function designed to simplify the integration of pull-to-refresh functionality. It provides methods and reactive states to help you manage the refresh process, queue asynchronous tasks, and handle the pull-to-refresh lifecycle.

## **Usage**

You can use the `useEasyPullRefresh` function in the `setup` function of your Vue component. If you're interacting with the `<VueEasyPullRefresh>` component within the same component, `refRefresh` is available for direct manipulation of the component.

### Example Usage:
```vue
<script setup>
import { useEasyPullRefresh } from 'vue-easy-pull-refresh';

const { pullDownQueueAdd } = useEasyPullRefresh();

// Adding a custom refresh task
const myRefreshTask = async () => {
  // Simulate an async task
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Task completed!');
};

pullDownQueueAdd(myRefreshTask);
</script>
```

## Return Values

### **`refRefresh`** (optional)
- **Type**: `Ref<HTMLElement | undefined>`
- **Description**: A reference to the `<VueEasyPullRefresh>` component. This is optional and only needed if you're interacting with the component's DOM or accessing its internal methods directly within the same component.

### **`pullDownQueueAdd`**
- **Type**: `Function`
- **Description**: A method that allows you to add an asynchronous callback function to the refresh queue. This is useful when you need to queue up multiple tasks (e.g., network requests) that must complete before the refresh is considered finished.
