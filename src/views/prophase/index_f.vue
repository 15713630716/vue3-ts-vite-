<template>
  <div class="index">
    <div class="nav pointer-events-all">
      <div class="item" v-for="(item, index) in navs" :key="item.name" :class="item.active == true ? 'active' : ''"
        @click="getNav1(index)">
        <img :src="item.img" alt="">
        <div class="title">{{ item.name }}</div>
        <div class="active-nav" v-if="item.active && navItems[index]">
          <div class="nav-item" :class="navItem.active == true ? 'nav-item-active' : ''"
            v-for="(navItem, itemIndex) in navItems[index]" :key="navItem.id" @click.stop="getNav2(itemIndex, index)">
            {{ navItem.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="tuceng pointer-events-all">
      <div class="title">图层控制</div>
      <div class="item">
        <div class="text">村庄</div>
        <div class="switch">
          <el-switch size="small" v-model="tuceng.cunzhuang" />
        </div>
      </div>
      <div class="item">
        <div class="text">现状工程</div>
        <div class="switch">
          <el-switch size="small" v-model="tuceng.xianzhuang" />
        </div>
      </div>
    </div> -->
    <iframe
    ref="outerIframeRef"
 src="https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LGZiYjk0OTQ3LWU0NzYtNGMxNy1iZmU3LWRkYzE5MDIwMGNkMyxjODBjOGYzMi01YWY1LTQwNzMtODliOC01MTkwMmU2ODU4ZTM=" frameborder="0"></iframe>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import img1 from '@/assets/img/qianqi/dixing.png'
import img2 from '@/assets/img/qianqi/dizhi.png'
// import { getUe } from '@/utils/getUe';
import { onMounted, onUnmounted } from 'vue';

// 监听消息函数
const handleMessage = (event: MessageEvent) => {
  if (event.data.type == "PLATFORM_ANNOTATION_CLICK") {
    console.log('收到消息:', event.data);
    getNav1(0)
  }

};
window.addEventListener('message', (event: MessageEvent) => {
  console.log('内部收到消息:', event.data);
});
// 启动监听
onMounted(() => {
  window.addEventListener('message', handleMessage);
  console.log('✅ 消息监听已启动');
});

// 清理监听
onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});


const tuceng = reactive({
  cunzhuang: '',
  xianzhuang: ''
})

const navs = ref([
  {
    name: '地形勘察',
    img: img1,
    active: false,
  },
  {
    name: '地质勘察',
    img: img2,
    active: false
  }
])
const navItems = ref([
  [
    {
      name: '库区红线',
      active: false,
      id: '1'
    }, {
      name: '高程分析',
      active: false,
      id: '2'
    }
  ],
  [
    // {
    //   name: '',
    //   active: false,
    //   id: '1'
    // }, {
    //   name: '',
    //   active: false,
    //   id: '2'
    // }
  ]
])
const getNav1 = (indexs: number) => {
  navs.value.map((item: any, index: number) => {
    if (indexs == index) {
      item.active = true
    } else {
      item.active = false
    }
  })
  navItems.value.map((item: any) => {
    item.map((item: any) => {
      item.active = false
    })
  })
  if (indexs == 1) {
    sendInitMessage()
  }
  // getUe({ type: 'hongXian', value: false })
}
// 发送初始化消息
const outerIframeRef = ref()
const sendInitMessage = () => {
      const outerWindow = outerIframeRef.value.contentWindow
      
      const initMessage = {
        type: 'INIT_MESSAGE_SYSTEM',
        from: 'PARENT_PAGE',
        version: '1.0.0',
      }
      
      // 发送消息
      outerWindow.postMessage(initMessage, '*')
      console.log('initMessage',initMessage);
}

const getNav2 = (indexs: number, index: number) => {
  navItems.value[index].map((item: any, itemIndex: number) => {
    if (indexs == itemIndex) {
      item.active = !item.active
    } else {
      item.active = false
    }
  })
  if (index == 0) {
    //地形勘察
    if (indexs == 0) {
      //库区红线
      // getUe({ type: 'hongXian', value: navItems.value[index][indexs].active })
    } else {
      // getUe({ type: 'hongXian', value: false })
    }
    if (indexs == 1) {
      //高程分析
      // console.log('高程分析');
    }
  } else {
    // getUe({ type: 'hongXian', value: false })
    navItems.value[0].map((item: any) => {
      item.active = false
    })
  }
  if (index == 1) {
    //地质勘查
  } else {
    navItems.value[1].map((item: any) => {
      item.active = false
    })
  }
}


</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  padding: 0 24px 0 16px;
  position: relative;
  overflow: hidden;
  iframe{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  .nav {
    position: relative;
    z-index: 99999;
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

  .tuceng {
    width: 116px;
    background: rgba(9, 88, 148, 0.28);
    border-radius: 8px;
    border: 1px solid rgba(79, 162, 206, 0.41);
    position: absolute;
    bottom: 0px;
    left: 16px;
    padding: 14px 10px;

    .title {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 35px;
      text-align: left;
    }

    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 28px;
        text-align: left;
      }

      .switch {
        transform: scale(0.7);
        cursor: pointer;
      }

    }
  }

}
</style>