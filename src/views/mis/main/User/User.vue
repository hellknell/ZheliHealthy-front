<script setup lang="ts">
import {useUserStore} from "../../../../store/user";
import {getCurrentInstance, onMounted, reactive} from "vue";
import {dayjs} from 'element-plus'
import roleService from "../../../../api/role";
import deptService from "../../../../api/dept";
import userService from "../../../../api/user";

onMounted(() => {
  roleService.getAllRoles(res => {
    if (res.code === 200) {
      tableData.roleList = res.list
    }
  }, err => {

  })
  deptService.getAllDepts(res => {
    if (res.code === 200) {
      tableData.deptList = res.list
    }
  }, err => {

  })
  search()
})

const close = () => {
  proxy.$refs.dialogForm.resetFields()
}
let user = useUserStore()
let {proxy} = getCurrentInstance()
let User = user.User
const rules = reactive({
  name: [
    {
      required: false,
    },
    {
      pattern: '^[u4e00-\u9fa5]{1,10}$',
      message: '姓名格式错误'
    }
  ],

})

const dialog = reactive({
  visible: false,
  update: false,
  dataForm: {
    id: null,
    username: null,
    password: null,
    name: null,
    sex: null,
    tel: null,
    email: null,
    hireDate: dayjs(new Date()).format('YYYY-MM-DD'),
    role: null,
    deptId: null,
    status: 1,
  },
  dataRule: {
    username: [],

    password: [],
    name: [],
    sex: '',
    tel: [],
    email: [],
    hireDate: [],
    role: [],
    status: []
  }


})
const search = () => {
  tableData.loading = true
  if (User.name === '') {
    User.name = null
  }
  if (page.pageIndex != 1) {
    page.pageIndex = 1
  }
  proxy.$refs['form'].validate(vaild => {

    if (vaild) {
      proxy.$refs['form'].clearValidate()
      let form = {
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
        name: User.name,
        sex: User.sex,
        role: User.role,
        deptId: User.deptId,
        status: User.status
      }
      userService.getUserList(form, res => {
        tableData.loading = false
        if (res.code === 200) {
          tableData.dataList = res.page.list
          page.pageIndex = res.page.pageNum
          page.pageSize = res.page.pageSize
          page.totalCount = res.page.totalCount

        }
      }, err => {


      })
    }
  })

}
const add = () => {

  dialog.visible = true
}
const deleteBatch = () => {


}

const deleteUser = (id: number) => {

}

const update = (id: number) => {

}
const selectChangeHandle = () => {

}
const handleSizeChange = (val) => {
  page.pageIndex = val;
  search()
}
const handleCurrentChange = (val) => {
  page.pageIndex = val
  page.pageIndex = 1
  search()
}
const tableData = reactive({
  dataList: [],
  loading: false,
  selections: [],
  roleList: [],
  deptList: []
})
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: undefined
})
</script>

<template>
  <div>
    <el-dialog v-model="dialog.visible" :title="dialog.dataForm.id? '修改': '新增' " :close-on-click-modal="false"
               @close="close"
               align="center"
               width="450">
      <el-form
          ref="dialogForm"
          label-position="left"
          label-width="auto"
          :model="dialog.dataForm"
          :rules="dialog.dataRule"
          style="max-width: 600px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="dialog.dataForm.username" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="dialog.dataForm.password" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialog.dataForm.name"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="dialog.dataForm.sex">
            <el-option label="男" value="男">
            </el-option>
            <el-option label="女" value="女">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dialog.dataForm.tel" maxlength="11" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dialog.dataForm.email" maxlength="50" clearable/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-form inline="true" :model="User" :rules="rules" ref="form">
      <el-form-item prop="name">
        <el-input v-model="User.name" placeholder="姓名" maxlength="10" class="input" clearable>
        </el-input>
      </el-form-item>

      <el-form-item prop="sex">
        <el-select v-model="User.sex" placeholder="性别" class="input" clearable>
          <el-option label="男" value="男"/>
          <el-option label="女" value="女"/>
        </el-select>
      </el-form-item>

      <el-form-item prop="role">
        <el-select v-model="User.role" placeholder="角色" class="input" clearable>
          <el-option v-for="item in tableData.roleList" :label="item.roleName" :value="item.roleName"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="User.deptId" placeholder="部门" class="input" clearable>
          <el-option v-for="item in tableData.deptList" :label="item.deptName" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="User.status" placeholder="状态" class="input" clearable>
          <el-option label="在职" value="1"/>
          <el-option label="离职" value="2"/>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="search">查询
        </el-button>

        <el-button v-if="proxy.isAuth(['ROOT','USER:INSERT'])" type="primary" @click="add">新增
        </el-button>

        <el-button v-if="proxy.isAuth(['ROOT','USER:DELETE'])" type="danger" @click="deleteBatch">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.dataList" style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}"
              v-loading="tableData.loading"
              border
              @selection-change="selectChangeHandle">
      <el-table-column type="selection" width="55"/>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="70">
        <template #default="scope">
          <span>{{ (page.pageIndex - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>

      </el-table-column>
      <el-table-column header-align="center" align="center" prop="name" label="姓名" width="180"/>
      <el-table-column min-width="60" header-align="center" align="center" prop="sex" label="性别"/>
      <el-table-column min-width="130" header-align="center" align="center" prop="tel" label="电话"/>
      <el-table-column min-width="230" header-align="center" show-overflow-tooltip align="center" prop="email"
                       label="邮箱"/>
      <el-table-column min-width="130" header-align="center" align="center" prop="hireDate" label="入职日期"/>
      <el-table-column min-width="100" header-align="center" align="center" prop="roles" label="角色"/>
      <el-table-column min-width="100" header-align="center" align="center" prop="dept" label="部门"/>
      <el-table-column header-align="center" align="center" min-width="60" prop="status" label="状态">
        <template #default="scope">
          <span v-if="scope.row.status">在职</span>
          <span v-else>离职</span>
        </template>
      </el-table-column>
      <el-table-column width="160" header-align="center" align="center" prop="status" label="操作" min-width="155">
        <template #default="scope">
          <el-button
              link
              type="primary"
              @click="update(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
              link
              type="danger"

              @click="deleteUser(scope.row.id)"
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="sass">
@import url("../../../../assets/scss/index.scss")

</style>