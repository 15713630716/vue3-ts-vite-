<template>
  <div class="box pointer-events-all">
    <div class="change-list">
      <div class="thead">
        <div class="section" style="padding-left: 70px;">设备</div>
        <div class="date">接入时间</div>
        <div class="status">状态</div>
      </div>
      <div v-for="(item, index) in lists" :key="index"
        :class="['change-cell cursor-pointer', index % 2 !== 0 ? 'change-cell-odd' : '', activeIndex == index ? 'actove-video' : '']"
        @click="openDialog(item, index)">
        <div class="section">
          <img src="../../assets/guankong/qiang-logo.png" alt="">
          <div class="text-style1">
            {{ item.deviceAlias || item.deviceName }}
          </div>
        </div>
        <div class="date">
          <el-tooltip class="box-item" effect="dark" :content="item.accessTime" placement="top">
            <div class="text-style">
              {{ item.accessTime?.slice(0, 10) }}
            </div>
          </el-tooltip>
        </div>
        <div class="status">
          <img v-if="item.deviceStatus === 1" src="../../assets/guankong/lixian.png" alt="">
          <img v-if="item.deviceStatus === 2" src="../../assets/guankong/zaixian.png" alt="">
          {{ item.deviceStatus === 1 ? '离线' : '在线' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getMvLists } from '@/request/guankong'
import { ref, onMounted } from 'vue';

const lists = ref([] as any)

onMounted(() => {
  getLists()
})

const getLists = async () => {
  const res = await getMvLists()
  lists.value = res.list
  // console.log(lists.value)
}

const activeIndex = ref()
const openDialog = (item: any, index: any) => {
  activeIndex.value = index
  console.log(item);
}

</script>
<style lang="scss" scoped>
.box {
  width: 100%;

  .change-list {
    width: 100%;

    .thead {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #87D5FF;
      justify-content: space-between;
      margin-bottom: 10px;
      margin-top: 20px;
    }

    .change-cell {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #fff;
      justify-content: space-between;
      margin-bottom: 8px;
      background: rgba(4, 80, 120, 0.45);
      border: 0.6px solid rgba(108, 204, 255, 0.47);
      border-radius: 4px;
    }

    .section {
      width: 188px;
      text-align: center;
      display: flex;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-left: 10px;
      }
    }

    .date {
      width: 120px;
      text-align: left;
    }

    .status {
      width: 70px;
      text-align: left;

      img {
        width: 10px;
        height: 10px;
        margin-right: 6px;
      }
    }
  }
}
</style>