<template>
  <div>
    <el-form ref="form" :inline="true" :model="dataForm" :rules="dataRules">
      <el-form-item prop="keyword">
        <el-input class="keyword" clearable="clearable" v-model="dataForm.keyword" maxlength="50"
                  placeholder="订单号"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchHandle" type="primary" :icon="Search">查询
        </el-button>
      </el-form-item>
      <el-form-item class="mold">
        <el-radio-group v-model="dataForm.statusLabel" @change="searchHandle">
          <el-radio value="全部">全部</el-radio>
          <el-radio value="已付款">已付款</el-radio>
          <el-radio value="未付款">未付款</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="order-list" v-show="!empty">
      <div class="order" v-for="item in data.dataList">
        <div class="header">
          <div class="createTime">{{ item.createTime }}</div>
          <div class="orderNo">{{ item.outTradeNo }}</div>
          <div class="detail" @click="detailHandle(item.sanpshotId)">查看商品详情</div>
        </div>
        <div class="content">
          <img :src="item.goodsImage" alt="" class="image">
          <div class="info">
            <h4>{{ item.goodsTitle }}</h4>
            <p>{{ item.goodsDescription }}</p>
          </div>
          <div class="price">
            <span class="label">套餐单价</span>
            <span class="value">{{ item.goodsPrice }}</span>
          </div>
          <div class="number">
            <span class="label">套餐数量</span>
            <span class="value">*{{ item.number }}</span>
          </div>
          <div class="amount">
            <span class="label">合计</span>
            <span class="value">￥{{ item.amount }}</span>
          </div>
          <div class="status">
            <span class="label">状态</span>
            <span class="value">{{ item.status }}</span>
          </div>
          <div class="operate">
            <el-button @click="payHandle(item.goods_id,item.number,item.outTradeNo,item.amount,item.goodsTitle)"
                       v-if="item.status==='未付款'"
                       type="primary"
                       :disabled="item.disabled">付款
            </el-button>
            <el-button @click="cancelOrderHandle(item.id)" type="danger" v-if="item.status==='未付款'"
                       :disabled="item.disabled">取消订单
            </el-button>
            <el-button @click="appointHandle(item.id,item.appointCount,item.number)" v-if="item.status==='已付款'"
                       type="primary" :disabled="item.appointCount===item.number">预约体检
            </el-button>
            <el-button v-if="item.status==='已结束'" type="primary" :disabled="item.disabled">获取发票</el-button>
            <!--            如果已经有预约体检了,则不能退款-->
            <el-button @click="refundHandle(item.id)" v-if="item.status==='已付款'" type="warning"
                       :disabled="item.appointCount>0">退款
            </el-button>

          </div>
        </div>


      </div>
    </div>
    <el-pagination
        :current-page="data.pageIndex"
        :page-size="data.pageSize"
        :page-sizes="[5,10,20,50]"
        :total="data.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
  <div v-show="empty" class="empty">
    <el-empty :image-size="200"></el-empty>
  </div>
  <el-dialog title="体检预约" v-model="appointmentDialog.visible" width="500px" :close-on-click-modal="false">
    <el-form :model="appointmentDialog.dataForm" ref="dialogForm" :rules="appointmentDialog.dataRules"
             label-width="80px">
      <fieldset class="appointment">
        <legend>
          <h4>我的预约</h4>
        </legend>
        <el-form-item prop="date" label="预约日期">
          <el-date-picker style="width: 150px" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                          placeholder="选择日期"
                          :disabled-date="disableDate" :editable="false" v-model="appointmentDialog.dataForm.date"/>
          <span class="desc" style="margin-left: 10px">提示:不可预约今日</span>
        </el-form-item>
        <el-form-item label="体检人" prop="name">
          <el-input clearable="clearable" maxlength="10" placeholder="输入姓名"
                    v-model="appointmentDialog.dataForm.name"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="pid">
          <el-input maxlength="18" placeholder="输入身份证" v-model="appointmentDialog.dataForm.pid"
                    clearable="clearable"/>
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input maxlength="11" placeholder="输入电话号码" v-model="appointmentDialog.dataForm.tel"/>
        </el-form-item>
        <el-form-item label="邮寄地址" prop="mailingAddress">
          <el-input maxlength="100" placeholder="输入邮寄地址"
                    v-model="appointmentDialog.dataForm.mailingAddress"/>
        </el-form-item>
        <el-form-item label="公司地址" prop="company">
          <el-input maxlength="100" placeholder="输入公司地址" v-model="appointmentDialog.dataForm.company"
                    clearable="clearable"/>
        </el-form-item>
      </fieldset>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="appointmentDialog.visible=false">取消</el-button>
        <el-button type="primary" @click="dataSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import orderService from "../../../api/order";
import appointmentService from "../../../api/appointment";

