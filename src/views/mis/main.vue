<template>
  <div class="site-wrapper"
       :class="{'site-sidebar--fold':sidebar.sidebarFold}"
       v-loading.fullsrceen.lock="loading" element-loading-text="拼命加载中..."
  >
    <nav class="site-navbar"
         :class="{'site-navbar--fold':sidebar.sidebarFold}"
    >
      <div class="site-navbar__header">
        <h1 class="site-navbar__brand">
          <a href="" class="site-navbar__brand-lg">浙里健康</a>
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
    <aside class="site-sidebar site-sidebar--dark-popper " :class="{'site-sidebar--fold':sidebar.sidebarFold}">
      <div class="site-sidebar__inner">
        <el-menu
            :default-active="menuActiveName || 'Home'"
            class="site-sidebar__menu"
            :collapse="sidebar.sidebarFold"
            :collapse-transition="false"
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
            <el-menu-item index="MisAppointment"
                          v-if="proxy.isAuth(['ROOT', 'APPOINTMENT:SELECT'])"
                          @click="$router.push({ name: 'MisAppointment' })">
              <el-icon>
                <SvgIcon name="appointment_fill"
                         class="icon-svg"/>
              </el-icon>
              <span slot="title">体检预约</span>
            </el-menu-item>
            <el-menu-item index="MisCustomerCheckin"
                          v-if="proxy.isAuth(['ROOT', 'CUSTOMER_CHICKIN:SELECT'])"
                          @click="$router.push({ name: 'MisCustomerCheckin' })">
              <el-icon>
                <SvgIcon name="checkin_fill" class="icon-svg"/>
              </el-icon>
              <span slot="title">体检签到</span>
            </el-menu-item>
            <el-menu-item index="MisAppointmentRestriction"
                          v-if="proxy.isAuth(['ROOT', 'APPOINTMENT_RESTRICTION:SELECT'])"
                          @click="$router.push({ name: 'MisAppointmentRestriction' })">
              <el-icon>
                <SvgIcon name="setting_fill" class="icon-svg"/>
              </el-icon>
              <span slot="title">预约设置</span>
            </el-menu-item>
            <el-menu-item index="MisCheckup"
                          v-if="proxy.isAuth(['ROOT', 'CHECKUP:SELECT'])"
                          @click="$router.push({ name: 'MisCheckup' })">
              <el-icon>
                <SvgIcon name="doctor_fill" class="icon-svg"/>
              </el-icon>
              <span slot="title">医生检查</span>
            </el-menu-item>
            <el-menu-item index="MisCheckupReport"
                          v-if="proxy.isAuth(['ROOT', 'CHECKUP_REPORT:SELECT'])"
                          @click="$router.push({ name: 'MisCheckupReport' })">
              <el-icon>
                <SvgIcon name="file_fill" class="icon-svg"/>
              </el-icon>
              <span slot="title">体检报告</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="系统设置">
            <template #title>
              <SvgIcon name="system" class="icon-svg"></SvgIcon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="MisFlowRegulation"
                          v-if="proxy.isAuth(['ROOT', 'FLOW_REGULATION:SELECT'])"
                          @click="$router.push({ name: 'MisFlowRegulation' })">
              <el-icon>
                <SvgIcon name="people_fill" class="icon-svg"/>
              </el-icon>
              <span slot="title">人员限流</span>
            </el-menu-item>

          </el-sub-menu>


        </el-menu>
      </div>

    </aside>
    <div class="site-content__wrapper">
      <main class="site-content">
        <el-tabs
            @tab-click="selectTab"
            @tab-remove="removeTab"
            v-model="mainTabActiveName"
            closable
            v-if="$route.meta.isTab"
        >
          <el-tab-pane v-for="item in mainTabs" :label="item.title" :name="item.name">
            <el-card :body-style="siteContentViewHeight">
              <router-view key="router.currentRoute.value.query.random"/>
            </el-card>
          </el-tab-pane>

        </el-tabs>
        <el-card :body-style="siteContentViewHeight" v-else>
          <router-view key="router.currentRoute.value.query.random"/>
        </el-card>

      </main>
    </div>
  </div>


</template>
<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import SvgIcon from "../../components/SvgIcon.vue";
import {useUserStore} from "../../store/user";
import {storeToRefs} from "pinia";
import {UserFilled} from "@element-plus/icons-vue";
import {useSiteContentStore} from "../../store/siteContent"

let router = useRouter()
let route = useRoute()
let SiteContentStore = useSiteContentStore()
let {proxy} = getCurrentInstance()
let userStore = useUserStore()
let {username, avatar, updatePasswordVisible} = storeToRefs(userStore)
let {
  documentClientHeight,
  siteContentViewHeight,
  mainTabs,
  height,
  mainTabActiveName,
  menuActiveName,
} = storeToRefs(SiteContentStore)
let siteContentStore = useSiteContentStore();
siteContentStore.resetDocumentClientHeight()
const sidebar = reactive({
  sidebarFold: true,
  sidebarLayoutSkin: 'dark'
})

const selectTab = (tab) => {
  router.push({
    name: tab.paneName
  })

}
const removeTab = (name) => {
  siteContentStore.removeTab(name)
}
const loading = ref(false)

const handleSwitch = () => {
  sidebar.sidebarFold = !sidebar.sidebarFold
}
const logout = () => {

}
const updatePassword = () => {

}
window.onresize = () => {
  siteContentStore.resetDocumentClientHeight();
  siteContentStore.loadSiteContentClientHeight(route)
}
onMounted(() => SiteContentStore.routeHandle(route))
watch(() => router, () => {
  SiteContentStore.routeHandle(route)
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="sass" scoped>
@import url("../../assets/scss/index.scss")
</style>