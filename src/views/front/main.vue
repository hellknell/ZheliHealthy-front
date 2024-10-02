<script setup lang="ts">
import router from "../../router";
import Header from "../../components/header.vue"
import Footer from "../../components/footer.vue"
</script>
<template>
  <div>
    <div class="container">
      <Header/>
      <router-view :key="router.currentRoute.value.query.random"/>
    </div>
    <Footer/>
  </div>
</template>

<style lang="less" scoped>
@import url("main");
</style>