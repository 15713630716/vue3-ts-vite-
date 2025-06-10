<template>
  <div class="header">
    <div class="left">{{ date }} {{ time }} <span>{{ week }}</span></div>
    <div class="center">北岙水库数字孪生应用</div>
    <div class="right-box">
      <div class="right pointer-events-all">
        <div class="item1" v-if="(showRoute != 2 && showRoute != 3)" :class="item1Show == true ? 'active1' : ''"
          @click="getClick(1)"></div>
        <div class="item2" :class="item2Show == true ? 'active2' : ''" @click="getClick(2)"></div>
        <div class="item3" @click="getClick(3)"></div>
      </div>
      <div class="link pointer-events-all" @click="getClick(4)"><img src="../assets/img/home/navigation-icon.png"
          alt="">工作平台</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTime } from '@/utils/useTime';
import { ref, type PropType } from 'vue';
import { getUe } from '@/utils/getUe';

const { date, time, week } = useTime();

const props = defineProps({
  iframeDomCZ: {
    type: Object,
    required: true,
  },
  // 透明开
  iframeDomdxbtk: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  },
  // 透明关
  iframeDomdxbtg: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  },
  // 全屏控制
  quanping: {
    type: Boolean
  },
  // 全屏控制
  showRoute: {
    type: Number
  },
});
const emit = defineEmits(['update:quanping'])

const item1Show = ref<Boolean>(false)
const item2Show = ref<Boolean>(false)
const getClick = (num: number) => {
  if (num == 1) {
    item1Show.value = !item1Show.value
    if (item1Show.value) {
      props.iframeDomdxbtk.click()
    } else {
      props.iframeDomdxbtg.click()
    }
  }
  if (num == 2) {
    // 全屏
    item2Show.value = !item2Show.value
    // 修改父组件值
    emit('update:quanping', !props.quanping)

  }
  if (num == 3) {
    // props.iframeDomCZ.click()
    getUe(props.iframeDomCZ)
    item1Show.value = false
    item2Show.value = false
  }
  if (num == 4) {
    getUe({ type: 'tiaozhuan', url: 'https://zhgl.zjdyit.com/zhjg3/#/1894712966457069569/1813759284281929730/info/personalPortal' })
    // window.open('https://zhgl.zjdyit.com/zhjg3/#/1894712966457069569/1813759284281929730/info/personalPortal', '_blank')
  }
}

</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 80px;
  background: url('@/assets/img/home/头部@2x.png') no-repeat;
  background-size: 100%;
  display: flex;
  // align-items: center;
  justify-content: space-between;

  .left {
    width: 300px;
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
    width: 300px;
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
        background: url('../assets/img/home/编组\ 6@2x.png') no-repeat;
        background-size: 100%;
      }

      .item2 {
        background: url('../assets/img/home/编组\ 6备份\ 2@2x.png') no-repeat;
        background-size: 100%;
      }

      .item3 {
        background: url('../assets/img/home/编组\ 6备份\ 3@2x.png') no-repeat;
        background-size: 100%;
      }

      .active1 {
        background: url('../assets/img/home/编组\ 6@2x\(1\).png') no-repeat;
        background-size: 100%;
      }

      .active2 {
        background: url('../assets/img/home/编组\ 6备份\ 2@2x\(1\).png') no-repeat;
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
</style>