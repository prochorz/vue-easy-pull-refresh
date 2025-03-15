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

### **`isControled`**
- **Type**: `Boolean`
- **Default**: `false`
- **Description**: Enables or disables controlled behavior of the component. When enabled, you have full control over the refresh process using custom APIs (e.g., via `useEasyPullRefresh`). This allows you to manually manage the refresh flow.

---

### **`isAppearAnimation`**
- **Type**: `Boolean`
- **Default**: `true`
- **Description**: Enables or disables the fade-in animation of the content. This prop is only applicable when `isControled` is set to `false`.

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

## Events

### **`reached`**
- **Type**: `Event`
- **Description**: This event is emitted when the pull-to-refresh gesture reaches the defined threshold and triggers the refresh action. It can be used to perform additional actions after the refresh process is completed.
```ts
(e: 'reached'): void:
```

### Example Usage:
```vue
<VuePullToRefresh @reached="handleRefresh" />
```

## Slots

### **`default`**
- **Description**: The default slot is used to insert the main content inside the `VueEasyPullRefresh` component. This is the content that will be refreshed when the pull-to-refresh gesture is triggered.

### **`loader`** (optional)
- **Description**: The loader slot allows you to customize the loading indicator that appears when the content is being refreshed. If no custom loader is provided, the default loader will be used.



