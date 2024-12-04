<template>
  <div>
    <el-form ref="form" :model="dataForm" :inline="true">
      <el-form-item class="keyword">
        <el-input placeholder="套餐名称 / 姓名 /电话" v-model="dataForm.keyword" clearable/>
      </el-form-item>
      <el-form-item class="date">
        <el-date-picker placeholder="请选择日期" :editable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                        type="date" v-model="dataForm.date"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="searchHandle">查询</el-button>
      </el-form-item>
      <el-form-item class="mold">
        <el-radio-group v-model="dataForm.statusLabel" @change="searchHandle(dataForm.statusLabel)">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="已结束"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table class="appointment-table" :data="data.dataList" v-loading="data.loading" v-show="!empty" border
                :header-cell-style="{'background-color':'#faf5f5'}">
        <el-table-column type="index" label="序号" fixe width="70" header-align="center" align="center">
          <template #default="scope">
            <span>{{ (data.pageIndex - 1) * data.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column header-align="center" min-width="100" align="center" label="套餐名称" prop="goodsTitle"/>
        <el-table-column header-align="center" align="center" min-width="120" label="体检人"
                         prop="name"/>
        <el-table-column header-align="center" align="center" label="预约日期" min-width="120"
                         prop="date"/>
        <el-table-column header-align="center" align="center" label="状态" min-width="120"
                         prop="status"/>
        <el-table-column fixed="right" header-align="center" align="center" label="操作" min-width="100">
          <template #default="scope">
            <el-button type="text" :disabled="scope.row.filePath==null"
                       @click="appointmentHandle(scope.row.name,scope.row.filePath)">预约报告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="data.pageIndex"
          :page-size="data.pageSize"
          :page-sizes="[5,10,20,50]"
          :total="data.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
      <div v-show="empty" class="empty">
        <el-empty :image-size="200"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {dayjs} from "element-plus"
import isBetween from 'dayjs/plugin/isBetween'
import appointmentService from "../../../api/appointment";

dayjs.extend(isBetween);
const data = reactive({
  dataList: [],
  pageIndex: 1,
  pageSize: 10,
  loading: false,
  totalCount: 0
})
const empty = ref(false)
const dataForm = reactive({
  keyword: null,
  date: null,
  status: null,
  statusLabel: '全部'
})
const appointmentHandle = (name, filePath) => {

}
const searchHandle = () => {
  loadAppointment()
}
const handleCurrentChange = (val) => {
  data.pageIndex = val
  loadAppointment()
}
const handleSizeChange = (val) => {
  data.pageIndex = 1
  data.pageSize = val;
  loadAppointment()
}
const loadAppointment = () => {
  data.loading = true
  if (dataForm.statusLabel === '全部') {
    dataForm.status = null
  } else {
    dataForm.status = 3
  }
  let json = {
    keyword: dataForm.keyword,
    date: dataForm.date,
    status: dataForm.status,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize
  }
  appointmentService.searchFrontByPage(json, res => {
    data.loading = false
    if (res.code === 200) {
      let statusEnum = {
        "1": '未签到',
        "2": '已签到',
        "3": '已结束',
        "4": '已关闭'
      }
      let page = res.page;
      let list = page.list;
      for (let one of list) {
        one.status = statusEnum[one.status + ""]
      }
      data.dataList = list
      data.totalCount = page.total
      empty.value = page.list == null ? true : false
    }
  }, err => {
  })
}
onMounted((() => {
  loadAppointment()
}))
</script>

<style scoped lang="less">
@import "appointment.less";
</style>