# VueEasyPullRefresh

Lightweight pull-to-refresh component for Vue 3. Works on both mobile (touch) and desktop (mouse). Bring-your-own loader, register async tasks from anywhere in the tree, and fine-tune the refresh animation.

**[Live demo & full docs →](https://prochorz.github.io/vue-easy-pull-refresh/)**

## Features

- Vue 3 only, no extra runtime dependencies
- Touch and mouse gesture support
- Customizable loader via a named slot
- Register async tasks (`pullDownQueueAdd`) from any descendant — the loader waits for the slowest one
- Freeze the content swap until the loader is fully hidden
- Ships ESM + UMD builds with TypeScript declarations

## Requirements

- Vue >= 3.0 (peer dependency)
- Node >= 20 (dev only)

## Installation

```bash
npm install vue-easy-pull-refresh
```

## Quick start

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

## Props

| Prop                  | Type                           | Default     | Description |
|-----------------------|--------------------------------|-------------|-------------|
| `isRefreshContent`    | `Boolean`                      | `true`      | Re-mount the default slot on each refresh (re-keys children). Set to `false` if you want the same instances to stay in place and update their own data via the queue. |
| `isAppearAnimation`   | `Boolean`                      | `true`      | Fade-in animation of the refreshed content. Only applicable when `isRefreshContent` is `true`. |
| `isFreezeContent`     | `Boolean`                      | `false`     | Defer the content swap animation until the loader is fully hidden (until `settled`). Only applicable when `isRefreshContent` is `true`. |
| `isDisabled`          | `Boolean`                      | `false`     | Turn the gesture off entirely — no pull, no loader, no refresh. |
| `pullDownThreshold`   | `Number`                       | `64`        | Distance (px) the user has to pull before a refresh fires. |
| `initialQueue`        | `() => Promise<unknown>`       | `undefined` | Async callback that runs on every refresh. Useful when you only have a single task and don't want to wire `useEasyPullRefresh` inside a child. |

## Events

| Event     | Payload | Description |
|-----------|---------|-------------|
| `reached` | —       | Emitted when the pull-down gesture reaches `pullDownThreshold` and the refresh starts. |
| `settled` | —       | Emitted when the refresh animation finishes and the component returns to its idle state. |

## Slots

| Slot      | Description |
|-----------|-------------|
| `default` | Main content wrapped by the pull-to-refresh gesture. |
| `loader`  | Custom loader shown while the refresh is in progress. Falls back to a built-in spinner if omitted. |

## Example: refresh an API call

Pass an async callback via `initial-queue` — it runs on every pull-down refresh, and the loader stays visible until the promise resolves.

```vue
<template>
    <VueEasyPullRefresh :initial-queue="load">
        <FeedList />
    </VueEasyPullRefresh>
</template>

<script setup>
import { VueEasyPullRefresh } from 'vue-easy-pull-refresh';

function load() {
    return fetch('/api/feed').then(r => r.json());
}
</script>
```

For multiple tasks across children, custom loaders, and more — see the [full docs](https://prochorz.github.io/vue-easy-pull-refresh/).

## License

MIT — see [LICENSE](./LICENSE).
