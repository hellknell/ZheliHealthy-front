<template>
  <div>
    <el-form v-if="proxy.isAuth(['ROOT','RULE:SELECT'])" :inline="true" ref="form" :model="dataForm" label-width="80px"
             :rules="dataRules">
      <el-form-item prop="name">
        <el-input class="input" v-model="dataForm.name" maxlength="50" placeholder="规则名称"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="selectHandle()" type="primary">查询</el-button>
        <el-button :disabled="!proxy.isAuth(['ROOT','RULE:INSERT'])" @click="addHandle()" type="danger">新增规则
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data.dataList" border v-loading="data.loading">
      <el-table-column type="index" label="序号" min-width="80" header-align="center" align="center">
        <template #default="scope">
          <span>{{ (data.pageIndex - 1) * data.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="规则名称" min-width="150" vheader-align="center" align="center"/>
      <el-table-column prop="rule" label="规则" min-width="150" :show-overflow-tooltip="true" vheader-align="center"
                       align="center"/>
      <el-table-column prop="remark" label="备注信息" header-align="center" align="center" min-width="350"/>
      <el-table-column prop="count" label="关联套餐数量" header-align="center" align="center" min-width="80"/>
      <el-table-column header-align="center" label="操作" align="center" min-width="150">
        <template #default="scope">

          <el-button @click="updateHandle(scope.row)" v-if="proxy.isAuth('ROOT','RULE:UPDATE')" type="text">修改
          </el-button>
          <el-button @click="deleteHandle(scope.row.id)" :disabled="scope.row.count>0"
                     v-if="proxy.isAuth('ROOT','RULE:DELETE')" type="text">删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="data.pageIndex"
        :page-size="data.pageSize"
        :page-sizes="[10,20,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    <el-dialog :title="dataForm.id?'修改':'新增'" :close-on-click-modal="false" v-model="dialog.visible" align-center
               width="400px" custom-class="dialog"
    >
      <el-form ref="dialogForm" :model="dialog.dataForm" :rules="dialogRules" label-position="right" label-width="80px">
        <el-form-item prop="name" label="规则名称">
          <el-input v-model="dialog.dataForm.name" maxlength="20" placeholder="规则名称"/>
        </el-form-item>
        <el-form-item prop="rule" label="规则">
          <el-input v-model="dialog.dataForm.rule" type="textarea" :rows="5" placeholder="规则"/>
        </el-form-item>
        <el-form-item label="规则备注">
          <el-input v-model="dialog.dataForm.remark" type="textarea" :rows="3" placeholder="规则备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="dialog.visible=false">取消</el-button>
      <el-button type="warning" @click="dataSubmit">确定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>

</template>


<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive} from "vue";
import ruleService from "../../../../api/rule";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance()
const dataRules = reactive({
  name: [
    {
      pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$',
      required: false,
      message: '规则名称有误'
    }
  ]
})

const dataForm = reactive({
  id: null,
  name: null
})
const dialog = reactive({
  dataForm: {
    id: null,
    name: null,
    rule: null,
    remark: null
  },
  visible: false
})
const dialogRules = {

  name: [
    {
      required: true,
      message: '规则名称不能为空'
    },
    {
      pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$',
      message: '规则名称不正确'
    },

  ],
  rule: [{

    required: true,
    message: '规则不能为空'
  }]
}
const data = reactive({
  dataList: [],
  loading: false,
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0

})
onMounted(() => {
  loadRuleList()
})
const handleSizeChange = (val) => {
  page.pageIndex = val;
  loadRuleList()
}
const handleCurrentChange = (val) => {
  data.pageIndex = val
  data.pageIndex = 1
  loadRuleList()
}
const loadRuleList = () => {
  data.loading = true
  let json = {
    name: dataForm.name,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize
  }
  ruleService.searchRuleList(json, res => {
    data.loading = false
    if (res.code === 200) {
      let page = res.page
      data.dataList = page.list
      data.totalCount = page.totalCount
    }
  }, err => {

  })
}
const deleteHandle = (id) => {
  proxy.$confirm('确定要删除这条规则吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ruleService.deleteRule(id, res => {
      if (res.rows === 1) {
        ElMessage.error({
          message: '删除规则成功',
          onClose: () => {
            loadRuleList()
          }
        })
      }
    }, err => {

    })
  })
}
const updateHandle = (row) => {
  dialog.visible = true
  dialog.dataForm = JSON.parse(JSON.stringify(row))
}
const addHandle = () => {
  dialog.dataForm.id = null
  dialog.dataForm.remark = null
  dialog.visible = true
  proxy.$nextTick(() => {
    proxy.$refs['dialogForm'].resetFields()
  })
}

const selectHandle = () => {
  proxy.$refs['form'].validate(valid => {
    if (valid) {
      proxy.$refs['form'].clearValidate()
      if (data.pageIndex != 1) {
        data.pageIndex = 1
      }
      loadRuleList()
    } else {

      return false;
    }
  })
}
const dataSubmit = () => {
  let json = {
    id: dialog.dataForm.id,
    name: dialog.dataForm.name,
    rule: dialog.dataForm.rule,
    remark: dialog.dataForm.remark
  }
  ruleService.addRule(json, res => {
    if (res.rows === 1) {
      ElMessage.success({
        message: json.id ? '修改成功' : '添加成功',
        onClose: () => {
          dialog.visible = false
          loadRuleList()
        }
      })

    }
  }, err => {

  })
}
</script>

<style scoped lang="less">
@import "rule.less";
</style>