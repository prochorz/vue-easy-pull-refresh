---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "VueEasyPullRefresh"
  tagline: Vue3 Easy Pull to Refresh plugin
  actions:
    - theme: brand
      text: Get Started
      link: /setup
    - theme: alt
      text: Examples
      link: /usage

features:
  - title: Simple Integration
    details: Easily integrate pull-to-refresh functionality in your Vue 3 application with minimal setup and customization.
  - title: Remount or In-Place Refresh
    details: Re-mount children on each pull via `isRefreshContent`, or keep them mounted and update data yourself through the queue.
  - title: Queue Async Tasks
    details: Queue multiple asynchronous tasks from anywhere in the tree — they run in parallel and the loader waits for the slowest one to finish.

---

