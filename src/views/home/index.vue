<template>
  <div class="home-box pointer-events-none">
    <iframe ref="iframeRef" :src="iframeSrc" frameborder="0" class="iframeRef pointer-events-all"></iframe>
    <div class="home pointer-events-none">
      <Header v-model:quanping="quanping" :showRoute="showRoute" :iframeDomCZ="iframeDomCZ"
        :iframeDomdxbtk="iframeDomdxbtk" :iframeDomdxbtg="iframeDomdxbtg"></Header>
      <div class="main" v-show="quanping">
        <Index v-if="showRoute == 1"></Index>
        <JianShe v-if="showRoute == 2" :iframeDomsgfzmn="iframeDomsgfzmn" :iframeDomjianseqi="iframeDomjianseqi">
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
    <VideoPop></VideoPop>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import Index from '../index/index.vue';
import QianQi from '../prophase/index.vue'
import JianShe from '../construct/index.vue'
import WeiLai from '../future/index.vue'
import VideoPop from '@/components/VideoPop.vue';

const iframeSrc = `${import.meta.env.BASE_URL}beiao/index.html`;


const iframeRef = ref<HTMLIFrameElement | any>();
const iframeRefCZ = ref<HTMLIFrameElement | any>();//重置
const iframeDomCZ = ref<HTMLIFrameElement | any>();//传递给header重置，不同情景下不同的重置
const iframeDomdxbtk = ref<HTMLIFrameElement | any>();//透明开
const iframeDomdxbtg = ref<HTMLIFrameElement | any>();//透明关
const iframeDomjianseqi = ref<HTMLIFrameElement | any>();//建设期
const iframeDomqqkc = ref<HTMLIFrameElement | any>();//前期
const iframeDomwlba = ref<HTMLIFrameElement | any>();//未来
const iframeDomdgx = ref<HTMLIFrameElement | any>();//高程分析
const iframeDomdxfx = ref<HTMLIFrameElement | any>();//地形勘察
const iframeDomyxhy = ref<HTMLIFrameElement | any>();//影像还原
const iframeDomsgfzmn = ref<HTMLIFrameElement | any>();//施工仿真模拟
const quanping = ref<boolean>(true)//全屏

onMounted(() => {
  iframeRef.value.onload = () => {
    const iframeDocument = iframeRef.value.contentWindow;
    iframeDomCZ.value = iframeDocument.document.getElementById('CZ')
    iframeRefCZ.value = iframeDocument.document.getElementById('CZ')
    iframeDomdxbtk.value = iframeDocument.document.getElementById('dxbtk')
    iframeDomdxbtg.value = iframeDocument.document.getElementById('dxbtg')
    iframeDomjianseqi.value = iframeDocument.document.getElementById('jianseqi')
    iframeDomqqkc.value = iframeDocument.document.getElementById('qqkc')
    iframeDomwlba.value = iframeDocument.document.getElementById('wlba')
    iframeDomdgx.value = iframeDocument.document.getElementById('dgx')
    iframeDomyxhy.value = iframeDocument.document.getElementById('yxhy')
    iframeDomsgfzmn.value = iframeDocument.document.getElementById('sgfzmn')
    iframeDomdxfx.value = iframeDocument.document.getElementById('dxfx')
  }
})


const showRoute = ref<number>(1)
const getRoute = (num: number) => {
  // 跳转进行总体重置的内容
  iframeDomdxbtg.value.click()//透明关闭
  iframeDomyxhy.value.click()//影像还原
  iframeDomCZ.value.click()//重置跳转


  if (num == 1) {
    //回首页并重置
    showRoute.value = num
    iframeRefCZ.value.click()
    iframeDomCZ.value = iframeRefCZ.value

  } else if (num == 2) {
    // 去建设期
    showRoute.value = num
    iframeDomjianseqi.value.click()
    iframeDomCZ.value = iframeDomjianseqi.value
  } else if (num == 3) {
    // 前期
    showRoute.value = num
    iframeDomqqkc.value.click()
    iframeDomCZ.value = iframeDomqqkc.value
  } else if (num == 4) {
    // 未来
    showRoute.value = num
    iframeDomwlba.value.click()
    iframeDomCZ.value = iframeDomwlba.value
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
    background: url('@/assets/img/home/蒙版层@2x.png') no-repeat;
    background-size: 100%;

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