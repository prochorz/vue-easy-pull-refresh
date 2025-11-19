# VueEasyPullRefresh

VueEasyPullRefresh is a lightweight, easy-to-use pull-to-refresh plugin for Vue 3. With just a few lines of code, you can add pull-to-refresh functionality to your app, supporting both mobile and desktop platforms. Customize the loader, control refresh behavior, and manage asynchronous tasks seamlessly.

## Installation

Install `VueEasyPullRefresh` via npm:

```bash
npm install vue-easy-pull-refresh
```

## Setup

To use **VueEasyPullRefresh** in your Vue 3 project, follow these simple steps:

### Import

Import the component into your Vue component:

```vue
<template>
  <VueEasyPullRefresh>
    <!-- content -->
  </VueEasyPullRefresh>
</template>

<script setup>
import { VueEasyPullRefresh } from 'vue-easy-pull-refresh';
</script>
```

## Props

| Prop                  | Type     | Default | Description                                                  |
|-----------------------|----------|---------|--------------------------------------------------------------|
| `isRefreshContent`     | `Boolean`| `true` | Enable or disable refresh content                         |
| `isAppearAnimation`    | `Boolean`| `true`  | Enable or disable the opacity animation (only when `isRefreshContent` is `true`) |
| `isDisabled`           | `Boolean`| `false` | Disable pull-to-refresh functionality                        |
| `pullDownThreshold`    | `Number` | `64`    | The distance required for the user to pull down to trigger refresh |
| `initialQueue`         | `Function returning Promise` | `undefined` | Pass the first request in the queue as a prop to execute when pull-to-refresh is triggered |

## Events

- **`reached`**: Emitted when the pull-to-refresh threshold is reached and the refresh process begins.
- **`settled`**: Emitted when the refresh animation is fully completed and the component has returned to its idle state.

## Slots

- **`loader`**: Customize the loading indicator shown during refresh. If not provided, a default loader will be used.

## Usage with `useEasyPullRefresh`

In some cases, you may need to interact directly with the pull-to-refresh logic within your component. You can use the `useEasyPullRefresh` function to add asynchronous tasks to the refresh queue.

```vue
<template>
  <VueEasyPullRefresh ref="refRefresh" :is-refresh-сontent="false">
    <TestScreen />
  </VueEasyPullRefresh>
</template>

<script setup>
import { VueEasyPullRefresh, useEasyPullRefresh } from 'vue-easy-pull-refresh';

const { refRefresh, pullDownQueueAdd } = useEasyPullRefresh();

const request = () => {
  return new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async task
};

pullDownQueueAdd(request);
</script>
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
