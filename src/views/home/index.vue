<template>
  <div class="home-box pointer-events-none">
    <div class="home pointer-events-none">
      <div class="headers">
        <div class="left">{{ date }} {{ time }} <span>{{ week }}</span>
          <img v-if="tianqiRes == 1" src="../../assets/weather/qing.png" alt="" style="margin-right: 10px;">
          <img v-if="tianqiRes == 2" src="../../assets/weather/yin.png" alt="" style="margin-right: 10px;">
          <img v-if="tianqiRes == 3" src="../../assets/weather/yu.png" alt="" style="margin-right: 10px;">
          <img v-if="tianqiRes == 4" src="../../assets/weather/xue.png" alt="" style="margin-right: 10px;">
          <el-switch size="small" v-model="tianqiValue" @change="getWeatherSwitch()" class="pointer-events-all" />
        </div>
        <div class="center">北岙水库数字孪生应用</div>
        <div class="right-box">
          <div class="right pointer-events-all">
            <!-- <div class="item1" v-if="(showRoute != 2 && showRoute != 3)" :class="item1Show == true ? 'active1' : ''"
              @click="getClick(1)"></div> -->
            <div class="item2" :class="item2Show == true ? 'active2' : ''" @click="getClick(2)"></div>
            <div class="item3" @click="getClick(3)"></div>
          </div>
          <div class="link pointer-events-all" @click="getClick(4)"><img src="@/assets/img/home/navigation-icon.png"
              alt="">工作平台</div>
        </div>
      </div>
      <div class="main" v-show="quanping">
        <Index v-if="showRoute == 1" :mvs="mvs"></Index>
        <JianShe ref="jianSheDom" v-if="showRoute == 2" :iframeDomsgfzmn="iframeDomsgfzmn">
        </JianShe>
        <QianQi v-if="showRoute == 3" :iframeDomdgx="iframeDomdgx" :iframeDomyxhy="iframeDomyxhy"
          :iframeDomdxfx="iframeDomdxfx" :iframeDomqqkc="iframeDomqqkc"></QianQi>
        <WeiLai v-if="showRoute == 4"></WeiLai>
      </div>
      <div class="nav">
        <div class="home-nav pointer-events-all" v-show="showRoute == 1" @click="getRoute(2)">
          <div style="margin-top: 25px;">
            <div class="top"></div>
            <div class="home-icon"></div>
          </div>
        </div>
        <div class="nav-two pointer-events-all" v-show="showRoute == 2 || showRoute == 3 || showRoute == 4">
          <div style="margin-top: 20px;">
            <div class="top">
              <div class="item qianqi" @click="getRoute(3)">
                <div class="logo" :class="showRoute == 3 ? 'active' : ''"></div>
                <div class="text">前期勘查</div>
              </div>
              <div class="item jianshe" @click="getRoute(2)">
                <div class="logo" :class="showRoute == 2 ? 'active' : ''"></div>
                <div class="text">建设北岙</div>
              </div>
              <div class="item weilai" @click="getRoute(4)">
                <div class="logo" :class="showRoute == 4 ? 'active' : ''"></div>
                <div class="text">未来北岙</div>
              </div>
            </div>
            <div class="home-icon" @click="getRoute(1)"></div>
          </div>
        </div>
      </div>
    </div>
    <VideoPop :mvs="mvs"></VideoPop>
    <EnvironmentPop></EnvironmentPop>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import { useTime } from '@/utils/useTime';
import Index from '../index/index.vue';
import QianQi from '../prophase/index.vue'
import JianShe from '../construct/index.vue'
import WeiLai from '../future/index.vue'
import VideoPop from '@/components/VideoPop.vue';
import EnvironmentPop from '@/components/EnvironmentPop.vue';
import { getUe } from '@/utils/getUe';
import { getMv } from '@/request/home'
import axios from 'axios';
import { useStoreWeather } from '@/store';

const storeWeather = useStoreWeather()

// 接收信息触发点击树放弹窗
watch(
  () => storeWeather.weather,
  () => {
    tianqiValue.value = storeWeather.weather
  }
);

