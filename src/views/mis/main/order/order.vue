<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive} from 'vue'
import {Calendar, Phone, Refresh, User, UserFilled} from "@element-plus/icons-vue";
import orderService from "../../../../api/order";
import appointmentService from "../../../../api/appointment";
import router from "../../../../router";
import {ElMessage} from "element-plus";


let {proxy} = getCurrentInstance();
const dataForm = reactive({
  code: null,
  keyword: null,
  tel: null,
  dataRange: null,
  status: null
})
const searchHandle = () => {
  proxy.$refs['form'].validate(valid => {
    if (valid) {
      proxy.$refs['form'].clearValidate()
      loadOrderList()
    } else {
      return false
    }
  })
}

const dataRule = reactive({

  code: [{
    min: 6,
    message: '编号不能少于6个字符'
  }],
  keyword: [
    {
      pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$',
      message: '名称格式错误'
    }
  ],
  tel: [
    {
      pattern: "^1[1-9]\\d{9}$",
      message: '电话格式错误'
    }]
})
const data = reactive({
  dataList: [{
    id: 1,
    goodsPrice: 1200,
    goodsTitle: '套餐一'
  },

    {
      id: 2,
      goodsPrice: 1000,
      goodsTitle: '套餐二'
    },
    {
      id: 3,
      goodsPrice: 1600,
      goodsTitle: '套餐三'
    }
  ],
  loading: false,
  pageIndex: 1,
  pageSize: 10,
  totalCount: 3,
  expands: [],
  getRowKeys(row) {
    return row.id
  },
  appointment: []
})
const selectable = (row, index) => {
  if (row.status != '已关闭') {
    return false;
  } else {
    return true
  }

}
const viewHandle = (snapshotId) => {
  router.push({
    name: 'GoodsSnapshot',
    params: {
      id: snapshotId,
      mode: 'mis'
    }
  })
}
const deleteHandle = (id) => {
  proxy.$confirm('确定要删除这条订单记录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    let json = {
      id: id
    }
    orderService.deleteOrder(json, res => {
      if (res.rows === 1) {
        ElMessage.success({
          message: '删除成功',
          onClose: () => {
            loadOrderList()
          }
        })
      }
    }, err => {

    })
  })
}


const updateHandle = (id) => {
  proxy.$confirm('确定要修改这条订单记录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
        let json = {
          id: id
        }
        orderService.updateRefundStatus(json, res => {
          if (res.rows > 0) {
            ElMessage.success({
              message: '更新成功',
              onClose: () => {
                loadOrderList()
              }
            })
          }
        }, err => {

        })
      }
  )
}

const handleSizeChange = (val) => {
  data.pageSize = val
  data.pageIndex = 1
  loadOrderList()
}
const handleCurrentChange = (val) => {
  data.pageIndex = val
  loadOrderList()
}
onMounted(() => {
  loadOrderList()
})
const expandChangeHandle = (row, expandedRows) => {
  if (expandedRows.length > 0) {
    data.expands = []
    if (row) {
      let json = {
        orderId: row.id
      }
      appointmentService.searchByOrderId(json, res => {
        if (res.code === 200) {
          let result = res.result
          let statusEnum = {
            "1": "未签到",
            "2": "已签到",
            "3": "已结束",
            "4": "已关闭",
          }
          for (let one of result) {
            one.status = statusEnum[one.status + ""]
          }
          data.appointment = result
        }
      }, err => {

      })
      data.expands.push(row.id)
    } else {
      data.expands = []
    }
  }

}
const loadOrderList = () => {
  data.loading = false
  let range = dataForm.dataRange
  let json = {
    tel: dataForm.tel,
    code: dataForm.code,
    status: dataForm.status,
    keyword: dataForm.keyword,
    startDate: (range != null && range.length == 2) ? range[0] : null,
    endDate: (range != null && range.length == 2) ? range[1] : null,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize
  }
  orderService.searchMisOrder(json, res => {
        let statusEnum = {
          "1": '未付款',
          "2": '已关闭',
          "3": '已付款',
          "4": '已退款',
          "5": '已预约',
          "6": '已结束'
        }
        data.loading = false
        if (res.code == 200) {
          let page = res.page
          let list = page.list
          for (let one of list) {
            one.status = statusEnum[one.status + ""]
          }
          data.dataList = page.list;
          data.totalCount = page.totalCount;
        }
      }, err => {
      }
  )
}

</script>

