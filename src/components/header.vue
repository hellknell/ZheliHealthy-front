<template>
  <header class="header1">
    <div class="logo-content" @click="router.push({name:'FrontIndex'})">
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
            <el-button @click="searchGoodsListBykeyword" type="primary">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div style="display: flex">
        <el-tag effect="light" @click="tagHandle(item.label)" round class="tag" v-for="item in tags" :key="item.label"
                :type="item.type">
          {{ item.label }}
        </el-tag>
      </div>
    </div>
    <div class="log-in-out">
      <el-button v-if="dialog.status==='logout'" type="success" size="large" @click="showDialog">
        登录/注册
      </el-button>
      <div class="btn" v-if="dialog.status==='login'" @click="$router.push({name:'FrontMine'})">
        <el-icon>
          <User/>
        </el-icon>
        <span>个人中心</span>
      </div>
      <div class="btn" v-if="dialog.status==='login'" @click="logout">
        <el-icon>
          <SwitchButton/>
        </el-icon>
        <span>退出系统</span>
      </div>
    </div>
    <el-dialog width="400" title="手机快速登录" v-model="dialog.visible" class="dialog">
      <el-row>
        <el-col :span="24">
          <el-input size="large" placeholder="输入手机号" maxlength="11" v-model="dialog.tel" clearable="clearable">
            <template #prepend>
              <el-icon>
                <Iphone/>
              </el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-input size="large" placeholder="输入验证码" maxlength="6" v-model="dialog.code" clearable="clearable">
            <template #prepend>
              <el-icon>
                <Message/>
              </el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button class="receive-btn" plain @click="sendSmsCode" :disabled="dialog.disabled" type="primary"
                     size="large">{{
            dialog.btnContentText
            }}
          </el-button>
        </el-col>
      </el-row>
      <el-button style="width: 100%" class="lg-btn" size="large" type="success" @click="login">
        登录系统
      </el-button>

    </el-dialog>
  </header>

</template>
<script setup lang="ts">
import {useHeaderStore} from "../store/header";
import {storeToRefs} from "pinia";
import {Iphone, Message, SwitchButton, User} from "@element-plus/icons-vue";
import {getCurrentInstance, onMounted, reactive} from "vue";
import {isBlank, isMobile, isSmsCode} from "../utils/validate.ts";
import {ElMessage} from "element-plus";
import customerService from "../api/customer";
import router from "../router";


let {proxy} = getCurrentInstance()
let useHeaderStore1 = useHeaderStore();
const {keyword, tags} = storeToRefs(useHeaderStore1)
const dialog = reactive({
  status: 'logout',
  visible: false,
  tel: null,
  code: null,
  num: 0,
  btnContentText: '获取短信验证码',
  disabled: false
})
const showDialog = () => {
  dialog.visible = true
  dialog.tel = null
  dialog.code = null


}
const sendSmsCode = () => {
  if (isBlank(dialog.tel)) {
    ElMessage.error({
      message: '请填写手机号'
    })
  } else if (!isMobile(dialog.tel)) {
    ElMessage.error({
      message: '手机号格式错误'
    })
  } else {
    let json = {
      tel: dialog.tel
    }
    customerService.sendSmsCode(json, res => {
      if (res.result) {
        ElMessage.success({
          message: '验证码发送成功'
        })
        dialog.disabled = true
        const timer = setInterval(() => {
          dialog.btnContentText = `重新获取(${120 - dialog.num})`
          dialog.num++;
          if (120 === dialog.num) {
            clearInterval(timer)
            dialog.disabled = false
            dialog.btnContentText = '获取短信验证码'
          }
        }, 1000);
      }
    }, err => {

    })
  }
}
const login = () => {
  if (isBlank(dialog.tel)) {
    ElMessage.error({
      message: '请填写手机号'
    })
  } else if (!isMobile(dialog.tel)) {
    ElMessage.error({
      message: '手机号格式错误'
    })
  }
  if (isBlank(dialog.code)) {
    ElMessage.error({
      message: '请填写验证码'
    })
  } else if (!isSmsCode(dialog.code)) {
    ElMessage.error({
      message: '验证码格式错误'
    })
  } else {
    let json = {
      tel: dialog.tel,
      code: dialog.code
    }
    customerService.login(json, res => {
      if (res.code === 200) {
        ElMessage.success({
          message: '登录成功'
        })
        dialog.tel = null
        dialog.code = null
        dialog.visible = false
        dialog.status = 'login'
        localStorage.setItem("token", res.token)
      }
    }, err => {

    })
  }

}
const logout = () => {

  customerService.logout(res => {
        if (res.code === 200) {
          localStorage.removeItem("token")
          dialog.status = 'logout'
          router.push({name: 'FrontIndex'})
          ElMessage.success({
            message: '退出系统成功'
          })
        }
      }, err => {


      }
  )

}

onMounted(() => {
  let keyword1 = router.currentRoute.value.query.keyword
  keyword.value = keyword1
  let token = localStorage.getItem("token");
  if (token != null) {
    customerService.checkLogin(res => {
      if (res.result) {
        dialog.status = 'login'
      } else {
        dialog.status = 'logout'
      }
    }, err => {

    })
  }

})
const searchGoodsListBykeyword = () => {
  router.push({
    name: 'FrontGoodsList',
    query: {
      keyword: keyword.value,
      random: new Date().getTime()
    }
  })


}
const tagHandle = (label: string) => {
  keyword.value = label
}
</script>
<style lang="less" scoped>
@import url("header.less");
</style>