const tianqiValue = ref(false)
const tianqiRes = ref(1)
const getWeather = async () => {
  await axios({
    url: 'https://devapi.qweather.com/v7/weather/now?location=120.661029,28.882479&key=88cfe0ee021344dab0ac4b200b918483',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get',
  }).then(function (res) {
    if (res.data.code == '200') {
      // console.log('res', res.data);
      if (res.data.now.icon < 154) {
        tianqiRes.value = 2
      }
      if (res.data.now.icon == 100 || res.data.now.icon == 150) {
        tianqiRes.value = 1
      }
      if (res.data.now.icon >= 300 && res.data.now.icon < 400) {
        tianqiRes.value = 3
      }
      if (res.data.now.icon >= 400 && res.data.now.icon < 500) {
        tianqiRes.value = 4
      }
      if (res.data.now.icon >= 500 && res.data.now.icon < 516) {
        tianqiRes.value = 2
      }
    }
  }).catch(function (err) {
    console.log('err', err)
  });
}
const getWeatherSwitch = () => {
  getUe({ type: 'tianqi', id: tianqiValue.value == true ? tianqiRes.value - 1 : '0' })
  storeWeather.setWeatherStore(tianqiValue.value)
}

//mv
const mvs = ref([] as any)
const getMvs = async () => {
  const res6 = await Promise.all([getMv('8623e37a5efe42a48f1c87a79583fac9'), getMv('4204b8db903a438396364057b926bf43'), getMv('3f6c62cfa6cc4b1898baca7c29b8b491'), getMv('627dc630369a4876858f35d0f11f9e59'), getMv('26ad8bf3a50c42f48c5759ec190be633')])
  // console.log('res6', res6);
  // const res1 = await getMv('adcea4b72f8f4de2a3f8c6c42d7bd67e')//施工进场道闸
  // const res2 = await getMv('85186de42f6b40fcade625be8de952d0')//下游临时贝雷桥
  // const res3 = await getMv('bb69dd176f924ac5a8129769a20e159c')//办公区停车场1
  // const res4 = await getMv('b5db6df92aff49bf9956a95d2a6bdf23')//左岸全球机
  // const res5 = await getMv('157ae8e2aef94ffb9d278abe99dcf513')//右岸全球机
  mvs.value = [
    {
      name: '施工进场道闸',
      url: res6[0]
    },
    {
      name: '下游临时贝雷桥',
      url: res6[1]
    },
    {
      name: '办公区停车场1',
      url: res6[2]
    },
    {
      name: '左岸全球机',
      url: res6[3]
    },
    {
      name: '右岸全球机',
      url: res6[4]
    },
  ]
}
onMounted(async () => {
  await getMvs()
  await getWeather()
});


// const iframeSrc = `${import.meta.env.BASE_URL}beiao/index.html`;
const jianSheDom = ref()
const { date, time, week } = useTime();
const item1Show = ref<Boolean>(false)
const item2Show = ref<Boolean>(false)
const getClick = async (num: number) => {
  if (num == 1) {
    item1Show.value = !item1Show.value
    if (item1Show.value) {
      iframeDomdxbtk.value.click()
    } else {
      iframeDomdxbtg.value.click()
    }
  }
  if (num == 2) {
    // 全屏
    item2Show.value = !item2Show.value
    quanping.value = !quanping.value

  }
  if (num == 3) {
    if (iframeDomCZ.value.type == 'qiehuan_cz') {
      // 直接刷新当前页面（可能会从浏览器缓存加载）
      window.location.href = '#/index';
      window.location.reload();
    }
    //恢复当前场景初始视角
    getUe(iframeDomCZ.value)
    //天气恢复默认晴天
    getUe({ type: 'tianqi', id: 0 })
    getUe({ type: 'shigongmoniEnd' })
    getUe({ type: 'xunjianEnd' })
    //未来北岙闸门关闭
    getUe({ type: 'zhamen', value: false })
    // tianqiValue.value = false
    storeWeather.setWeatherStore(false)
    item1Show.value = false
    item2Show.value = false
    if (iframeDomCZ.value.type == 'qiehuan_jsba') {
      await nextTick()
      if (jianSheDom.value) {
        jianSheDom.value.getNav1(0);
      }
    }
  }
  if (num == 4) {
    getUe({ type: 'url', url: 'https://zhgl.zjdyit.com/zhjg3/#/1894712966457069569/1813759284281929730/info/personalPortal' })
  }
}