<template>
  <div>
    <div v-if="proxy.isAuth(['ROOT','ORDER:SELECT'])">
      <el-form :inline="true" ref="form" :model="dataForm" :rules="dataRule">
        <el-form-item prop="code">
          <el-input class="input" maxlength="20" clearable="clearable" placeholder="套餐编号"
                    v-model="dataForm.code"/>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input class="keyword" maxlength="50" clearable="clearable" placeholder="套餐名称"
                    v-model="dataForm.keyword"/>
        </el-form-item>

        <el-form-item prop="tel">
          <el-input class="input" maxlength="11" clearable="clearable" placeholder="电话号码"
                    v-model="dataForm.tel"/>
        </el-form-item>
        <el-form-item class="range">
          <el-date-picker v-model="dataForm.dataRange" type="daterange" range-separator="~" start-placeholder="起始日期"
                          end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item class="status">
          <el-select v-model="dataForm.status" class="input" placeholder="订单状态" clearable="clearable">
            <el-option label="未付款" value="1"/>
            <el-option label="已关闭" value="2"/>
            <el-option label="已付款" value="3"/>
            <el-option label="已退款" value="4"/>
            <el-option label="已预约" value="5"/>
            <el-option label="已结束" value="6"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchHandle" type="primary">查询</el-button>
          <el-button v-if="proxy.isAuth(['ROOT','ORDER:UPDATE'])" size="default" type="primary" :icon="Refresh">
            同步付款结果
          </el-button>
        </el-form-item>
      </el-form>
    </div>


    <el-table :data="data.dataList" border v-loading="data.loading"
              @selection-change="selectChangeHandle" @expand-change="expandChangeHandle" :row-key="data.getRowKeys"
              :expand-row-keys="data.expands">
      <el-table-column type="expand">
        <template #default="scope">
          <div class="content-container">
            <div class="left-panel">
              <el-card class="box-card" shadow="never">
                <div class="info">
                  <div class="left">
                    <el-avatar :size="57" shape="square" :src="scope.row.photo">
                      <el-icon :size="37">
                        <UserFilled/>
                      </el-icon>
                    </el-avatar>
                  </div>
                  <div class="right">
                    <h4 class="customer-name">{{ scope.row.nam }}</h4>
                    <p class="customer-desc">
                      <el-icon class="icon">
                        <user/>
                      </el-icon>
                      <span class="value">{{ scope.row.sex }}</span>
                      <el-icon class="icon">
                        <Phone/>
                      </el-icon>
                      <span class="value">{{ scope.row.tel }}</span>
                      <el-icon class="icon">
                        <Calendar/>
                      </el-icon>
                      <span class="value">{{ scope.row.registerTime }}</span>
                    </p>
                  </div>
                </div>
              </el-card>
              <el-divider :border-style="'dashed'"/>
              <el-row :gutter="10">
                <el-col :span="6">
                  <div class="statistic-card">
                    <el-statistic :value="scope.row.number-scope.row.num" suffix="个">
                      <template #title>
                        <span>可预约体检</span>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="statistic-card">
                    <el-statistic :value="scope.row.number-scope.row.num" suffix="个">
                      <template #title>
                        <span>可预约体检</span>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="statistic-card">
                    <el-statistic :value="scope.row.number" suffix="个">
                      <template #title>
                        <span>总计数量</span>
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
              </el-row>
              <el-descriptions :column="1" class="order-code" border>
                <el-descriptions-item label="订单编号: " label-align="left">
                  {{ scope.row.outTradeNo }}
                </el-descriptions-item>
                <el-descriptions-item label="付款编号: " label-align="left">
                  {{ scope.row.transactionId == null ? "无" : scope.row.transactionId }}
                </el-descriptions-item>
                <el-descriptions-item label="退款编号: " label-align="left">
                  {{ scope.row.outRefundNo == null ? "无" : scope.row.outRefundNo }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="right-panel">
              <el-table :data="data.appointment" height="300" border>
                <el-table-column type="index" label="序号" min-width="80" header-align="center" align="center">
                  <template #default="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="体检人" min-width="180" vheader-align="center" align="center"/>
                <el-table-column prop="sex" label="性别" header-align="center" align="center" min-width="80"/>
                <el-table-column prop="tel" label="电话号码" header-align="center" align="center" min-width="150"/>
                <el-table-column prop="date" min-width="150" label="体检日" header-align="center" align="center"/>
                <el-table-column prop="status" min-width="150" label="状态" header-align="center" align="center"/>
              </el-table>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center"
                       width="50" :selectable="selectable"></el-table-column>
      <el-table-column label="序号" type="index" header-align="center" align="center"
                       width="80">
        <template #default="scope">
          <span>{{ (data.pageIndex - 1) * data.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="goodsTitle" header-align="left" align="left"
                       min-width="=100" label="套餐名称"/>
      <el-table-column label="套餐价格" header-align="center" align="center" min-width="80">
        <template #default="scope">
          <span>￥{{ scope.row.goodsPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="number" header-align="center" align="center"
                       min-width="100"/>
      <el-table-column label="总计" min-width="100" header-align="center" align="center">
        <template #default="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" min-width="60" label="状态" header-align="center" align="center"/>
      <el-table-column prop="createTime" min-width="160" label="下单时间" header-align="center" align="center"/>
      <el-table-column prop="refundTime" min-width="160" label="退款时间" header-align="center" align="center"/>
      <el-table-column label="操作" min-width="200" header-align="center" align="center">
        <template #default="scope">
          <el-button type="text" v-if="proxy.isAuth(['ROOT','ORDER:SELECT'])"
                     @click="viewHandle(scope.row.snapshotId)">
            预览
          </el-button>
          <el-button :disabled="scope.row.status!='已关闭' && scope.row.status!='已结束'" type="text"
                     v-if="proxy.isAuth(['ROOT','ORDER:DELETE'])"
                     @click="deleteHandle(scope.row.id)">
            删除
          </el-button>
          <el-button :disabled="scope.row.status!='已付款'" type="text" v-if="proxy.isAuth(['ROOT','ORDER:UPDATE'])"
                     @click="updateHandle(scope.row.id)">
            线下退款
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
  </div>
</template>

<style scoped lang="less">
@import "order.less";
</style>