import {dayjs, ElMessage} from "element-plus"
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween);
let {proxy} = getCurrentInstance();
const dataForm = reactive({
      keyword: null,
      statusLabel: '全部',
      status: null
    }
)
const appointmentDialog = reactive({
  number: null,
  appointCount: null,
  visible: false,
  dataForm: {
    orderId: null,
    date: null,
    name: null,
    pid: null,
    tel: null,
    mailingAddress: null,
    company: null
  },
  dataRules: {
    date: [
      {
        required: true,
        message: '日期不能为空'
      }
    ],
    name: [
      {
        required: true,
        message: '姓名不能为空'
      },
      {
        pattern: '^[\u4e00-\u9fa5]{2,10}$',
        message: '姓名格式错误'
      }
    ],
    pid: [
      {
        required: true,
        message: '身份证不能为空'
      },
      {
        pattern: '^[0-9Xx]{18}$',
        message: '身份证格式错误'
      }
    ],
    tel: [
      {
        required: true,
        message: '电话号码不能为空'
      },
      {
        pattern: '^1[1-9]\\d{9}$',
        message: '电话号码格式错误'
      }
    ],
    mailingAddress: [
      {
        required: true,
        message: '邮寄地址不能为空'
      },
      {
        pattern: '^[0-9A-Za-z\u4e00-\u9fa5\\-_#]{2,100}$',
        message: '邮寄地址格式错误'
      }
    ],
    company: [
      {
        required: false,
        pattern: '^[0-9A-Za-z\u4e00-\u9fa5\\-_#]{2,100}$',
        message: '公司名称错误'
      }
    ]
  }
})
const dataRules = reactive({
  keyword: [
    {
      required: false,
      pattern: "^[0-9a-zA-Z\u4e00-\u9fa5]{1,40}$",
      message: '订单号格式有误'
    }
  ]
})
// 只能预约未来60天的体检
const disableDate = (date) => {
  let bool = dayjs(date).isBetween(dayjs(), dayjs().add(61, 'day'))
  return !bool;
}
const dataSubmit = () => {
  let json = {
    orderId: appointmentDialog.dataForm.orderId,
    name: appointmentDialog.dataForm.name,
    date: appointmentDialog.dataForm.date,
    tel: appointmentDialog.dataForm.tel,
    pid: appointmentDialog.dataForm.pid,
    company: appointmentDialog.dataForm.company,
    mailingAddress: appointmentDialog.dataForm.mailingAddress
  }
  appointmentService.insert(json, res => {
    if (res.result === '预约成功') {
      ElMessage.success({
        message: res.result
      })
      appointmentDialog.visible = false
      loadOrderList()
    } else {
      ElMessage.error({
        message: res.result
      })

    }
  }, err => {

  })
}
const empty = ref(false)
const data = reactive({
  dataList: [],
  pageSize: 10,
  pageIndex: 1,
  totalCount: 0,
  selections: []
})
const appointHandle = (id, appointCount, number) => {
  if (appointCount == 0) {
    proxy.$confirm('该订单一旦预约将无法退款,是否预约体检?', '提示信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      appointmentDialog.visible = true
      appointmentDialog.dataForm.orderId = id
      appointmentDialog.number = number
      appointmentDialog.appointCount = ++appointCount
      proxy.$nextTick(() => {
        proxy.$refs['dialogForm'].resetFields()
      })
    })

  }
}
const cancelOrderHandle = (id) => {
  proxy.$confirm("确定要取消该笔订单吗", '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let json = {
      id: id
    }
    orderService.cancelOrder(json, res => {
      if (res.rows > 0) {
        ElMessage.success({
          message: '订单已取消',
          onClose: () => {
            loadOrderList()
          }
        })
      } else {
        ElMessage.error({
          message: '出现异常',
        })
      }
    }, err => {

    })


  })
}
const payHandle = (id, number, outTradeNo, amount, goodsTitle) => {
  window.open("http://139.9.192.29:7900/api/front/order/createPayment?goodsId=" + id + "&number=" + number + "&token=" + localStorage.getItem("token") + "&amount=" + amount + "&goodsTitle=" + goodsTitle + "&outTradeNo=" + outTradeNo)
  let token = localStorage.getItem("token");
  proxy.$socket.sendObj({
    opt: 'ping',
    identity: 'customer',
    token: token
  })
}
const refundHandle = (id) => {
  proxy.$confirm("你确定要执行退款吗", '提示信息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let json = {
      id: id
    }
    orderService.refund(json, res => {
      if (res.result) {
        ElMessage.success({
          message: '已申请原路退还款项,请稍后查看',
          onClose:()=>{
            loadOrderList();
          }
        })
      } else {
        ElMessage.error({
          message: '退款申请失败,请联系客服'
        })
      }
    })

  }, err => {

  })
}
const handleSizeChange = (val) => {
  data.pageIndex = 1
  data.pageSize = val;
  loadOrderList()
}
const handleCurrentChange = (val) => {
  data.pageIndex = val
  loadOrderList()
}

const loadOrderList = () => {
  console.log(dataForm.statusLabel)
  let json = {
    keyword: dataForm.keyword,
    status: dataForm.status,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize
  }

  orderService.selectOrderList(json, res => {
    if (res.code === 200) {
      let page = res.page
      let statusEnum = {
        "1": '未付款',
        "2": '已关闭',
        "3": '已付款',
        "4": '已退款',
        "5": '已预约',
        "6": '已结束'
      }
      for (let item of page.list) {
        item.goodsImage = `${proxy.$minioUrl}/his/${item.goodsImage}`
        item.status = statusEnum[item.status + ""]
      }
      data.dataList = page.list
      data.totalCount = page.totalCount
      empty.value = (page.list.length == 0)
    }
  }, err => {
  })
}
const searchHandle = () => {
  proxy.$refs['form'].validate(valid => {
    if (valid) {
      if (dataForm.statusLabel == '全部') {
        dataForm.status = null
      } else if (dataForm.statusLabel == '未付款') {
        dataForm.status = 1
      } else {
        dataForm.status = 3
      }
      proxy.$refs['form'].clearValidate()
      if (dataForm.keyword === '') {
        dataForm.keyword = null
      }
      loadOrderList()
    } else {
      return false
    }
  })
}

onMounted((() => {
  loadOrderList()
}))
</script>

<style scoped lang="less">
@import "order.less";
</style>