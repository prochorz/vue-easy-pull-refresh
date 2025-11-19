# **`<VueEasyPullRefresh>`**

## Template structure
This is the simplify template of the `<VueEasyPullRefresh>`. It will be helpful for understanding the naming of [props](#props).

```vue
<template>
    <VueEasyPullRefresh>
        <!-- -->
    </VueEasyPullRefresh>
</template>
```

## Props

### **`isRefreshContent`**
- **Type**: `Boolean`
- **Default**: `true`
- **Description**: Enables or disables automatic content refresh inside the wrapper component. When enabled, the inner content will be reloaded during the refresh action.

---

### **`isAppearAnimation`**
- **Type**: `Boolean`
- **Default**: `true`
- **Description**: Enables or disables the fade-in animation of the content. This prop is only applicable when `isRefreshContent` is set to `true`.

---

### **`isDisabled`**
- **Type**: `Boolean`
- **Default**: `false`
- **Description**: Enables or disables the functionality of the component. When set to `true`, the component will not respond to user gestures, effectively disabling the pull-to-refresh behavior.

---

### **`pullDownThreshold`**
- **Type**: `Number`
- **Default**: `64`
- **Description**: Sets the height the user needs to pull down to trigger the refresh action. This value determines how sensitive the pull-to-refresh gesture is, and can be adjusted to customize the experience.

---

### **`initialQueue`**
- **Type**: `Function returning Promise`
- **Default**: `undefined`
- **Description**: Pass the first request in the queue as a prop to execute when pull-to-refresh is triggered. This function will be called automatically during the refresh action.

## Events

### **`reached`**
- **Type**: `Event`
- **Description**: This event is emitted when the pull-to-refresh gesture reaches the defined threshold and triggers the refresh action. It can be used to perform additional actions after the refresh process is completed.
```ts
(e: 'reached'): void:
```

### **`settled`**
- **Type**: `Event`
- **Description**: This event is emitted when the refresh animation is fully completed and the component has returned to its idle state. Useful for triggering actions that require the UI to be stable again.
```ts
(e: 'settled'): void:
```

### Example Usage:
```vue
<VuePullToRefresh
   @reached="handleRefresh"
   @settled="handleSettled"
/>
```

## Slots

### **`default`**
- **Description**: The default slot is used to insert the main content inside the `VueEasyPullRefresh` component. This is the content that will be refreshed when the pull-to-refresh gesture is triggered.

### **`loader`** (optional)
- **Description**: The loader slot allows you to customize the loading indicator that appears when the content is being refreshed. If no custom loader is provided, the default loader will be used.



