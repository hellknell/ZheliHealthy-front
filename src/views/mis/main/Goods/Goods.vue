<template>
  <div v-if="proxy.isAuth(['ROOT','GOODS:SELECT'])">
    <el-form ref="form" :inline="true" :model="dataForm" :rules="dataRules">
      <el-form-item prop="keyword">
        <el-input v-model="dataForm.keyword" clearable="clearable" maxlength="50" placeholder="套餐名称">
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="dataForm.code" class="input" clearable="clearable" maxlength="50" placeholder="套餐编号">
        </el-input>
      </el-form-item>

      <el-form-item prop="type">
        <el-select v-model="dataForm.type" class="input" clearable="clearable" placeholder="套餐类型">
          <el-option label="父母体检" value="父母体检"></el-option>
          <el-option label="入职体检" value="入职体检"></el-option>
          <el-option label="入学体检" value="入学体检"></el-option>
          <el-option label="中青年体检" value="中青年体检"></el-option>
          <el-option label="个人高端" value="个人高端"></el-option>
          <el-option label="职场白领" value="职场白领"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="partId">
        <el-select v-model="dataForm.partId" class="input" clearable="clearable" placeholder="展示区">
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
    <el-table v-loading="tableData.loading" :data="tableData.dataList" :header-cell-style="{'background':'#f5f7fa'}"
              border
              style="width: 100%"
              @selection-change="selectChangeHandle">
      <el-table-column :selectable="selectHandle" type="selection" width="55"/>
      <el-table-column align="center" header-align="center" label="序号" type="index" width="100">
        <template #default="scope">
          <span>{{ (page.pageIndex - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" header-align="center" label="套餐名称" prop="title" width="240"/>
      <el-table-column align="center" header-align="center" label="套餐编号" min-width="160" prop="code"/>
      <el-table-column align="center" header-align="center" label="现价" min-width="80">
        <template #default="scope">
          <span>￥{{ scope.row.currentPrice }}</span>
        </template>

      </el-table-column>
      <el-table-column align="center" header-align="center" label="原价" min-width="80">
        <template #default="scope">
          <span>￥{{ scope.row.initialPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" header-align="center" label="促销方案" min-width="100"
                       prop="ruleName"/>
      <el-table-column align="center" header-align="center" label="销量" min-width="100" prop="salesVolume"/>

      <el-table-column align="center" header-align="center" label="类型" min-width="100" prop="type"/>
      <el-table-column align="center" header-align="center" label="体检内容" min-width="100">
        <template #default="scope">

      <span :class=
                "scope.row.hasCheckup?'link-blue':'link-red'"
            @click="documentHandle(scope.row.id,scope.row.hasCheckup)">
{{ scope.row.hasCheckup ? '有文档' : '无文档' }}
      </span>
        </template>
      </el-table-column>


      <el-table-column align="center" header-align="center" label="状态" min-width="80" prop="status">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-text="上架"
                     inactive-text="下架"
                     inline-prompt style="--el-switch-on-color:#13ce66 ;--el-switch-off-color:#ff4949 "
                     @change="chanegSwitchHandle(scope.row.id,scope.row.status)"
          >

          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" min-width="155" width="160">
        <template #default="scope">
          <el-button
              type="text"
              @click="viewHandle(scope.row.id)"
          >
            预览
          </el-button>

          <el-button
              v-if="proxy.isAuth(['ROOT','GOODS:UPDATE'])"
              :disabled="scope.row.status"
              type="text"
              @click="updateGood(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
              v-if="proxy.isAuth(['ROOT','GOODS:DELETE'])"
              :disabled="scope.row.salesVolume>0 | scope.row.status"
              type="text"
              @click="deleteGood(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        :page-sizes="[10,20,50]"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog v-if="proxy.isAuth(['ROOT','GOODS:INSERT','GOODS:UPDATE'])" v-model="dialog.visible" :center="true"
             :close-on-click-modal="false"
             :title="dialog.dataForm.id? '修改': '新增' "
             width="650"
             @close="beforeClose">
    <el-form
        ref="dialogForm"
        :model="dialog.dataForm"
        :rules="dialog.dataRules"
        label-position="left"
        label-width="auto"
        style="max-width: 680px"
    >
      <el-form-item label="套餐名称" prop="title">
        <el-input v-model="dialog.dataForm.title" clearable maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="套餐编号" prop="code">
        <el-input v-model="dialog.dataForm.code" maxlength="20" type="password"></el-input>
      </el-form-item>
      <el-form-item label="简介信息" prop="description">
        <el-input v-model="dialog.dataForm.description" :rows="4" maxlength="200" type="textarea"/>
      </el-form-item>
      <el-form-item label="套餐现价" prop="currentPrice">
        <el-input v-model="dialog.dataForm.currentPrice" maxlength="20" placeholder="请输入现价"
                  style="max-width: 200px">
          <template #append>
            元
          </template>
        </el-input>
        <span style="margin-left: 5px;color: #666">提示:价格精确到分(保留小数点后两位)</span>
      </el-form-item>
      <el-form-item label="套餐原价" prop="initialPrice">
        <el-input v-model="dialog.dataForm.initialPrice" clearable maxlength="20"
                  placeholder="请输入原价" style="max-width: 200px">
          <template #append>
            元
          </template>
        </el-input>
        <span style="margin-left: 5px;color: #666">提示:价格精确到分(保留小数点后两位)</span>
      </el-form-item>

      <el-form-item label="折扣列表">
        <el-select v-model="dialog.ruleList" placeholder="选择折扣信息">
          <el-option v-for="item in dialog.ruleList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="封面图片" prop="image">
        <el-upload
            :action="dialog.upload.action"
            :before-upload="imageBeforeUpload"
            :data="dialog.upload.data"
            :headers="dialog.upload.haeders"
            :on-error="imageBeforeUploadError"
            :on-success="imageUploadSuccess"
            class="image-uploader"
        >
          <el-image v-if="dialog.imageUrl" :src="dialog.imageUrl" class="image" style="width: 100%;height: 100%"/>
          <el-icon v-else class="image-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="套餐类别" prop="type">
        <el-select v-model="dialog.dataForm.type" placeholder="检查类别">
          <el-option label="父母体检" value="父母体检"></el-option>
          <el-option label="入职体检" value="入职体检"></el-option>
          <el-option label="入学体检" value="入学体检"></el-option>
          <el-option label="中青年体检" value="中青年体检"></el-option>
          <el-option label="个人高端" value="个人高端"></el-option>
          <el-option label="职场白领" value="职场白领"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特征标签">
        <div class="tag-row">
          <el-input v-model="dialog.newTag" class="tag-input" clearable @keyup.enter="enterTag">
          </el-input>
          <span style="margin-left: 4px">提示:输入标签后按下回车</span>
        </div>
        <div class="tags">
          <el-tag v-for="item in dialog.dataForm.tags" :disable-transitions="false" closable @close="closeTag(item)">
            {{ item }}
          </el-tag>
        </div>
      </el-form-item>


      <el-form-item label="展示区" style="margin-top: 20px;width: 60%;">
        <el-select v-model="dialog.dataForm.partId" placeholder="选择展示区">
          <el-option label="活动分区" value="1"></el-option>
          <el-option label="热卖套餐" value="2"></el-option>
          <el-option label="新品推荐" value="3"></el-option>
          <el-option label="孝敬父母" value="4"></el-option>
          <el-option label="白领精英" value="5"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="体检内容">
        <el-row v-for="(item,$index) in dialog.items" :key="$index" :gutter="10" class="item-row">
          <el-col span="6">
            <el-select v-model="item.type" clearable="clearable" default-first-option placeholder="检查类型"
                       style="width: 100%">
              <el-option label="科室检查" value="科室检查"/>
              <el-option label="实验室检查" value="实验室检查"/>
              <el-option label="医技检查" value="医技检查"/>
              <el-option label="其他检查" value="其他检查"/>

            </el-select>
          </el-col>
          <el-col span="6">
            <el-input v-model="item.title" maxlength="50" placeholder="体检项目"/>
          </el-col>
          <el-col span="11">
            <el-input v-model="item.content" clearable="clearable" maxlength="500" placeholder="体检内容"
                      type="textarea"/>
          </el-col>
          <el-col span="1">
            <el-button :icon="Delete" type="primary" @click="deleteItem($index)"></el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="dialog.visible=false">取消</el-button>
        <el-button type="danger" @click="addItem">添加项目</el-button>

        <el-button @click="dataSubmit">确认</el-button>
      </div>

    </template>
  </el-dialog>
  <!--  上传或下载excel文档-->
  <el-dialog v-if="proxy.isAuth(['ROOT','GOODS:INSERT','GOODS:UPDATE'])"
             v-model="documentDialog.visible"
             width="400px"
             :center="true"
             title="提示信息">
    <div class="message-content">
      <el-icon :size="28" class="icon">
        <WarningFilled/>
      </el-icon>
      <p>
        请你选择【上传】或【下载】体检内容文档？如未上传体检内容文档,则套餐无法上架</p>
    </div>
    <template #footer>
      <span class="document-dialog-footer">
        <el-upload
            :action="documentDialog.upload.action"
            :before-upload="documentBeforeUpload"
            accept=".xlsx"
            :data="documentDialog.upload.data"
            :headers="documentDialog.upload.headers"
            :on-error="documentUploadError"
            :on-success="documentUploadSuccess"
            class="document-uploader"
        >
          <el-button class="uploadBtn" type="success" :icon="Upload">上传</el-button>
        </el-upload>
        <el-button class="download" type="primary" @click="download" :icon="Download">下载</el-button>
      </span>

    </template>

  </el-dialog>
</template>
<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive} from "vue";
import {Delete, Download, Plus, Upload, WarningFilled} from "@element-plus/icons-vue";

let {proxy} = getCurrentInstance();
const documentDialog = reactive({
  upload: {
    action: `${proxy.$baseUrl}/mis/goods/uploadCheckupExcel`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      id: null,
      hasCheckup: null
    }
  },
  visible:
      true
})
const dialog = reactive({
  items: [{}],
  newTag: null,
  imageUrl: null,
  upload: {
    action: `${proxy.$baseUrl}/mis/goods/uoloadImage`,
    haeders: localStorage.getItem("token"),
    data: {
      id: null
    }
  },
  ruleList: [],
  dataForm: {
    id: undefined,
    title: null,
    code: null,
    currentPrice: null,
    initialPrice: null,
    type: null,
    partId: null,
    description: null,
    ruleId: null,
    tags: [],

  },
  visible: false,
  dataRules: {
    title: [
      {
        required: true,
        message: "套餐名称不能为空"

      },
      {
        min: 2,
        message: '套餐名称不能少于两个字符'
      },
      {
        pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{2, 50}$',
        message: '套餐名称格式错误'
      }
    ],
    code: [
      {
        required: true,
        message: "套餐编号不能为空"

      },
      {
        min: 6,
        message: '套餐编号不能少于6个字符'
      },
      {
        pattern: '^[a-zA-Z0-9]{6, 20}$',
        message: '套餐名称格式错误'
      }
    ],
    description: [
      {
        required: true,
        message: '简介不能为空不能为空'

      }
    ],
    initialPrice: [{
      required: true,
      message: '价格不能为空'
    }],
    currentPrice: [{
      required: true,
      message: '价格不能为空'
    }],
    image: [
      {
        required: true,
        message: '上传图片不能为空'
      }
    ],
    type: [
      {
        required: true,
        message: '套擦类别不能为空'
      }
    ]
  }
})
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
  pageSize: 10,
  totalCount: 0
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
  dialog.visible = true
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
const closeTag = (item) => {

}

const handleSizeChange = (val) => {
  page.pageSize = val
  page.pageIndex = 1
  loadGoods()
}
const handleCurrentChange = (val) => {
  page.pageIndex = val
  loadGoods()

}
const loadGoods = () => {
}
onMounted(() => {
  loadGoods()
})
const deleteGood = () => {

}
const beforeClose = () => {
  proxy.$refs.dialogForm.resetFields()
}
const imageBeforeUpload = () => {

}
const imageUploadSuccess = () => {

}
const imageBeforeUploadError = () => {

}
const enterTag = () => {
  dialog.dataForm.tags.push(dialog.newTag)
}
const deleteItem = (index) => {

}
const addItem = () => {

}
const dataSubmit = () => {

}
const download = () => {

}
const documentBeforeUpload = () => {

}
const documentUploadError = () => {

}
const documentUploadSuccess = () => {

}

</script>
<style lang="scss" scoped>
@import "../../../../assets/scss/index.scss";
</style>
<style lang="less" scoped>
@import "Goods";
</style>