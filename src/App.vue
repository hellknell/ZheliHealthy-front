<script setup lang="ts">
</script>
<template>
  <router-view />
</template>
<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,

.slide-fade-leave-to {
  opacity: 0;
}
</style>
