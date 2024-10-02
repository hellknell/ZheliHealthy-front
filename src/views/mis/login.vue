<script setup lang="ts">

import {getCurrentInstance, reactive} from 'vue'

const {proxy} = getCurrentInstance()
const loginForm = reactive({
  username: '',
  password: ''
})
const qr = reactive({
  qrCodeVisible: false,
  qrCode: null
})
</script>

<template>
  <!--  <div>This is Login</div>-->
  <!--  <div v-if="proxy.isAuth(['ROOT','APPOINTMENT:SELECT'])"></div>-->
  <div class="page">
    <div class="panel">
      <div class="left">
        <img src="../../assets/login/logo.png" alt="" class="logo">
        <img src="../../assets/login/big.png" alt="" class="big">
      </div>
      <div class="right">
        <div class="title-content">
          <h2>浙里健康体检系统</h2>
          <span>v1.0</span>
        </div>

        <div v-if="!qr.qrCodeVisible">
          <div class="row">
            <el-input v-model="loginForm.username" prefix-icon="user"
                      size="large" clearable placeholder="请输入用户名">
            </el-input>
          </div>
          <div class="row">
            <el-input type="password" v-model="loginForm.password" prefix-icon="Lock"
                      size="large" clearable placeholder="请输入密码">
            </el-input>
          </div>
          <div class="row">
            <el-button class="btn"  type="primary" style="width: 100%;" @click="login">登录
            </el-button>
          </div>
          <div class="row" ><a href="#" @click="qr.qrCodeVisible=true" class="link">二维码登录</a></div>
        </div>
        <div v-else>
          <div class="qrCode-container">
            <img :src="qr.qrCode" alt="" height="153" class="qrCode">
            <img src="../../assets/login/phone.png" alt="" height="148">
          </div>
          <div class="row"><a href="" class="link">用户密码登录</a></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
@import url("login");
</style>