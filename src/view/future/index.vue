<template>
  <div class="index pointer-events-none">
    <div class="nav pointer-events-all">
      <div class="item" v-for="(item, index) in navs" :key="item.name" :class="item.active == true ? 'active' : ''"
        @click="getNav1(index)">
        <img :src="item.img" alt="">
        <div class="title">{{ item.name }}</div>
        <div class="active-nav" v-if="item.active && navItems[index]">
          <div class="nav-item" :class="navItemActive == true ? 'nav-item-active' : ''"
            v-for="(navItem, itemIndex) in navItems[index]" :key="navItem.id" @click.stop="getNav2(itemIndex, index)">
            {{ navItem.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="pop" v-if="popIndex == 1">
      <div class="header">
        发电厂升压站
        <div class="after pointer-events-all" @click="getPop(0)"></div>
      </div>
      <div class="img">
        <img src="../../assets/img/weilai/img.jpg" alt="">
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
    </div>
    <div class="pop" v-if="popIndex == 2">
      <div class="header">
        发电引水隧洞
        <div class="after pointer-events-all" @click="getPop(0)"></div>
      </div>
      <div class="img">
        <img src="../../assets/img/weilai/img.jpg" alt="">
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
    </div>
    <div class="pop" v-if="popIndex == 3">
      <div class="header">
        管理区
        <div class="after pointer-events-all" @click="getPop(0)"></div>
      </div>
      <div class="img">
        <img src="../../assets/img/weilai/img.jpg" alt="">
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        以“山水间立志，天地间筑梦”为精神轴线，构建六大叙事篇章，通过顺时针展线参观，将可视化内容展陈与科技设备巧妙融合，增强观者的体验感‌。
      </div>
    </div>
    <div class="pop" v-if="popIndex == 4">
      <div class="header">
        重力拱坝
        <div class="after pointer-events-all" @click="getPop(0)"></div>
      </div>
      <div class="img">
        <img src="../../assets/img/weilai/gongba.jpg" alt="">
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        仙居北岙水库重力拱坝坝高113米是浙江省少数几座百米高坝之一。物理力学特性上重力拱坝具有拱坝和重力坝的优点，结构安全度很高，对温度和水位变化适应性好，体型优美达到力与美和谐统一。
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        浙水设计全面研究了近百年来全球拱坝和重力坝建设情况，在北岙水库坝型和泄水建筑物设计上做了重要创新，除了能更好地满足防洪、供水等常规的水库功能外，还首次提出了把高坝本身作为宝贵资源，系统地打造北岙高拱坝建筑景观和水景观，希望北岙水库工程成为仙居新的网红打卡点，为地区社会经济高质量发展作出更大的贡献。
      </div>
      <div class="item-text">
        <img src="../../assets/img/weilai/logo.png" alt="">
        利用高坝资源，在坝后设置 多层瀑布-彩虹飞渡-巨龙奔腾 等创新设计理念，将拦河坝泄放水与坝后水景观结合，打造主题景观效果。
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import img1 from '@/assets/img/weilai/img1.png'
import { getUe } from '@/utils/getUe'
import { onMounted, ref, watch } from 'vue'
import { ueStoreJson } from '@/store';

const storeUe = ueStoreJson();

watch(
  () => storeUe.ueStore,
  () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore?.type == 'futureTag') {
        setTimeout(() => {
          popIndex.value = storeUe.ueStore?.id
        }, 2500);
      }
    }
  }
);

const navs = ref([
  {
    name: '运行模拟',
    img: img1,
    active: false,
  },
])
const navItems = ref([
  [
    {
      name: '泄洪模拟',
      active: false,
      id: '1'
    }
  ]
])

const navItemActive = ref(false)

onMounted(() => {
  getUe({ type: 'zhamen', value: navItemActive.value })
})
const popIndex = ref(0)
const getPop = (num: any) => {
  popIndex.value = num
}
const getNav1 = (indexs: number) => {
  navs.value.map((item: any, index: number) => {
    if (indexs == index) {
      item.active = true
    } else {
      item.active = false
    }
  })
}
const getNav2 = (indexs: number, index: number) => {
  navItems.value[index].map((item: any, itemIndex: number) => {
    if (indexs == itemIndex) {
      item.active = true
    } else {
      item.active = false
    }
  })
  if (index == 0) {
    //运行模拟
    if (indexs == 0) {
      //闸门模拟
      navItemActive.value = !navItemActive.value
      getUe({ type: 'zhamen', value: navItemActive.value })
    }
  }
}


</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  position: relative;

  .nav {
    width: 266px;
    margin-top: 85px;
    padding-left: 28px;

    .item {
      width: 72px;
      margin-bottom: 23px;
      cursor: pointer;
      position: relative;

      img {
        width: 54px;
        height: 54px;
        margin-left: 6px;
      }

      .title {
        width: 72px;
        height: 26px;
        font-family: MicrosoftYaHeiSemibold;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 26px;
        text-align: left;
        font-style: normal;
      }

      .active-nav {
        position: absolute;
        top: 0;
        right: -170px;
        width: 148px;

        .nav-item {
          width: 100%;
          height: 34px;
          margin-bottom: 16px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 34px;
          text-align: center;
          background: url('../../assets/img/jiansheqi/nav-item.png') no-repeat;
          background-size: 100%;
        }

        .nav-item-active {
          background: url('../../assets/img/jiansheqi/nav-item-active.png') no-repeat;
          background-size: 100%;
        }
      }
    }

    .active {
      position: relative;

      &::after {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        left: -30px;
        top: 20px;
        background: url('../../assets/img/jiansheqi/nav-active.png') no-repeat;
        background-size: 100%;
      }
    }
  }
  .pop {
    width: 410px;
    // height: 543px;
    position: absolute;
    top: -40px;
    right: 28px;
    background: url('../../assets/img/weilai/pop-bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 21px 24px;

    .header {
      width: 100%;
      height: 35px;
      line-height: 35px;
      font-family: MicrosoftYaHeiSemibold;
      font-size: 18px;
      color: #FFFFFF;
      background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);
      padding-left: 16px;
      position: relative;

      .after {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 7px;
        right: 0px;
        background: url('../../assets/img/weilai/cha.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .img {
      width: 100%;
      height: 200px;
      padding: 12px 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .item-text {
      width: 100%;
      padding: 5px 5px;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 32px;
      margin-bottom: 10px;

      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
}
</style>