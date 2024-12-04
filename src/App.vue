<script setup lang="ts">
</script>
<template>
  <router-view v-slot="{ Component, route }">
    <Transition name="slide-fade">
      <component :is="Component" :key="route.path"/>
    </Transition>
  </router-view>
</template>
<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
