<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive} from 'vue'
import {Delete, Search} from "@element-plus/icons-vue";
import {dayjs, ElMessage} from "element-plus"
import isBetween from 'dayjs/plugin/isBetween'
import appointmentService from "../../../../api/appointment";

const {proxy} = getCurrentInstance();
dayjs.extend(isBetween);

const data = reactive({
  dataList: [],
  loading: false,
  pageSize: null,
  pageIndex: null,
  totalCount: 0,
  selections: []
})
const dataForm = reactive({
  name: null,
  teL: null,
  date: null,
  statusLabel: '全部',
  status: null
})
const searchHandle = () => {
  loadAppointment()
}
const selectChangeHanle = (val) => {
  data.selections = val
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

function loadAppointment() {
  data.loading = true
  if (dataForm.statusLabel === '全部') {
    dataForm.status = null
  } else if (dataForm.statusLabel === '未签到') {
    dataForm.status = 1
  } else if (dataForm.statusLabel === '已签到') {
    dataForm.status = 2
  } else if (dataForm.statusLabel === '已结束') {
    dataForm.status = 3
  } else if (dataForm.statusLabel === '已关闭') {
    dataForm.status = 4
  }

  let json = {
    name: dataForm.name,
    date: dataForm.date,
    tel: dataForm.teL,
    status: dataForm.status,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize
  }
  appointmentService.searchFrontByPageForMis(json, res => {
    data.loading = false
    let statusEnum = {
      "1": '未签到',
      "2": '已签到',
      "3": '已结束',
      "4": '已关闭'
    }
    if (res.code === 200) {
      let page = res.page;
      const list = page.list;
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

const selectableHandle = (row, index) => {
  if (row.status === '未签到') {
    return false;
  } else {
    return true;
  }

}
const deleteHandle = (id) => {
  let ids = id == null ? data.selections.map(item => item.id) : [id]
  if (ids.length == 0) {
    proxy.$message({
      type: 'warning',
      message: '没有选中记录'
    })
  } else {
    let json = {
      ids: ids
    }
    proxy.$confirm('确定要删除该条预约记录吗?', '提示信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }).then(() => {
      appointmentService.delete(json, res => {
        if (res.rows > 0) {
          ElMessage.success(
              {
                message: '删除成功',
                onClose: () => {
                  loadAppointment()
                }
              })
        } else {
          ElMessage.error(
              {
                message: '删除异常',
              })
        }
      })
    })
  }

}
onMounted(() => {

  loadAppointment()
})
</script>

<template>
  <el-form :inline="true" v-if="proxy.isAuth(['ROOT','APPOINTMENT:SELECT'])" ref="form" :model="dataForm">
    <el-form-item>
      <el-date-picker type="date" v-model="dataForm.date" value-format="YYYY-MM-DD" :editable="false"
                      placeholder="选择日期" format="YYYY-MM-DD"/>
    </el-form-item>
    <el-form-item>
      <el-input v-model="dataForm.name" placeholder="体检人" maxlength="10" clearable/>
    </el-form-item>
    <el-form-item>
      <el-input v-model="dataForm.teL" placeholder="电话号码" maxlength="11" clearable/>
    </el-form-item>
    <el-form-item class="operate">
      <el-button type="primary" @click="searchHandle" :icon="Search" :autofocus="true">
        查询
      </el-button>
      <el-button @click="deleteHandle" type="danger
     " :icon="Delete">
        批量删除
      </el-button>
    </el-form-item>
    <el-form-item class="mold">
      <el-radio-group @change="searchHandle" v-model="dataForm.statusLabel">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="未签到"></el-radio-button>
        <el-radio-button label="已签到"></el-radio-button>
        <el-radio-button label="已结束"></el-radio-button>
        <el-radio-button label="已关闭"></el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>

  <el-table v-loading="data.loading" v-show="!empty" border
            :data="data.dataList" :header-cell-style="{'background-color':'#f6f6f6'}"
            @selection-change="selectChangeHanle()">
    <el-table-column type="selection" header-align="center" align="center" :selectable="selectableHandle"/>
    <el-table-column type="index" label="序号" fixe width="70" header-align="center" align="center">
      <template #default="scope">
        <span>{{ (data.pageIndex - 1) * data.pageSize + scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" min-width="120" label="体检人"
                     prop="name"/>
    <el-table-column header-align="center" align="center" label="性别" min-width="120"
                     prop="sex"/>
    <el-table-column header-align="center" align="center" label="年龄" min-width="120"
                     prop="age"/>
    <el-table-column header-align="center" align="center" label="联系电话" min-width="120"
                     prop="tel"/>
    <el-table-column header-align="center" align="center" label="身份证号" min-width="120"
                     prop="pid"/>
    <el-table-column header-align="center" align="center" label="公司名称" min-width="120"
                     prop="company"/>
    <el-table-column header-align="center" min-width="200" align="center" label="体检套餐" prop="goodsTitle"/>
    <el-table-column header-align="center" min-width="200" align="center" label="状态" prop="status"/>
    <el-table-column fixed="right" header-align="center" align="center" label="操作" min-width="100">
      <template #default="scope">
        <el-button type="text" :disabled="!proxy.isAuth(['ROOT','APPOINTMENT:DELETE'])"
                   @click="deleteHandle(scope.row.id)">删除
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
</template>
<style scoped lang="less">
@import "appointment.less";
</style>