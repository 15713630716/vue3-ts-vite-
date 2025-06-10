<template>
  <div class="index pointer-events-none">
    <div class="pop" v-if="popIndex == 1">
      <div class="header">
        坝址区
        <div class="after pointer-events-all" @click="getPop(0)"></div>
      </div>
      <div class="img">
        <img src="../../assets/img/weilai/img.png" alt="">
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
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'




onMounted(() => {

})
const popIndex = ref(1)
const getPop = (num: any) => {
  popIndex.value = num
  console.log(popIndex.value);
}


</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  position: relative;

  .pop {
    width: 410px;
    // height: 543px;
    position: absolute;
    top: 19px;
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