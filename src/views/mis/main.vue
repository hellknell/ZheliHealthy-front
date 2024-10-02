<template>
  <div class="site-wrapper"
       :class="{'site-wrapper--fold':sidebar.sidebarFold}"
       v-loading.fullsrceen.lock="loading" element-loading-text="拼命加载中..."
  >
    <nav class="site-navbar"
         :class="{'site-navbar--fold':sidebar.sidebarFold}"
    >

      <div class="site-navbar__header">
        <h1 class="site-navbar__brand">
          <a href="" class="site-navbar__brand-lg">神州大健康</a>
          <a href="" class="site-navbar__brand-mini">
            体检
          </a>
        </h1>
      </div>

      <div class="navbar-container" :class="{'navbar-container--fold':sidebar.sidebarFold}">
        <div class="site-navbar__switch" @click="handleSwitch">
          <SvgIcon name="zhedie" class="icon-svg"></SvgIcon>
        </div>
        <div class="right-container">
          <el-dropdown>
    <span class="el-dropdown-link">
        <span class="avatar-container">
          <el-avatar :src="avatar" shape="circle" size="25" :icon="UserFilled">
          </el-avatar>
        </span>
      <!--      {{ // username }}-->
      超级管理员
    </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

      </div>

    </nav>
    <aside class="site-sidebar site-sidebar--dark-popper">
      <div class="site-sidebar__inner">
        <el-menu
            :default-active="siteContent.menuActiveName || 'Home'"
            class="site-sidebar__menu"
            :collapse="sidebar.sidebarFold"

            background-color="#263238"
            text-color="#8a979e"
            active-text-color="#fff"
        >
          <el-menu-item index="Home"
                        @click="$router.push({name:'MisHome'})"
          >
            <SvgIcon name="home" class="icon-svg"/>
            <span slot="title">首页</span>
          </el-menu-item>
          <!--======================================================-->

          <el-sub-menu index="组织管理"
                       :popper-class="'site-sidebar--'+sidebar.sidebarLayoutSkin+ '-popper'">
            <template #title>
              <SvgIcon name="user_fill" class="icon-svg"/>
              <span slot="title">组织管理</span>
            </template>
            <el-menu-item index="部门管理"
                          @click="$router.push({name:'MisDept'})"
                          v-if="proxy.isAuth(['ROOT','DEPT:SELECT'])"

            >
              <SvgIcon name="company_fill" class="icon-svg"/>
              <span slot="title">部门管理</span>
            </el-menu-item>
            <el-menu-item index="角色管理"
                          @click="$router.push({name:'MisRole'})"
                          v-if="proxy.isAuth(['ROOT','ROLE:SELECT'])"

            >
              <SvgIcon name="role_fill" class="icon-svg"/>
              <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item index="用户管理"
                          @click="$router.push({name:'MisUser'})"
                          v-if="proxy.isAuth(['ROOT','USER:SELECT'])"

            >
              <SvgIcon name="users_fill" class="icon-svg"/>
              <span slot="title">用户管理</span>
            </el-menu-item>
          </el-sub-menu>


          <el-sub-menu index="业务管理"
                       :popper-class="'site-sidebar--'+sidebar.sidebarLayoutSkin+ '-popper'">
            <template #title>
              <SvgIcon name="trust_fill" class="icon-svg"/>
              <span slot="title">业务管理</span>
            </template>
            <el-menu-item index="体验套餐"
                          @click="$router.push({name:'MisGoods'})"
                          v-if="proxy.isAuth(['ROOT','GOODS:SELECT'])"
            >
              <SvgIcon name="goods_fill" class="icon-svg"/>
              <span slot="title">体验套餐</span>
            </el-menu-item>
            <el-menu-item index="促销规则"
                          @click="$router.push({name:'MisRule'})"
                          v-if="proxy.isAuth(['ROOT','RULE:SELECT'])"

            >
              <SvgIcon name="rule_fill" class="icon-svg"/>
              <span slot="title">促销规则</span>
            </el-menu-item>

            <el-menu-item index="客户档案"
                          @click="$router.push({name:'MisCustomer'})"
                          v-if="proxy.isAuth(['ROOT','CUSTOMER:SELECT'])"

            >
              <SvgIcon name="customer_fill" class="icon-svg"/>
              <span slot="title">客户档案</span>
            </el-menu-item>

            <el-menu-item index="订单管理"
                          @click="$router.push({name:'MisOrder'})"
                          v-if="proxy.isAuth(['ROOT','ORDER:SELECT'])"
            >
              <SvgIcon name="order_fill" class="icon-svg"/>
              <span slot="title">订单管理</span>
            </el-menu-item>
            <el-menu-item index="在线客服"
                          @click="$router.push({name:'MisIm'})"
                          v-if="proxy.isAuth(['ROOT','IM:SELECT'])"
            >
              <SvgIcon name="im_fill" class="icon-svg"/>
              <span slot="title">在线客服</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="体检管理">
            <template #title>
              <SvgIcon name="system" class="icon-svg"></SvgIcon>
              <span>体检管理</span>
            </template>
          </el-sub-menu>

          <el-sub-menu index="系统设置">
            <template #title>
              <SvgIcon name="system" class="icon-svg"></SvgIcon>
              <span>系统设置</span>
            </template>
          </el-sub-menu>
        </el-menu>
      </div>

    </aside>
  </div>


  <router-view/>
</template>
<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import SvgIcon from "../../components/SvgIcon.vue";
import {useUserStore} from "../../store/user";
import {storeToRefs} from "pinia";
import {UserFilled} from "@element-plus/icons-vue";

let router = useRouter()
let route = useRoute()
let {proxy} = getCurrentInstance()
let userStore = useUserStore()
let {username, avatar, updatePasswordVisible} = storeToRefs(userStore)
const sidebar = reactive({
  sidebarFold: false,
  sidebarLayoutSkin: 'dark'

})
const loading = ref(false)
const siteContent = reactive({

  documentClientHeight: 0,
  siteContentViewHeight: {},
  mainTabs: [],
  height: null,
  mainTabActiveName: '',
  menuActiveName: ''
})
const handleSwitch = () => {

}
const logout = () => {

}
const updatePassword = () => {

}
</script>
<style lang="sass" scoped>
@import url("../../assets/scss/index.scss")
</style>