const iframeDomCZ = ref<any>({ type: 'qiehuan_cz' });//传递给header重置，不同情景下不同的重置
const iframeDomdxbtk = ref<HTMLIFrameElement | any>();//透明开
const iframeDomdxbtg = ref<HTMLIFrameElement | any>();//透明关
const iframeDomqqkc = ref<HTMLIFrameElement | any>();//前期
const iframeDomdgx = ref<HTMLIFrameElement | any>();//高程分析
const iframeDomdxfx = ref<HTMLIFrameElement | any>();//地形勘察
const iframeDomyxhy = ref<HTMLIFrameElement | any>();//影像还原
const iframeDomsgfzmn = ref<HTMLIFrameElement | any>();//施工仿真模拟
const quanping = ref<boolean>(true)//全屏


const showRoute = ref<number>(1)
const getRoute = (num: number) => {
  // 跳转进行总体重置的内容
  getUe({ type: 'zhilianggo' })
  getUe({ type: 'anquanzhongxingo' })
  getUe({ type: 'guankonggo' })
  getUe({ type: 'luanshenggo' })
  getUe({ type: 'fangzhengo' })
  getUe({ type: 'shigongmoniEnd' })
  getUe({ type: 'xunjianEnd' })
  getUe({ type: 'zhamen', value: false })



  showRoute.value = num
  if (num == 1) {
    //回首页并重置
    iframeDomCZ.value = { type: 'qiehuan_cz' }
    getUe({ type: 'qiehuan_cz' })
  } else if (num == 2) {
    // 去建设期
    iframeDomCZ.value = { type: 'qiehuan_jsba' }
    getUe({ type: 'qiehuan_jsba' })
    // jianSheDom.value?.getNav1(0);
  } else if (num == 3) {
    // 前期
    iframeDomCZ.value = { type: 'qiehuan_qqkc' }
    getUe({ type: 'qiehuan_qqkc' })
  } else if (num == 4) {
    // 未来
    iframeDomCZ.value = { type: 'qiehuan_wlba' }
    getUe({ type: 'qiehuan_wlba' })
  }
}


