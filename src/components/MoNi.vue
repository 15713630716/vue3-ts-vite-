<template>
  <div class="dam-tree">
    <el-scrollbar height="880px" ref="scrollbarRef">
      <div
        class="item"
        v-for="(item, index) in lists"
        :key="`item.text${index}`"
        :class="item.active == true ? 'active-moni' : ''"
        @click="getItem(index)"
      >
        <div class="line"></div>
        <div class="title">{{ item.name }}</div>
        <div class="time">{{ item.time }}</div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { ueStoreJson } from "@/store";
import { getUe } from "@/utils/getUe";

const lists = ref([
  {
    name: "导流洞开工",
    time: "2023年11月1日",
    text: "",
    active: false,
  },
  {
    name: "导流洞完工",
    time: "2024年7月12日",
    text: "",
    active: false,
  },
  {
    name: "上游导（截）流开始",
    time: "2025年4月1日",
    text: "",
    active: false,
  },
  {
    name: "上游围堰完工",
    time: "2025年6月26日",
    text: "",
    active: false,
  },
  {
    name: "大坝主体开始浇筑",
    time: "2025年9月29日",
    text: "",
    active: false,
  },
  {
    name: "大坝主体完成浇筑",
    time: "2028年1月15日",
    text: "",
    active: false,
  },
  {
    name: "水库开始蓄水",
    time: "2028年2月20日",
    text: "",
    active: false,
  },
]);
const storeUe = ueStoreJson();
const scrollbarRef = ref();
watch(
  () => storeUe.ueStore,
  async () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore?.type == "moniProgress") {
        lists.value.map((item, index) => {
          if (storeUe.ueStore?.value == index) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
        // await nextTick(); // 等待 DOM 更新
        // const targets = document.getElementsByClassName("active-moni")[0];
        // if (targets && scrollbarRef.value) {
        //   // 获取目标元素的 offsetTop（相对于父容器）
        //   const offsetTop = targets.offsetTop - 150;
        //   scrollbarRef.value.setScrollTop(offsetTop);
        // }
      }
    }
  },
  { immediate: true },
);
const getItem = (indexs) => {
  getUe({ type: "moniProgress", value: indexs });
  lists.value.map((item, index) => {
    if (indexs == index) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};
</script>
<style lang="scss" scoped>
.dam-tree {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .item {
    width: 100%;
    height: 125px;
    padding-left: 60px;
    position: relative;
    cursor: pointer;
    .title {
      font-size: 20px;
      color: #fff;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .time {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
    }
    &::after {
      content: " ";
      position: absolute;
      left: 17px;
      top: 32px;
      width: 1px;
      height: 93px;
      border-left: 1px solid rgb(20, 167, 220);
    }
    .line {
      position: absolute;
      left: 5px;
      top: 5px;
      width: 25px;
      height: 25px;
      border: 1px solid rgb(20, 167, 220);
      transform: rotate(45deg);
    }
    &::before {
      content: " ";
      position: absolute;
      left: 10px;
      top: 10px;
      width: 15px;
      height: 15px;
      background-color: rgb(20, 167, 220);
      transform: rotate(45deg);
    }
    &:last-child {
      &::after {
        content: " ";
        position: absolute;
        left: 15px;
        top: 0px;
        width: 1px;
        height: 100%;
        border-left: none;
      }
    }
  }
  .active-moni {
    &::after {
      content: " ";
      position: absolute;
      left: 17px;
      top: 32px;
      width: 1px;
      height: 93px;
      border-left: 1px solid rgb(29, 222, 168);
    }
    .line {
      position: absolute;
      left: 5px;
      top: 5px;
      width: 25px;
      height: 25px;
      border: 1px solid rgb(29, 222, 168);
      transform: rotate(45deg);
    }
    &::before {
      content: " ";
      position: absolute;
      left: 10px;
      top: 10px;
      width: 15px;
      height: 15px;
      background-color: rgb(29, 222, 168);
      transform: rotate(45deg);
    }
    .title {
      color: rgb(29, 222, 168);
    }
  }
}
</style>
