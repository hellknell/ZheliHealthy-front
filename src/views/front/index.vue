<template>
  <div style="margin: 0 auto;width: 100%;height: auto;text-align: center">
    <div>This is index</div>
    <p>
      <label>{{ msg }}</label>
      <div>
        <el-button type="primary" @click="flag=!flag">切换</el-button>
      </div>
    </p>

  </div>


</template>
<script setup lang="ts">
import {ref, Ref, watch} from 'vue'

let msg: Ref<string> = ref("Hello")
let flag: Ref<boolean> = ref(false)
watch(() => flag.value, () => {
  if (flag.value) {
    msg.value = "Hello World!"
  } else {
    msg.value = "你好,世界"
  }
}, {
  immediate: true
})
</script>

<style scoped>

</style>