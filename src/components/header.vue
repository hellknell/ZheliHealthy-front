<script setup lang="ts">
import {useHeaderStore} from "../store/header";
import {storeToRefs} from "pinia";

let useHeaderStore1 = useHeaderStore();
let {keyword, tags} = storeToRefs(useHeaderStore1)

</script>
<template>
  <header class="header1">
    <div class="logo-content">
      <img src="../assets/front/index/logo.png" class="logo" alt="">
      <div>

        <h2>浙里健康</h2>
        <p>www.zhelihealthy.com</p>
      </div>
    </div>

    <div class="search-content">
      <div style="width: inherit">

        <el-input
            v-model="keyword"
            size="large"
            maxlength="50"
            clearable
            placeholder="请输入套餐名或编号"
            class="keyword-input"
        >
          <template #append>
            <el-button @click="useHeaderStore1.addTags" type="primary">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div>
        <el-tag closable effect="light" class="tag" v-for="item in tags" :key="item.label"
                :type="item.type">
          {{ item.label }}
        </el-tag>
      </div>
    </div>
    <div class="log-in-out">
      <el-button type="success" size="large">登录/注册</el-button>
    </div>
  </header>

</template>

<style lang="less" scoped>
@import url("header.less");
</style>