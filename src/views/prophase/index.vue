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
    <div class="tuceng pointer-events-all">
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, type PropType, onUnmounted } from 'vue'
import img1 from '@/assets/img/qianqi/dixing.png'
import img2 from '@/assets/img/qianqi/dizhi.png'

const props = defineProps({
  //高程分析
  iframeDomdgx: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  },
  // 影像还原
  iframeDomyxhy: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  }
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
      name: '高程分析',
      active: false,
      id: '1'
    }, {
      name: '卫星还原',
      active: false,
      id: '2'
    }
  ],
  [
    {
      name: '温控有限元',
      active: false,
      id: '1'
    }, {
      name: '应力有限元',
      active: false,
      id: '2'
    }
  ]
])
const getNav1 = (indexs: number) => {
  navs.value.map((item: any, index: number) => {
    if (indexs == index) {
      item.active = true
      getNav2(0, indexs)
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
    //地形勘察
    if (indexs == 0) {
      //高程分析
      console.log('高程分析');
      props.iframeDomdgx.click()
    }
    if (indexs == 1) {
      //卫星还原
      console.log('卫星还原');
      props.iframeDomyxhy.click()
    }
  }
  if (index == 1) {
    //地质勘查
  }
}



onMounted(() => {
  getNav1(0)
})

// 销毁时一切重置
onUnmounted(() => {
  console.log('重置');
})


</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  padding: 0 24px 0 16px;
  position: relative;
  overflow: hidden;

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