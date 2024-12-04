<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import SvgIcon from "../../../components/SvgIcon.vue";
import goodsService from "../../../api/goods";
import router from "../../../router";

const {proxy} = getCurrentInstance()
const radio = ref(null)
const buyHandle = (id) => {
  router.push({
    name: 'FrontGoods', params: {
      id: id
    }
  })
}
const condition = reactive({
  type: [
    {
      name: '不限', active: true
    },
    {
      name: '父母体检', active: false
    }, {
      name: '入学体检', active: false
    },
    {
      name: '入职体检', active: false
    },
    {
      name: '职场白领', active: false
    }, {
      name: '个人高端', active: false
    },
    {
      name: '中青年体检', active: false
    }
  ],
  sex: [
    {
      name: '不限', active: true
    },
    {
      name: '男性', active: false
    },
    {
      name: '女性', active: false
    }
  ],
  priceType: [
    {
      name: '不限', active: true
    },
    {
      name: '0~100', value: 1, active: false
    },
    {
      name: '100~500', value: 2, active: false
    },
    {
      name: '500~1000', value: 3, active: false
    },
    {
      name: '1000以上', value: 4, active: false
    }
  ]
})
const selectHandle = (name, val) => {
  condition[name].forEach(function (one) {
    if (one.name === val) {
      one.active = true
      if (name != 'priceType') {
        dataForm[name] = one.name == '不限' ? null : one.name
      } else {
        dataForm[name] = one.name == '不限' ? null : one.value
      }
    } else {
      one.active = false
    }
  })
  goodsData.dataList = []
  goodsData.pageIndex = 1;
  goodsData.totalCount = 0
  goodsData.isLast = false
  loadGoodsList()

}
const priceSort = reactive({
  icon: 'sort-default',
  type: 'default'
})
const dataForm = reactive({
  keyword: null,
  type: null,
  sex: null,
  priceType: null,
  orderType: null
})
const load = () => {
  if (goodsData.isLast) {
    return
  }
  goodsData.pageIndex++;
  loadGoodsList()
}
const goodsData = reactive({
  dataList: [],
  pageIndex: 1,
  pageSize: 12,
  isLast: false,
  totalCount: 0

})
const loadGoodsList = () => {
  if (goodsData.isLast) {
    return
  }
  let json = {
    keyword: dataForm.keyword,
    sex: dataForm.sex,
    type: dataForm.type,
    orderType: dataForm.orderType,
    priceType: dataForm.priceType,
    pageIndex: goodsData.pageIndex,
    pageSize: goodsData.pageSize
  }
  goodsService.searchGoodsList(json, res => {
    if (res.code === 200) {
      let page = res.page
      if (page.list == null) {
        goodsData.isLast = true
        goodsData.pageIndex--;
      } else {
        for (let one of page.list) {
          one.img = `${proxy.$minioUrl}/his/${one.image}`
        }
        goodsData.dataList = goodsData.dataList.concat(page.list)
        goodsData.totalCount = page.totalCount
      }


    }
  }, err => {

  })


}
const selectPrice = () => {
  radio.value = null
  if (priceSort.type === 'default') {
    priceSort.icon = 'sort-asc'
    priceSort.type = 'asc'
    dataForm.orderType = 3
  } else if (priceSort.type === 'asc') {
    priceSort.icon = 'sort-desc'
    priceSort.type = 'desc'
    dataForm.orderType = 4
  } else if (priceSort.type === 'desc') {
    priceSort.icon = 'sort-asc'
    priceSort.type = 'asc'
    dataForm.orderType = 3
  }
  goodsData.dataList = []
  goodsData.pageIndex = 1;
  goodsData.totalCount = 0
  goodsData.isLast = false
  loadGoodsList()
}
const selectRadio = (value: string) => {
  priceSort.icon = 'sort-default'
  priceSort.type = 'default'
  if (value === '最新') {
    dataForm.orderType = 1
  } else if (value === '销量') {
    dataForm.orderType = 2
  }
  goodsData.dataList = []
  goodsData.isLast = false
  goodsData.totalCount = 0
  goodsData.pageIndex = 1
  loadGoodsList()


}

window.scrollTo(0, 0)
let keyword = router.currentRoute.value.query.keyword
if (keyword == '' || keyword == null) {
  dataForm.keyword = null
} else {
  dataForm.keyword = keyword
}
loadGoodsList()
</script>

<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{name:'FrontIndex'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
      </el-breadcrumb-item>
      体检套餐列表
    </el-breadcrumb>

    <div class="search-rows">
      <el-row class="row" :gutter="0">
        <el-col :span="2"><span class="label">【分类】</span></el-col>
        <el-col :span="2" v-for="one in condition.type">
          <span :class="one.active?'item active ':'item' " @click="selectHandle('type',one.name)">{{ one.name }}</span>
        </el-col>
      </el-row>
      <el-row class="row" :gutter="0">
        <el-col :span="2"><span class="label">【性别】</span></el-col>
        <el-col :span="2" v-for="one in condition.sex">
          <span :class="one.active?'item active ':'item' " @click="selectHandle('sex',one.name)">{{ one.name }}</span>
        </el-col>
      </el-row>
      <el-row class="row" :gutter="0">
        <el-col :span="2"><span class="label">【价格区间】</span></el-col>
        <el-col :span="2" v-for="one in condition.priceType">
          <span :class="one.active?'item active ':'item' " @click="selectHandle('priceType',one.name)">{{
              one.name
            }}</span>
        </el-col>
      </el-row>
    </div>


    <div class="search-filter">
      <el-radio-group v-model="radio" @change="selectRadio">
        <el-radio label="最新" size="large">最新</el-radio>
        <el-radio label="销量" size="large">销量</el-radio>
      </el-radio-group>
      <div class="sort-operate" @click="selectPrice">
        <span>价格</span>
        <svg-icon :name="priceSort.icon" class="sort-icon"/>
      </div>
    </div>


    <div class="goods-container">
      <el-empty :image-size="200" v-if="goodsData.dataList.length==0" description="无体检套餐"></el-empty>
      <ul class="goods-list" v-infinite-scroll="load">
        <li class="item" v-for="(one,index) in goodsData.dataList " :key="index"
            :style="(index+1)%4==0?'margin-right:0': ''">
          <div class="card">
            <img :src="one.img" alt="">
            <h4>{{ one.title }}</h4>
            <el-tooltip class="box-item" effect="dark" placement="top">
              <template #content>
                <div style="width: 260px;">
                  {{ one.description }}
                </div>
              </template>
              <p class="desc">
                <span>折</span>
                {{ one.description }}
              </p>
            </el-tooltip>
            <p class="price">
              <span class="current">{{ one.currentPrice }}</span>
              <span class="old">{{ one.initialPrice }}</span>
              <span class="sale">已售 {{ one.salesVolume }}</span>
            </p>
            <input type="button" class="buy-btn" @click="buyHandle(one.id)" value="立即购买">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "goods_list.less";
</style>