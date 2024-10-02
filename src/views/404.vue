<template>
  <div class="content-wrapper">
    <p class="title">唉呀,你访问的页面不存在</p>
  </div>
</template>

<script setup lang="ts">

</script>
<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  height: 100vh;
  text-align: center;
  background-image: url("../assets/404.jpg");
  background-size: cover;
  background-position: center;

  .title {
    margin-top: 0;
    font-size: 30px;
    padding-top: 20px;
    font-family: Helvetica;

    background: linear-gradient(to right, #ab1818 33%, #102f6a 50%, #1bef1e);
    background-position: 0%;
    background-size: 150%;
    font-weight: bold;
    text-shadow: 4px 5px 5px #787373;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 5s infinite ease-in-out;
  }
}

@keyframes gradient {
  0% {
    background-position: 0%;
  }
  25% {
    background-position: 50%;
  }
  50% {
    background-position: 100%;
  }
  75% {
    background-position: 50%;
  }

  100% {
    background-position: 0%
  }
}
</style>