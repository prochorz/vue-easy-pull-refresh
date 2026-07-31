# **Concepts**

In this section, we will dive into the core concepts and features of `VueEasyPullRefresh` and `useEasyPullRefresh`. Understanding these concepts will help you use the library more effectively and customize it to fit your needs.

## **Key Concepts**

### 1. **`VueEasyPullRefresh` Component**

`VueEasyPullRefresh` is the main component that enables the pull-to-refresh functionality. It is designed to wrap the content you want to refresh, and it listens for the user's pull-to-refresh gesture (usually a downward swipe). When the user performs the gesture, the component triggers the refresh process.

#### **How it Works:**

- When the user pulls down the content, the component listens for touch/mouse events and moves the content with the gesture.
- It emits three lifecycle events — `started` (gesture begins), `reached` (threshold hit during the drag), and `settled` (animation finished, idle again).
- It can be customized with various props and slots to match the design and functionality of your application.

### 2. **`useEasyPullRefresh` Function**

The `useEasyPullRefresh` function is a composition API helper for registering async tasks on the refresh queue. Call it inside **descendant** components of `<VueEasyPullRefresh>` — the composable picks up the queue via Vue's provide/inject.

#### **How it Works:**

- **`pullDownQueueAdd`**: Adds an async callback to the refresh queue. Callbacks registered in child components are automatically removed when that component unmounts.
- For a single task in the parent component, prefer the [`initialQueue`](/component#initialqueue) prop instead of the composable.

::: warning Deprecated
The **`refRefresh`** template ref and calling `pullDownQueueAdd` in the same component as `<VueEasyPullRefresh>` are deprecated since v1.1.0. Use [`initialQueue`](/component#initialqueue) or register tasks from child components. See [Usage → Deprecated](/usage#deprecated-ref-based-controlled-refresh).
:::

### 3. **Queue System**

One of the powerful features of `useEasyPullRefresh` is the ability to queue multiple asynchronous tasks during the pull-to-refresh process. All tasks run **in parallel**; the loader stays visible until the slowest one resolves.

#### **How it Works:**

- When the pull-to-refresh gesture is triggered, every callback in the queue is started at once.
- The refresh does not finish until all tasks have resolved (or the minimum loader animation has elapsed).
- If a task rejects, the error is swallowed so the UI still resets to its idle state.

### 4. **Content refresh modes**

The component supports two ways to update content after a pull:

- **Re-mount (default)**: With `isRefreshContent` set to `true`, the default slot is re-keyed on each refresh so child components re-mount. Pair with `isAppearAnimation` and `isFreezeContent` to control the transition timing.
- **In-place update**: With `isRefreshContent` set to `false`, the slot stays mounted and you update data yourself via `initialQueue` or `pullDownQueueAdd` in descendants.

## **Refresh Process Overview**

1. **User Interaction**: The user performs a pull-to-refresh gesture (downward swipe or mouse drag).
2. **`started`**: The component detects movement and emits `started`.
3. **`reached`**: When the drag hits `pullDownThreshold`, `reached` is emitted (still during the gesture).
4. **Task Queue Execution**: On release past the threshold, the refresh starts and all queued callbacks run in parallel.
5. **`settled`**: After every task finishes and the loader animation completes, `settled` is emitted and the component returns to idle.

## **Conclusion**

The main concepts of `VueEasyPullRefresh` revolve around simplifying pull-to-refresh while keeping flexibility in how refresh tasks are registered — a single `initialQueue` prop for simple cases, or `pullDownQueueAdd` from any descendant for more complex trees.

By understanding the core concepts, you can easily integrate and customize the pull-to-refresh experience in your project.
