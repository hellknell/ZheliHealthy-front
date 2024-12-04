<template>
  <div v-if="proxy.isAuth(['ROOT','GOODS:SELECT'])">
    <el-form ref="form" :inline="true" :model="dataForm" :rules="dataRules">
      <el-form-item style="max-width: 100px" prop="keyword">
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
        <el-button v-if="proxy.isAuth(['ROOT','GOODS:DELETE'])" type="danger" @click="deletehHandle">
          批量删除
        </el-button>
      </el-form-item>

      <el-form-item class="mold">
        <el-radio-group v-model="dataForm.statusLabel" @change="searchHandle">
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
              @click="deletehHandle(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        :page-sizes="[5,10,20,50]"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog v-if="proxy.isAuth(['ROOT','GOODS:INSERT','GOODS:UPDATE'])" v-model="dialog.visible" :center="true"
             :close-on-click-modal="false"
             :title="dialog.dataForm.id? '修改': '新增' "
             width="750"
             @close="beforeClose">
    <el-form
        ref="dialogForm"
        :model="dialog.dataForm"
        :rules="dialog.dataRules"
        label-position="left"
        label-width="auto"
        style="max-width: 750px"
    >
      <el-form-item label="套餐名称" prop="title">
        <el-input v-model="dialog.dataForm.title" clearable maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="套餐编号" prop="code">
        <el-input v-model="dialog.dataForm.code" maxlength="20"></el-input>
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
        <el-select v-model="dialog.dataForm.ruleId" placeholder="选择折扣信息">
          <el-option v-for="item in dialog.ruleList" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="封面图片" prop="image">
        <el-upload
            :action="dialog.upload.action"
            accept=".jpg,.png,.jpeg"
            :before-upload="imageBeforeUpload"
            :data="dialog.upload.data"
            :headers="dialog.upload.headers"
            :on-error="imageBeforeUploadError"
            :on-success="imageUploadSuccess"
            class="image-uploader"
        >
          <el-image v-if="dialog.imageUrl" :src="dialog.imageUrl" class="image"/>
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
          <el-tag v-for="item in dialog.dataForm.tag" :disable-transitions="false" closable @close="closeTag(item)">
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
            <el-select v-model="item.type" clearable="clearable"
                       style="width: 100px">
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
        <el-button type="danger" @click="addItem">添加项目</el-button>
        <el-button @click="dialog.visible=false">取消</el-button>


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
import goodsService from "../../../../api/goods";
import {ElMessage, UploadFile, UploadFiles} from "element-plus";
import ruleService from "../../../../api/rule";
import router from "../../../../router";

