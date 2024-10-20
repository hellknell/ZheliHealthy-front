<template>
  <div v-if="proxy.isAuth(['ROOT','GOODS:SELECT'])">
    <el-form :inline="true" :model="dataForm" :rules="dataRules" ref="form">
      <el-form-item prop="keyword">
        <el-input maxlength="50" clearable="clearable" v-model="dataForm.keyword" placeholder="套餐名称">
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input maxlength="50" class="input" clearable="clearable" v-model="dataForm.code" placeholder="套餐编号">
        </el-input>
      </el-form-item>

      <el-form-item prop="type">
        <el-select class="input" clearable="clearable" v-model="dataForm.type" placeholder="套餐类型">
          <el-option label="父母体检" value="父母体检"></el-option>
          <el-option label="入职体检" value="入职体检"></el-option>
          <el-option label="入学体检" value="入学体检"></el-option>
          <el-option label="中青年体检" value="中青年体检"></el-option>
          <el-option label="个人高端" value="个人高端"></el-option>
          <el-option label="职场白领" value="职场白领"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="partId">
        <el-select class="input" clearable="clearable" v-model="dataForm.partId" placeholder="展示区">
          <el-option label="活动分区" value="1"></el-option>
          <el-option label="热卖套餐" value="2"></el-option>
          <el-option label="新品推荐" value="3"></el-option>
          <el-option label="孝敬父母" value="4"></el-option>
          <el-option label="白领精英" value="5"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchHandle()">
          查询
        </el-button>
        <el-button v-if="proxy.isAuth(['ROOT','GOODS:INSERT'])" type="primary" @click="addHandle()">
          新增
        </el-button>
        <el-button v-if="proxy.isAuth(['ROOT','GOODS:DELETE'])" type="danger" @click="searchHandle()">
          批量删除
        </el-button>
      </el-form-item>


      <el-form-item class="mold">

        <el-radio-group v-model="dataForm.statusLabel" @change="changeHandle()">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="已上架"></el-radio-button>
          <el-radio-button label="已下架"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.dataList" style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}"
              v-loading="tableData.loading"
              border
              @selection-change="selectChangeHandle">
      <el-table-column type="selection" width="55" :selectable="selectHandle"/>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="100">
        <template #default="scope">
          <span>{{ (page.pageIndex - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column header-align="center" align="center" prop="title" label="套餐名称" width="240"/>
      <el-table-column min-width="160" header-align="center" prop="code" align="center" label="套餐编号"/>
      <el-table-column min-width="80" header-align="center" align="center" label="现价">
        <template #default="scope">
          <span>￥{{ scope.row.currentPrice }}</span>
        </template>

      </el-table-column>
      <el-table-column min-width="80" header-align="center" align="center" label="原价">
        <template #default="scope">
          <span>￥{{ scope.row.initialPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100" header-align="center" align="center" prop="ruleName"
                       label="促销方案"/>
      <el-table-column min-width="100" header-align="center" align="center" prop="salesVolume" label="销量"/>

      <el-table-column min-width="100" header-align="center" align="center" prop="type" label="类型"/>
      <el-table-column min-width="100" header-align="center" align="center" label="体检内容">
        <template #default="scope">

      <span :class=
                "scope.row.hasCheckup?'link-blue':'link-red'"
            @click="documentHandle(scope.row.id,scope.row.hasCheckup)">
{{ scope.row.hasCheckup ? '有文档' : '无文档' }}
      </span>
        </template>
      </el-table-column>


      <el-table-column header-align="center" align="center" min-width="80" prop="status" label="状态">
        <template #default="scope">
          <el-switch inline-prompt v-model="scope.row.status"
                     style="--el-switch-on-color:#13ce66 ;--el-switch-off-color:#ff4949 "
                     active-text="上架" inactive-text="下架"
                     @change="chanegSwitchHandle(scope.row.id,scope.row.status)"
          >

          </el-switch>
        </template>
      </el-table-column>
      <el-table-column width="160" header-align="center" align="center" label="操作" min-width="155">
        <template #default="scope">
          <el-button
              type="text"
              @click="viewHandle(scope.row.id)"
          >
            预览
          </el-button>

          <el-button
              type="text"
              v-if="proxy.isAuth(['ROOT','GOODS:UPDATE'])"
              :disabled="scope.row.status"
              @click="updateGood(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
              v-if="proxy.isAuth(['ROOT','GOODS:DELETE'])"
              type="text"
              :disabled="scope.row.salesVolume>0 | scope.row.status"
              @click="deleteGood(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup lang="ts">
import {getCurrentInstance, reactive} from "vue";

let {proxy} = getCurrentInstance();

const dataForm = reactive({
  keyword: null,
  code: null,
  partId: null,
  status: null,
  statusLabel: '全部',
  type: null
})
const tableData = reactive({
  dataList: [],
  loading: false,
  selecions: []
})
const page = reactive({
  pageIndex: 1,
  pageSize: 10
})
const dataRules = reactive({
  keyword: [
    {
      pattern: "^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$",
      message: "关键词格内容不正确"
    }
  ],
  code: [

    {

      min: 6,
      message: "编号不能少于6个字符"
    },
    {
      pattern: "^[a-zA-Z0-9]{6,20}$",
      message: "关键词格内容不正确"
    }
  ]

})
const searchHandle = () => {

}
const addHandle = () => {

}
const deletehHandle = () => {

}

const selectChangeHandle = () => {

}
const changeHandle = () => {

}
const selectHandle = () => {

}
const documentHandle = (id, checkUp) => {

}
const chanegSwitchHandle = () => {

}
const updateGood = () => {

}
const deleteGood = () => {

}
</script>
<style scoped lang="less">
@import "Goods";
</style>