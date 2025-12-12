<template>
  <div class="h-100 d-flex align-center justify-space-between text-medium-emphasis">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      By <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >IMPACT Lab</a>

    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href=""
        target="noopener noreferrer"
      >License</a>

      <a
        href=""
        target="noopener noreferrer"
      >Documentation</a>
      <a
        href=""
        target="noopener noreferrer"
      >Support</a>
    </span>
  </div>
</template>
