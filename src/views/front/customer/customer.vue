<template>
  <div class="customer-container">
    <el-menu class="menu" :default-active="active" @select="selectHandle">
      <el-menu-item index="FrontMine">
        <el-icon>
          <User/>
        </el-icon>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="FrontOrder">
        <el-icon>
          <Tickets/>
        </el-icon>
        <span>订单查询</span>
      </el-menu-item>
      <el-menu-item index="FrontAppointment">
        <el-icon>
          <Files/>
        </el-icon>
        <span>体检预约</span>
      </el-menu-item>
      <el-menu-item index="FrontIM">
        <el-icon>
          <Collection/>
        </el-icon>
        <span>客服咨询</span>
      </el-menu-item>
    </el-menu>
    <div class="content">
      <router-view :key="router.currentRoute.value.query.random"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Collection, Files} from "@element-plus/icons-vue";
import router from "../../../router";
import {ref} from "vue";

let name = router.currentRoute.value.name
const active = ref(name)
const selectHandle = (index) => {
  active.value = index
  router.push({name: index})
}

</script>

<style scoped lang="less">
@import "customer.less";
</style>