let {proxy} = getCurrentInstance();
const documentDialog = reactive({
  upload: {
    action: `${proxy.$baseUrl}/mis/goods/updateCheckupExcel`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      id: null,
      hasCheckup: false
    }
  },
  visible: false
})
const dialog = reactive({
  items: [{}],
  newTag: null,
  imageUrl: null,
  upload: {
    action: `${proxy.$baseUrl}/mis/goods/uploadImage`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      id: null
    }
  },
  checkup: null,
  ruleList: [],
  dataForm: {
    id: null,
    title: null,
    image: null,
    code: null,
    currentPrice: null,
    initialPrice: null,
    type: null,
    partId: null,
    description: null,
    ruleId: null,
    tag: [],

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
  totalCount: 10
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

  proxy.$refs['form'].validate(valid => {
    if (valid) {
      loadGoods(dataForm)
    } else {
      return false;
    }
  })

}
const addHandle = () => {
  dialog.dataForm.id = null
  dialog.dataForm.image = null
  dialog.imageUrl = null

  dialog.dataForm.ruleId = null
  dialog.ruleList = []

  dialog.checkup = null
  dialog.items = [{}]

  dialog.newTag = null

  dialog.dataForm.tag = []

  proxy.$nextTick(() => {
    proxy.$refs['dialogForm'].resetFields()
    loadAllRules()
  })
}
const deletehHandle = (id) => {

  let ids = id != null ? [id] : tableData.selecions.map(item => item.id)
  if (ids.length == 0) {
    proxy.$message({
      message: '请选择至少一条记录',
      type: 'warning'
    })
    return  dialog.visible = true


  }
  proxy.$confirm('确定要删除选择的记录?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '确定',
    type: 'warning'
  }).then(() => {
    let parms = {
      ids: ids
    }
    goodsService.deleteGoodsById(parms, res => {
      if (res.rows > 0) {
        ElMessage.success({
          message: '删除成功'
        })
      } else {
        ElMessage.warning({
          message: '未删除任何记录'
        })
      }
    }, err => {

    })
  })
}
const selectChangeHandle = (val) => {
  tableData.selecions = val
}
const changeHandle = () => {

}
const selectHandle = (row, index) => {
  if (row.status == true || row.salesVolumn > 0) {
    return false
  }
  return true


}
const documentHandle = (id, hasCheckUp) => {
  documentDialog.upload.data = {
    id: id,
    hasCheckup: hasCheckUp
  }
  documentDialog.visible = true
}
const chanegSwitchHandle = (id, status) => {
  console.log(status)
  let json = {
    id: id,
    status: status
  }
  goodsService.insertOrAddGoods(json, res => {
        if (res.code === 200) {
          ElMessage.success({
            message: '修改商品状态成功'
          })
          loadGoods()
        }
      }, err => {

      }
  )


}
const updateGood = (id) => {
  dialog.upload.data.id = id
  dialog.dataForm.id = id
  dialog.dataForm.image = null
  dialog.imageUrl = null
  dialog.newTag = null
  dialog.checkup = null
  dialog.items = []
  dialog.dataForm.tag = []
  dialog.visible = true;


  proxy.$nextTick(() => {

    proxy.$refs['dialogForm'].resetFields();

    let json = {
      id: id
    }
    loadAllRules()
    goodsService.searchGoodById(json, res => {
      if (res.code === 200) {
        dialog.dataForm.code = res.result.code
        dialog.dataForm.type = res.result.type
        dialog.dataForm.title = res.result.title
        dialog.dataForm.description = res.result.description
        dialog.dataForm.ruleId = res.result.ruleId
        dialog.dataForm.partId = res.result.partId + ""
        dialog.dataForm.image = res.result.image
        dialog.imageUrl = `${proxy.$minioUrl}/his/${res.result.image}`
        dialog.dataForm.initialPrice = res.result.initialPrice
        dialog.dataForm.currentPrice = res.result.currentPrice
        dialog.dataForm.tag = res.result.tag ? JSON.parse(res.result.tag) : []
        let typeJson = {
          'checkup1': '科室检查',
          'checkup2': '实验室检查',
          'checkup3': '医技检查',
          'checkup4': '其他检查'
        }
        for (let key in typeJson) {
          if (res.result.hasOwnProperty(key)) {
            let checkup = JSON.parse(res.result[key])
            for (let one of checkup) {
              dialog.items.push({type: typeJson[key], title: one.title, content: one.content})
            }
          }
        }
      }

    }, err => {

    })
  })
}
const closeTag = (item) => {
  let i = dialog.dataForm.tag.indexOf(item);
  dialog.dataForm.tag.splice(i, 1)
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

const loadGoods = (form) => {
  tableData.loading = true
  let param;
  if (form == null) {
    param = {
      keyword: null,
      code: null,
      status: null,
      type: null,
      partId: null,
      pageIndex: page.pageIndex,
      pageSize: page.pageSize
    }
  } else {
    param = {
      keyword: form.keyword,
      code: form.code,
      status: form.form,
      type: form.type,
      partId: form.partId,
      pageIndex: page.pageIndex,
      pageSize: page.pageSize
    }
  }
  if (dataForm.statusLabel == '已上架') {
    param.status = true
  }
  if (dataForm.statusLabel == '已下架') {
    param.status = false
  }
  goodsService.getAllGoods(param, res => {
    tableData.loading = false
    if (res.code === 200) {
      tableData.dataList = res.page.list;
      page.pageIndex = res.page.pageNum;
      page.pageSize = res.page.pageSize
      page.totalCount = res.page.total
    }
  }, err => {

  })

}
const loadAllRules = () => {
  ruleService.searchAllRules(res => {
    if (res.code === 200) {
      dialog.ruleList = res.result;
    }
  }, err => {
  })
}
onMounted(() => {
  loadGoods()
})
const beforeClose = () => {
  proxy.$refs['dialogForm'].resetFields()
  dialog.visible = false
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
    dialog.dataForm.image = resp.path;
    dialog.imageUrl = `${proxy.$minioUrl}/his/${resp.path}`
    console.log(dialog.imageUrl)
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
const enterTag = () => {

  if (dialog.newTag != null || dialog.newTag != '') {
    if (dialog.dataForm.tag.includes(dialog.newTag)) {

      ElMessage.warning({
        message: "不能添加重复标签",
        duration: 1200
      })

    } else {
      dialog.dataForm.tag.push(dialog.newTag)
      dialog.newTag = null
    }

  }

}
const deleteItem = (index) => {
  if (dialog.items.length == 1) {
    ElMessage.error({
      message: "不能删除仅存的行",
      duration: 1200
    })
  } else {
    dialog.items.splice(index, 1)
  }
}
const addItem = () => {
  dialog.items.push({})
}
const dataSubmit = () => {
  proxy.$refs['dialogForm'].validate(valid => {
    if (valid) {
      let typeJson = {
        '科室检查': 'checkup1',
        '实验室检查': 'checkup2',
        '医技检查': 'checkup3',
        '其他检查': 'checkup4'
      }
      let temp = {}
      for (let item of dialog.items) {
        if (item.type === '' || item.type === null) {
          ElMessage.error({
            message: '体检类型不能为空'
          })
        }
        if (item.title === '' || item.title === null) {
          ElMessage.error({
            message: '体检项不能为空'
          })

        }
        if (item.content === '' || item.content === null) {
          ElMessage.error({
            message: '体检内容不能为空'
          })
        }
        let type = typeJson[item.type]
        if (!temp.hasOwnProperty(type)) {
          temp[type] = [{title: item.title, content: item.content}]
        } else {
          temp[type].push({
            title: item.title, content: item.content
          })
        }
      }
      ['checkup1', 'checkup2', 'checkup3', 'checkup4'].forEach((one) => {
        if (!temp.hasOwnProperty(one)) {
          temp[one] = null
        }
      })
      dialog.checkup = temp
      let tag = dialog.dataForm.tag
      let json = {
        id: dialog.dataForm.id,
        title: dialog.dataForm.title,
        code: dialog.dataForm.code,
        description: dialog.dataForm.description,
        image: dialog.dataForm.image,
        initialPrice: dialog.dataForm.initialPrice,
        currentPrice: dialog.dataForm.currentPrice,
        type: dialog.dataForm.type,
        ruleId: dialog.dataForm.ruleId,
        tag: tag.length > 0 ? tag : null,
        partId: dialog.dataForm.partId,
        checkup1: temp.checkup1,
        checkup2: temp.checkup2,
        checkup3: temp.checkup3,
        checkup4: temp.checkup4
      }
      goodsService.insertOrAddGoods(json, res => {
        if (res.code === 200) {
          if (json.id) {
            ElMessage.success({
              message: "更新成功"
            })
          } else {
            ElMessage.success({
              message: "添加成功"
            })
          }
          dialog.visible = false;
          loadGoods()
        }
      }, err => {

      })

    } else {
      return false;
    }
  })
}

const documentBeforeUpload = (file) => {
  let size = file.size / 1024 / 1024;
  if (size > 20) {
    ElMessage.error({
      message: '文件大小超过20M'
    })
    return false;
  }
  return true;
}
const documentUploadError = (e) => {
  ElMessage.error({
    message: '文件上传失败'
  })
  console.log(e)
}
const documentUploadSuccess = () => {
  documentDialog.visible = false
  ElMessage.success({
    message: '文件上传成功',
    onClose: () => {
      loadGoods()
    }
  })
}
const viewHandle = (id) => {
  router.push({name: 'FrontGoods', params: {id: id}})
}
const download = () => {
  let token = localStorage.getItem("token")
  let id = documentDialog.upload.data.id
  let url = `${proxy.$baseUrl}/mis/goods/downloadCheckupExcel?token=${token}&id=${id}`
  let a = document.createElement('a');
  a.href = url
  a.click()
  setTimeout(() => {
    documentDialog.visible = false
  }, 1000)
}

</script>
<style lang="scss" scoped>
@import "../../../../assets/scss/index.scss";
</style>
<style lang="less" scoped>
@import "Goods.less";
</style>