<script setup>
import {ref} from 'vue'
import {ArrowLeft} from "@element-plus/icons-vue";

defineProps({
  msg: Object
})
const count = ref(0)
</script>
<template>
  <div class="chat">
    <!--问题-->
    <div style="text-align: right;">
      <div class="el-card chat-right">
        {{ msg.question }}
      </div>
      <el-icon :size="20" class="icon">
        <arrow-left/>
      </el-icon>
    </div>
    <!--AI回答-->
    <div style="text-align: left;">
      <div class="el-card chat-left">
        {{ msg.answer }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat {
  max-width: 95%;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.ai-img {
  height: 36px;
  width: 36px;
}

.chat-left {
  background-color: #f5f6f7 !important;
  display: inline-block;
  box-sizing: border-box;
  width: auto;
  text-align: left;
  border-radius: 12px;
  line-height: 24px;
  max-width: 100%;
  padding: 12px 16px;
  white-space: pre-wrap;

}

.chat-right {
  background-color: #e0dfff;
  display: inline-block;
  box-sizing: border-box;
  width: auto;
  color: #3f3f3f;
  border-radius: 12px;
  line-height: 24px;
  max-width: 100%;
  padding: 12px 16px;
  white-space: pre-wrap;
}

.icon {
  position: relative;
  margin-left: 7px;
  top: -15px;
}
</style>
