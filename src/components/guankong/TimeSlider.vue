<template>
  <div class="box  pointer-events-all">
    <div class="top">
      <div class="title"><img src="../../assets/guankong/anquanmao.png" alt=""> 人员定位</div>
      <div class="time">
        <el-date-picker v-model="times" @change="changeDate()" value-format="YYYY-MM-DD" type="date" />
        <div class="cz" @click="getCZ()"></div>
      </div>
    </div>
    <TimeAxle v-model:modelValue="modelValue" :dataTimes="dataTimes"></TimeAxle>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import { getUe } from '@/utils/getUe';
import TimeAxle from './TimeAxle.vue';

const modelValue = ref(0)
const dataTimes = ref([] as any)
watch(
  () => modelValue.value,
  () => {
    // console.log('mod', modelValue.value);
    const time = modelValue.value + Math.floor(dayjs(`${times.value} 00:00:00`).valueOf() / 1000)
    //7.1 12点到7.1 13点  总差值3705   setup:14.4
    // console.log('time', modelValue.value);
    if (time > 1751342360) {
      const setup = Math.floor((time - 1751342360) / 14.4)
      if (setup > 257) {
        getUe({ time: 257 })
      } else {
        getUe({ time: setup })
      }
    } else {
      getUe({ time: -1 })
    }
  }
)

const times = ref(dayjs(new Date()).format('YYYY-MM-DD'))
const changeDate = () => {
  const currentTime = Math.floor(dayjs(`${times.value} 00:00:00`).valueOf() / 1000)
  if (currentTime == 1751299200) {
    dataTimes.value = [{
      startTime: 43200,
      valueTime: 3600
    }]
  } else {
    dataTimes.value = []
  }

  // getUe({ time: currentTime.value })
  // console.log(dataTimes.value);
}
const getCZ = () => {
  times.value = dayjs(new Date()).format('YYYY-MM-DD')
  modelValue.value = 0
  dataTimes.value = []
  const time = modelValue.value + Math.floor(dayjs(`${times.value} 00:00:00`).valueOf() / 1000)
  getUe({ time: time })
}

</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 8px;
  background: rgba(3, 60, 93, 0.48);
  background-image: linear-gradient(-27deg, rgba(63, 118, 170, 0.00) 98%, rgba(63, 118, 170, 0.40) 100%);
  border: 1px solid #3CBAF7;
  box-shadow: inset 0 0 19px 0 rgba(88, 207, 255, 0.72);

  .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .title {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #E6F7FF;
      width: 350px;
      background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);

      img {
        width: 30px;
        height: 30px;
      }
    }

    .time {
      display: flex;
      align-items: center;

      .cz {
        width: 30px;
        height: 30px;
        cursor: pointer;
        margin: 0 10px 0 20px;
        background: url('@/assets/img/home/编组\ 6备份\ 3@2x.png') no-repeat;
        background-size: 100%;
      }
    }

    :deep(.el-date-editor--date) {
      background: rgba(16, 169, 235, 0.53);
      border: 1px solid rgba(61, 194, 255, 0.35);
      border-radius: 4px;
    }

    :deep(.el-range-input) {
      color: #E6F7FF;
    }

    :deep(.el-input__inner) {
      color: #E6F7FF;
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
      background: rgba(0, 179, 255, 0.13);
    }
  }
}
</style>