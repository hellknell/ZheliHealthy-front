<template>
  <div>
    <!--    四个卡片-->
    <img src="../../assets/front/index/banner.webp" alt="" class="banner">
    <div class="service-container">
      <div class="service">
        <img src="../../assets/front/index/service-icon-1.png" alt="">
        <div>
          <h4>体检预约</h4>
          <p>一站式预约服务</p>
        </div>
      </div>
      <div class="service">
        <img src="../../assets/front/index/service-icon-2.png" alt="">
        <div>
          <h4>报告查询</h4>
          <p>体检报告开始查询</p>
        </div>
      </div>

      <div class="service">
        <img src="../../assets/front/index/service-icon-3.png" alt="">
        <div>
          <h4>活动热卖</h4>
          <p>当季推荐特惠商品</p>
        </div>
      </div>

      <div class="service">
        <img src="../../assets/front/index/service-icon-4.png" alt="">
        <div>
          <h4>企业专区</h4>
          <p>企业专属健康服务</p>
        </div>
      </div>

    </div>

    <!--    商品展示页-->
    <div class="goods-container">
      <nav>
        <h3>活动专区</h3>
        <el-link :icon="Plus" :underline="false" @click="moreHandle">查看更多</el-link>
      </nav>
      <ul class="goods-list">
        <li class="item" v-for="(one,index) in goodsData.part_1" :key="index">
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


    <div class="goods-container">
      <nav>
        <h3>热卖套餐</h3>
        <el-link :icon="Plus" :underline="false" @click="moreHandle">查看更多</el-link>
      </nav>
      <ul class="goods-list">
        <li class="item" v-for="(one,index) in goodsData.part_2" :key="index">
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

    <div class="goods-container">
      <nav>
        <h3>新品推荐</h3>
        <el-link :icon="Plus" :underline="false" @click="moreHandle">查看更多</el-link>
      </nav>
      <ul class="goods-list">
        <li class="item" v-for="(one,index) in goodsData.part_3" :key="index">
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
    <div class="goods-container">
      <nav>
        <h3>孝敬父母</h3>
        <el-link :icon="Plus" :underline="false" @click="moreHandle">查看更多</el-link>
      </nav>
      <ul class="goods-list">
        <li class="item" v-for="(one,index) in goodsData.part_4" :key="index">
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
    <div class="goods-container">
      <nav>
        <h3>白领精英</h3>
        <el-link :icon="Plus" :underline="false" @click="moreHandle">查看更多</el-link>
      </nav>
      <ul class="goods-list">
        <li class="item" v-for="(one,index) in goodsData.part_5" :key="index">
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
    <div class="partner-container">
      <h3>&nbsp;&nbsp;--合作伙伴--&nbsp;&nbsp; </h3>
      <el-carousel :autoplay="true" pause-on-hover height="220px">
        <el-carousel-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c1.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c2.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c3.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c4.png">
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c5.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c6.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c7.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c8.png">
            </el-col>
          </el-row>
        </el-carousel-item>
        <el-carousel-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c9.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c10.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c11.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c12.png">
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c13.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c14.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c15.png">
            </el-col>
            <el-col :span="6">
              <img class="logo" src="../../assets/front/index/c16.png">
            </el-col>
          </el-row>

        </el-carousel-item>

      </el-carousel>
    </div>

  </div>


</template>
<script setup lang="ts">
// import {}
import {Plus} from "@element-plus/icons-vue";
import {getCurrentInstance, onMounted, reactive} from "vue";
import goodsService from "../../api/goods";
import router from "../../router";

const {proxy} = getCurrentInstance()
onMounted(() => {
  let partId = [1, 2, 3, 4, 5]
  let json = {
    partIds: partId
  }
  goodsService.searchIndexGoods(json, res => {
    if (res.code === 200) {
      for (let one of res.result['1']) {
        one.img = `${proxy.$minioUrl}/his/${one.image}`
      }
      goodsData["part_1"] = res.result['1']

      for (let one of res.result['2']) {
        one.img = `${proxy.$minioUrl}/his/${one.image}`
      }
      goodsData["part_2"] = res.result['2']
      for (let one of res.result['3']) {
        one.img = `${proxy.$minioUrl}/his/${one.image}`
      }
      goodsData["part_3"] = res.result['3']

      for (let one of res.result['4']) {
        one.img = `${proxy.$minioUrl}/his/${one.image}`
      }
      goodsData["part_4"] = res.result['4']

      for (let one of res.result['5']) {
        one.img = `${proxy.$minioUrl}/his/${one.image}`
      }
      goodsData["part_5"] = res.result['5']
    }
  }, err => {


  })
})
const buyHandle = (id) => {
  router.push({
    name: 'FrontGoods', params: {
      id: id
    }
  })
}
const moreHandle = () => {
  router.push({name: 'FrontGoodsList'})
}
const goodsData = reactive({

  part_1: [],
  part_2: [],
  part_3: [],


})

</script>

<style scoped lang="less">
@import "index.less";
</style>