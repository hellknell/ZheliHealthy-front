<template>
  <div class="goods-detail">
    <img :src="data.img" alt="" class="cover">
    <!--    右边区域-->
    <div class="right">
      <h3 class="title">{{ data.title }}{{ data.code }}</h3>
      <p class="desc">{{ data.description }}</p>
      <div class="row">
        <label>官网价格:</label>
        <div class="info">
          <div class="current-price">{{ data.currentPrice }}</div>
          <div class="initial-price">{{ data.initialPrice }}</div>
        </div>
      </div>

      <div class="row">
        <label>享有折扣:</label>
        <div class="info">
          <img alt="" class="discount-image" src="../../../assets/front/goods/discount.png">
          <span class="discount">{{ data.ruleName != null ? data.ruleName : '无' }}</span>
        </div>
      </div>
      <div class="row">
        <label>商品类型</label>
        <div class="info">
          <span>虚拟卡（电子卡密）</span>
        </div>
      </div>
      <div class="row">
        <label>适用人群:</label>
        <div class="info">
          {{ data.type }}
        </div>
      </div>


      <div class="row">
        <label>购买数量:</label>
        <div class="info">
          <el-input-number @change="changeHandle" v-model="dataForm.number" max="10" min="1"
                           size="small"></el-input-number>
        </div>
      </div>

      <div class="row">
        <label>服务承诺:</label>
        <div class="info">
          <img class="property-icon" alt="" src="../../../assets/front/goods/property-icon-1.png">
          <span class="service-tag">专业品质</span>
          <img alt="" class="property-icon" src="../../../assets/front/goods/property-icon-2.png">
          <span class="service-tag">官方直营</span>
          <img alt="" class="property-icon" src="../../../assets/front/goods/property-icon-3.png">
          <span class="service-tag">随时改</span>
          <img alt="" class="property-icon" src="../../../assets/front/goods/property-icon-4.png">
          <span class="service-tag">随时退</span>
        </div>
      </div>
      <div class="operate">
        <div class="consult-btn" @click="consultHandle">
          <img class="consult-icon" src="../../../assets/front/goods/consult.png" alt="">
          <span class="">立即咨询</span>
        </div>
        <div class="pay-btn" @click="pay">立即付款</div>
      </div>


    </div>
  </div>
  <el-divider/>
  <!--  商品简介-->
  <div class="goods-content">
    <el-descriptions title="商品摘要信息" :size="'large'" :column="3" border>
      <el-descriptions-item label="商品名称" label-align="center">{{ data.title }} - {{ data.title }}
      </el-descriptions-item>
      <el-descriptions-item label-align="center" label="体检类型">{{ data.type }}</el-descriptions-item>
      <el-descriptions-item label="适用人群" label-align="center">
        <span class="tags" v-for="(item,index) in data.tags" :key="index">{{ item }}</span>
      </el-descriptions-item>
      <el-descriptions-item label-align="center" label="体检机构">
        浙江省杭州市滨江区健康体检中心
      </el-descriptions-item>
      <el-descriptions-item label-align="center" label="体检项目">
        {{ data.checkupCount }}个
      </el-descriptions-item>
      <el-descriptions-item label="有效期" label-align="center">一年</el-descriptions-item>
    </el-descriptions>

    <el-divider/>
    <!--    商品详细-->
    <div class="detail">
      <fieldset>
        <legend>体检项目明细</legend>
        <div v-if="data.count_1>0">
          <h4 class="detail-title">科室检查 {{ data.count_1 }}个项目</h4>
          <table class="detail-table">
            <tr v-for="(item,index) in data.checkup_1" :key="index">
              <th>{{ item.title }}</th>
              <td>{{ item.content }}</td>
            </tr>
          </table>
        </div>

        <div v-if="data.count_2>0">
          <h4 class="detail-title">实验室检查 {{ data.count_2 }}个项目</h4>
          <table class="detail-table">
            <tr v-for="(item,index) in data.checkup_2" :key="index">
              <th>{{ item.title }}</th>
              <td>{{ item.content }}</td>
            </tr>
          </table>
        </div>
        <div v-if="data.count_3>0">
          <h4 class="detail-title">医技检查 {{ data.count_3 }}个项目</h4>
          <table class="detail-table">
            <tr v-for="(item,index) in data.checkup_3" :key="index">
              <th>{{ item.title }}</th>
              <td>{{ item.content }}</td>
            </tr>
          </table>
        </div>

        <div v-if="data.count_4>0">
          <h4 class="detail-title">科室检查 {{ data.count_4 }}个项目</h4>
          <table class="detail-table">
            <tr v-for="(item,index) in data.checkup_4" :key="index">
              <th>{{ item.title }}</th>
              <td>{{ item.content }}</td>
            </tr>
          </table>
        </div>
      </fieldset>
    </div>


    <!--    预约内容-->


  </div>

  <div class="goods-reserve">
    <fieldset>
      <legend>预约须知</legend>
      <el-descriptions title="" class="descriptions" :size="'large'" :column="1" border>
        <el-descriptions-item label-align="center" label="预约时间" style="width: 300px;">
          该医院支持提前预约，若要预约当天请在08:30前下单
        </el-descriptions-item>
        <el-descriptions-item label="营业时间" label-align="center">
          周一至周五08:00-10:30
        </el-descriptions-item>
        <el-descriptions-item label-align="center" label="体检地点">
          浙江省杭州市滨江区滨江路348号中医药健康体检中心
        </el-descriptions-item>
        <el-descriptions-item label="体检凭证" label-align="center">
          体检当天凭借预约成功短信，现场出示身份证即可体检
        </el-descriptions-item>
        <el-descriptions-item label="订单退款" label-align="center">
          如客户预约成功后选择退款，需扣除套餐实付金额的10%作为服务费。最高扣款金额不超过80元
        </el-descriptions-item>
        <el-descriptions-item label="注意事项" label-align="center">
          当您预约套餐时，即表示接受检测的所有项目。如因自身原因放弃体检套餐中的检查项目
        </el-descriptions-item>
        <el-descriptions-item label="发票申请" label-align="center">
          请在体检后到“我的订单”中申请，如需了解开票具体流程，可在提交订单后及时联系客服
        </el-descriptions-item>
      </el-descriptions>
    </fieldset>
    <fieldset>
      <legend>线上预约优势</legend>
      <div class="content">

        <div class="advantages">

          <div class="card">
            <div class="left"><span>提前确认,到院可检</span></div>
            <div class="right"><span>提前选择体检时间、体检套餐，避免部分医院预约号紧缺，而导致当天无法挂号</span></div>
          </div>
          <div class="card">
            <div class="left"><span>省事方便,无需提前排队</span></div>
            <div class="right"><span>体检当天携带身份证到院打印体检单，即可开始体检，无需排队缴费。</span></div>
          </div>
          <div class="card">
            <div class="left"><span>电话通知,临时改期</span></div>
            <div class="right"><span>预约成功后如需改期，可提前电话告知客服，灵活安排行程。</span></div>
          </div>
          <div class="card">
            <div class="left"><span>享受优惠,节省费用</span></div>
            <div class="right"><span>线上体检套餐，享受团体体检优惠价格，大部分可享医院价的7-9折。</span></div>
          </div>

        </div>
        <div class="timeline">
          <ul>
            <li>
              <img src="../../../assets/front/goods/timeline-icon-1.png" class="list-image">
              <div class="list-line"></div>
              <div class="list-tag">
                <img src="../../../assets/front/goods/timeline-tag-1.png" alt="">
                <span>1</span>
              </div>
              <div class="list-content">
                <h4>购买体检套餐</h4>
                <p>确定订单无误后，完成线上支付</p>
              </div>
            </li>
            <li>

              <img src="../../../assets/front/goods/timeline-icon-2.png" class="list-image">
              <div class="list-line"></div>
              <div class="list-tag">
                <img src="../../../assets/front/goods/timeline-tag-2.png" alt="">
                <span>2</span>
              </div>
              <div class="list-content">
                <h4>完成预约体检</h4>
                <p>填写体检人信息及体检日期</p>
              </div>
            </li>

            <li>

              <img src="../../../assets/front/goods/timeline-icon-3.png" class="list-image">
              <div class="list-line"></div>
              <div class="list-tag">
                <img src="../../../assets/front/goods/timeline-tag-3.png" alt="">
                <span>3</span>
              </div>
              <div class="list-content">
                <h4>到院体检</h4>
                <p>到院出示身份证，领取体检单体检</p>
              </div>
            </li>
            <li>

              <img src="../../../assets/front/goods/timeline-icon-4.png" class="list-image">
              <div class="list-line"></div>
              <div class="list-tag">
                <img src="../../../assets/front/goods/timeline-tag-4.png" alt="">
                <span>4</span>
              </div>
              <div class="list-content">
                <h4>获取体检报告</h4>
                <p>根据医院情况，到前台登记自取或自费邮寄</p>
              </div>
            </li>

          </ul>

        </div>

      </div>
    </fieldset>


    <fieldset>
      <legend>体检注意事项</legend>
      <div class="content">
        <ul class="caution-list">
          <li class="item">
            <div class="left">体检前</div>
            <div class="right">
              <ul>
                <li>体检前一天请您清淡饮食,勿饮酒、勿劳累。体检当天请空腹、体检前一天要注意休息，晚上8点后不再进食。</li>
                <li>避免剧烈运动和情绪激动，保证充足睡眠，以免影响体检结果。</li>
                <li>例假期间不宜做妇科、尿液检查。</li>
              </ul>
            </div>
          </li>
          <li class="item">
            <div class="left">体检中</div>
            <div class="right">
              <ul>
                <li>需空腹检查的项目为抽血、腹部B超、数字胃肠，胃镜及其它标注的体检项目。</li>
                <li>做膀胱、子宫、附件B超时请勿排尿，如无尿需饮水至膀胱充盈。做妇科检查前应排空尿。</li>
                <li>未婚女性不做妇科检查;怀孕的女性请预先告知医护人员,不安排做放射及其他有影响的检查。</li>
                <li>做放射线检查前,请您除去身上佩戴的金银、玉器等饰物。</li>
                <li>核磁共振检查，应禁止佩带首饰、手表、传呼、手机等金属物品，磁卡也不应带入检查室，以防消磁.</li>
              </ul>
            </div>
          </li>
          <li class="item">
            <div class="left">体检后</div>
            <div class="right">
              <ul>
                <li>全部项目完毕后请您务必将体检单交到前台。</li>
                <li>请您认真听取医生的建议,及时复查,随诊或进一步检查治疗。</li>
                <li>请您保存好体检结果，以便和下次体检结果作对照，也可作为您就医时的资料</li>
              </ul>
            </div>
          </li>

        </ul>
      </div>
    </fieldset>
  </div>


</template>
<script lang="ts" setup>


import {reactive} from "vue";

const dataForm = reactive({
  number: 1

})
const data = reactive({
  code: 'VHN45MY98',
  title: '敬老感恩中级套餐',
  img: 'http://localhost:9000/his/front/goods/1.jpg',
  description: '感恩季到检钜惠,适用人群：中、老年人及心血管疾病者',
  type: '父母体检',
  initialPrice: '2249',
  currentPrice: '2100',
  ruleName: null,
  tags: ['中老年', '男性', '女性'],
  checkup_1: [
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    }
  ],
  checkup_2: [
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    }
  ],
  checkup_3: [
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    },
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    }
  ],
  checkup_4: [
    {
      title: '一般健康检查',
      content: '身高，体重，血压，心，肺，肝，脾，神经系统'
    }
  ],
  count_1: 3,
  count_2: 3,
  count_3: 4,
  count_4: 1,
  checkupCount: 20
})
const pay = () => {

}
const changeHandle = () => {
}
const consultHandle = () => {

}
</script>
<style lang="less" scoped>
@import "goods.less";
</style>