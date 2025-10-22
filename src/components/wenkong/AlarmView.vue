<template>
  <div class="alarmBox" v-if="storeAlarm.alarm?.alarmShow">
    <div class="left"></div>
    <div class="right">
      报警信息：{{ storeAlarm.alarm?.treeName
      }}{{ storeAlarm.alarm?.alarmShow }}。建议操作：检查混凝土，进行{{
        storeAlarm.alarm?.alarmShow == "过高" ? "降温" : "保温"
      }}
    </div>
    <div class="close" @click="getClose">
      <el-icon><CloseBold /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStoreAlarm } from "@/store";

const storeAlarm = useStoreAlarm();

const getClose = () => {
  storeAlarm.setAlarmStore({});
};
</script>
<style lang="scss" scoped>
.alarmBox {
  position: absolute;
  width: 400px;
  height: auto;
  top: 85px;
  left: 760px;
  display: flex;
  align-items: center;
  // border: 2px solid yellow;
  background-color: rgba($color: #eb0a0a, $alpha: 0.5);
  .left {
    width: 60px;
    height: 60px;
    background: url("../../assets/wenkong/alarm-logo.png") no-repeat;
    background-size: 100% 100%;
    background-color: rgba($color: #f7c204, $alpha: 1);
  }
  .right {
    width: 340px;
    height: 60px;
    background: url("../../assets/wenkong/alarm-bg.png") no-repeat;
    background-size: 100% 100%;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #ffffff;
    color: yellow;
    letter-spacing: 0;
    text-align: justify;
    font-weight: 400;
    line-height: 23px;
    padding: 2px 30px 2px 15px;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    color: rgb(249, 245, 245);
    pointer-events: all;
    cursor: pointer;
    font-size: 18px;
  }
}
</style>
