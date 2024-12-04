<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive} from "vue";
import {Edit, UserFilled} from "@element-plus/icons-vue";
import customerService from "../../../api/customer";
import {ElMessage, UploadFile, UploadFiles} from "element-plus";
const {proxy} = getCurrentInstance();
const updateDialog = reactive({
  dataRules: {
    tel: [
      {
        required: false,
        pattern: "^1[1-9]\\d{9}$",
        message: '手机号格式错误'
      }
    ],
    name: [
      {
        required: false,
        pattern: "^[\\u4e00-\\u9fa5]{2,30}$",
        message: '姓名格式错误'
      }
    ]
  },
  upload: {
    action: `${proxy.$baseUrl}/front/customer/uploadImage`,
    headers: {
      token: localStorage.getItem("token")
    },
  },

  visible: false,
  tel: null,
  name: null,
  sex: null,
  photoUrl: null,
  photo: null
})
const data = reactive({
  photo: null,
  name: '',
  sex: '',
  tel: '',
  createTime: '',
  amount: 0,
  count: 4,
  number: 5
})
const loadSummary = () => {
  customerService.searchSummary(res => {
    if (res.code === 200) {
      data.number = res.result.number ? res.result.number : 0,
          data.count = res.result.count ? res.result.count : 0,
          data.amount = res.result.amount ? res.result.amount : 0,
          data.photo = `${proxy.$minioUrl}/his/${res.result.photo}`,
          data.name = res.result.name ? res.result.name : '未填写',
          data.sex = res.result.sex ? res.result.sex : '未填写',
          data.tel = res.result.tel,
          data.createTime = res.result.createTime
    }
  }, err => {

  })
}
const updateHandle = () => {
  updateDialog.visible = true
  proxy.$nextTick(() => {
    proxy.$refs['updateForm'].resetFields()
    updateDialog.tel = data.tel
    updateDialog.name = data.name === '未填写' ? null : data.name
    updateDialog.sex = data.sex === '未填写' ? null : data.sex
    updateDialog.photoUrl = data.photo
  })
  console.log(updateDialog.photoUrl)
}
const imageBeforeUpload = (file) => {
  let size = file.size / 1024 / 1024;
  if (size > 2) {
    ElMessage.error({
      message: '图片上传大小超过2M',
      duration: 1200
    })
    return false;
  }
  return true;
}
const imageUploadSuccess = (resp: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (resp.code === 200) {
    updateDialog.photo = resp.result;
    updateDialog.photoUrl = `${proxy.$minioUrl}/his/${resp.result}`
    ElMessage.success({
      message: "图片上传成功"
    })
  }
}
const imageBeforeUploadError = (e) => {
  ElMessage.error({
    message: "图片上传失败"
  });
  console.error(e)
}
onMounted(() => {
  loadSummary()
})
const submit = () => {
  proxy.$refs['updateForm'].validate(valid => {

    if (valid) {
      let json = {
        tel: updateDialog.tel,
        name: updateDialog.name,
        sex: updateDialog.sex,
        photo: updateDialog.photo
      }
      customerService.update(json, res => {
        updateDialog.visible = false
        if (res.rows) {
          ElMessage.success({
            message: '更新成功',
            onClose: () => {
              updateDialog.visible = false
              loadSummary()
            }
          })
        }
      }, err => {

      })

    } else {
      return false;
    }
  })

}
</script>

<template>
  <div class="summary-container">
    <el-card class="box-card" :shadow="never">
      <div class="info">
        <div class="left">
          <el-avatar :size="45" shape="square" :src="data.photo">
            <el-icon :size="25">
              <UserFilled/>
            </el-icon>
          </el-avatar>
        </div>
        <div class="right">
          <div class="base">
            <span>姓名:{{ data.name }}</span>
            <span>性别: {{ data.sex }}</span>
            <span>电话号码:{{ data.tel }}</span>
            <div class="operate" @click="updateHandle">
              <el-icon :size="18" class="icon">
                <Edit/>
              </el-icon>
              <div>修改资料</div>
            </div>
          </div>
          <p>注册时间:{{ data.createTime }}</p>
        </div>
      </div>
      <el-divider/>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="statistic-box">
            <el-statistic :value="data.amount" suffix="元">
              <template #title>
                <div class="title">累计消费金额</div>
              </template>
            </el-statistic>
          </div>
        </el-col>

        <el-col :span="5">
          <div class="statistic-box">
            <el-statistic :value="data.count" suffix="笔">
              <template #title>
                <div class="title">订单数量</div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="statistic-box">
            <el-statistic :value="data.number" suffix=个>
              <template #title>
                <div class="title">体检套餐数量</div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog width="350" v-model="updateDialog.visible" title="个人信息" align="center">
      <el-form ref="updateForm" :rules="updateDialog.dataRules" :model="updateDialog">
        <el-form-item prop="photo" align="center">
          <el-upload
              :action="updateDialog.upload.action"
              accept=".jpg,.png,.jpeg"
              :before-upload="imageBeforeUpload"
              :headers="updateDialog.upload.headers"
              :on-error="imageBeforeUploadError"
              :on-success="imageUploadSuccess"
              class="image-uploader"
          >
            <el-image v-if="updateDialog.photoUrl" :src="updateDialog.photoUrl" class="image"/>
            <el-icon v-else :size="25">
              <UserFilled/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="name">
          <el-input maxlength="20" v-model="updateDialog.name" clearable="clearable" placeholder="填写姓名"/>
        </el-form-item>
        <el-form-item prop="tel">
          <el-input maxlength="11" placeholder="填写手机号" v-model="updateDialog.tel" clearable="clearable"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="updateDialog.sex" placeholder="选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="footer">
          <el-button type="info" @click="updateDialog.visible=false">取消</el-button>
          <el-button class="update-btn" type="success" @click="submit">提交</el-button>
        </div>

      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="less">
@import "mine.less";
</style>