</script>
<style lang="scss" scoped>
.home-box {
  width: 100%;
  height: 100%;

  .iframeRef {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .home {
    width: 100%;
    height: 100%;
    // background: radial-gradient(circle at center, #fff 0%, #595d5f 100%);
    // background: url('@/assets/img/home/mengban.png') no-repeat;
    background-size: 100% 100%;

    .headers {
      width: 100%;
      height: 80px;
      background: url('@/assets/img/home/头部@2x.png') no-repeat;
      background-size: 100%;
      display: flex;
      // align-items: center;
      justify-content: space-between;

      .left {
        width: 350px;
        height: 30px;
        font-family: 'DS-Digital', sans-serif;
        font-weight: bold;
        font-size: 24px;
        color: #FFFFFF;
        line-height: 30px;
        text-align: left;
        margin-top: 35px;
        margin-left: 32px;
        display: flex;
        align-items: center;

        span {
          display: inline-block;
          width: 63px;
          font-family: DS-Digital, DS-Digital;
          font-weight: bold;
          font-size: 18px;
          text-align: right;
          padding-top: 2px;
        }

        img {
          width: 26px;
          height: 26px;
          cursor: pointer;
          margin-left: 15px;
        }
      }

      .center {
        width: 400px;
        height: 50px;
        margin-top: 10px;
        font-family: AlibabaPuHuiTi_2_95_ExtraBold;
        font-size: 36px;
        color: #FFFFFF;
        line-height: 50px;
        letter-spacing: 4px;
        text-align: center;
        font-weight: bold;
      }

      .right-box {
        width: 350px;
        margin-top: 15px;
        margin-right: 32px;
        display: flex;
        justify-content: end;
        align-items: center;

        .right {
          // width: 170px;
          height: 46px;
          background: rgba(13, 78, 112, 0.63);
          border-radius: 29px;
          border: 1px solid rgba(37, 147, 205, 0.49);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 8px;

          div {
            width: 30px;
            height: 30px;
            cursor: pointer;
            margin: 0 8px;
          }

          .item1 {
            background: url('@/assets/img/home/编组\ 6@2x.png') no-repeat;
            background-size: 100%;
          }

          .item2 {
            background: url('@/assets/img/home/编组\ 6备份\ 2@2x.png') no-repeat;
            background-size: 100%;
          }

          .item3 {
            background: url('@/assets/img/home/编组\ 6备份\ 3@2x.png') no-repeat;
            background-size: 100%;
          }

          .active1 {
            background: url('@/assets/img/home/编组\ 6@2x\(1\).png') no-repeat;
            background-size: 100%;
          }

          .active2 {
            background: url('@/assets/img/home/编组\ 6备份\ 2@2x\(1\).png') no-repeat;
            background-size: 100%;
          }
        }

        .link {
          height: 46px;
          background: rgba(13, 78, 112, 0.63);
          border-radius: 29px;
          border: 1px solid rgba(37, 147, 205, 0.49);
          width: 115px;
          margin-left: 15px;
          font-size: 15px;
          line-height: 46px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            margin-left: 10px;
          }
        }
      }
    }

    .main {
      width: 100%;
      height: 900px;
    }
  }

  .nav {
    width: 100%;
    height: 88px;
    background: url('@/assets/img/home/底部装饰@2x.png') no-repeat;
    background-position-y: 0px;
    background-size: 100%;
    position: fixed;
    bottom: 0;

    .home-nav {
      cursor: pointer;
      width: 460px;
      height: 102px;
      background: url('@/assets/img/home/底部半圆@2x.png') no-repeat;
      background-size: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      left: 730px;

      .top {
        margin-top: 10px;
        width: 112px;
        height: 27px;
        background: url('../../assets/img/home/文字4x.png') no-repeat;
        background-size: 100%;
      }

      .home-icon {
        width: 93px;
        height: 65px;
        background: url('../../assets/gif/箭头.png/ba3eb79ef931bdc4fe362d8f46d2ea7f848657f14619e-qEtWxh.png') no-repeat;
        background-position-x: 8px;
        background-position-y: -5px;
        background-size: 100%;
      }
    }

    .nav-two {
      margin-top: 25px;
      width: 460px;
      height: 102px;
      background: url('../../assets/img/jiansheqi/bottom-yuan.png') no-repeat;
      background-size: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      left: 730px;

      .top {
        width: 112px;
        height: 27px;
        font-family: MicrosoftYaHeiSemibold;
        font-size: 20px;
        color: #FFFFFF;
        line-height: 27px;
        letter-spacing: 8px;
        text-align: left;
        font-style: normal;


        .item {
          width: 80px;
          position: absolute;
          cursor: pointer;

          .logo {
            width: 68px;
            height: 68px;
            margin: 0 auto;
          }

          .text {
            width: 90px;
            height: 27px;
            font-family: MicrosoftYaHeiSemibold;
            font-size: 20px;
            color: #FFFFFF;
            line-height: 27px;
            text-align: left;
            letter-spacing: 1px;
            font-style: normal;
          }
        }

        .qianqi {
          bottom: 18px;
          left: 49px;

          .logo {
            background: url('../../assets/img/nav/前期.png') no-repeat;
            background-size: 100%;
          }

          .active {
            background: url('../../assets/img/nav/前期-选中.png') no-repeat;
            background-size: 100%;
          }
        }

        .jianshe {
          bottom: 50px;
          left: 190px;

          .logo {
            background: url('../../assets/img/nav/建设.png') no-repeat;
            background-size: 100%;
          }

          .active {
            background: url('../../assets/img/nav/建设-选中.png') no-repeat;
            background-size: 100%;
          }
        }

        .weilai {
          bottom: 19px;
          right: 50px;

          .logo {
            background: url('../../assets/img/nav/未来.png') no-repeat;
            background-size: 100%;
          }

          .active {
            background: url('../../assets/img/nav/未来-选中.png') no-repeat;
            background-size: 100%;
          }
        }
      }

      .home-icon {
        cursor: pointer;
        width: 75px;
        height: 45px;
        background: url('../../assets/img/home/返回首页2x.png') no-repeat;
        background-size: 100% 100%;
        margin-left: 20px;
      }
    }
  }
}
</style>