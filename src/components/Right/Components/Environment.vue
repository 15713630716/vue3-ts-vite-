<!--  -->
<template>
  <div class="environment">
    <div style="display: flex; flex-direction: column">
      <div style="display: flex">
        <!-- 顶部左边统计图 start -->
        <div class="r_charts">
          <div style="width: 60%; height: 60%; position: absolute; z-index: 2">
            <enviPieCharts :rate="statisticsData.exitTotal" :rate1="statisticsData.total - statisticsData.exitTotal"></enviPieCharts>
          </div>
          <img class="bk_charts" src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/bk_envi_pie_charts.png" />
        </div>
        <!-- 顶部左边统计图 end -->
        <!-- 右边三个进度条 start -->
        <div style="display: flex; flex-direction: column; flex: 1">
          <rightProgress icon="icon_envi_pro1" title="接入设备" :num="statisticsData.total" :percentage="100"></rightProgress>
          <rightProgress
            icon="icon_envi_pro2"
            title="在线设备"
            :num="statisticsData.total - statisticsData.exitTotal"
            :percentage="(((statisticsData.total - statisticsData.exitTotal) / statisticsData.total) * 100).toFixed(0)"
          ></rightProgress>
          <rightProgress
            icon="icon_envi_pro3"
            title="离线设备"
            :num="statisticsData.exitTotal"
            :percentage="((statisticsData.exitTotal / statisticsData.total) * 100).toFixed(0)"
          ></rightProgress>
        </div>
        <!-- 右边三个进度条 end -->
      </div>
      <!-- 下面四块列表 -->
      <!-- <div class="r_list">
        <bottomListItem v-for="(item, index) in emList" :key="index" :em-data="item" :work-area="workArea"></bottomListItem>
      </div> -->

      <!-- 下面四块列表 -->
      <div class="r_list">
        <div v-for="item in emList" :key="item.id" class="item">
          <div class="header">
            <div class="title">
              <img
                style="width: 27.9px; height: 35px"
                src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/xxdt/big/%E4%BD%8D%E5%9B%BE.png"
                alt=""
              />
              <div class="text">{{ item.deviceName }}</div>
            </div>
            <img
              v-if="item.deviceStatus === 2"
              style="width: 56px; height: 24px"
              src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/xxdt/big/%E5%9C%A8%E7%BA%BF.png"
              alt=""
            />
            <img
              v-else
              style="width: 56px; height: 24px"
              src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/xxdt/big/%E7%A6%BB%E7%BA%BF.png"
              alt=""
            />
          </div>
          <div class="content">
            <div v-for="(subItem,index) in environmentTypes" :key="'subItem' + index" class="content-item" @click="showDialogBtn(item, '噪音')">
              <div class="name">{{  `${subItem.label}(${item[subItem.value+'Warn'] || '-'})` }}</div>
              <div :class="[classFn(item, subItem),'value']">
                {{ item?.emPushInfo[subItem.value] || '-'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <environmentDialog ref="detailRef" :env-type-list="environmentTypes" :current-row="currentRow"/>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSectionStore } from '@/stores'
import ConstructionApi from '@/api/modular/xjba/construction.js'
import bottomListItem from '../../Envi/BottomListItem.vue'
import enviPieCharts from '../../Envi/EnviPieCharts.vue'
import rightProgress from '../../Envi/RightProgress.vue'
import environmentDialog from '../../Dialog/EnvironmentDialogNew.vue'

const props = defineProps({
  workArea: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['handleZero'])
const sectionStore = useSectionStore()
const emList = ref([])
const statisticsData = ref({
  exitTotal: 0,
  total: 0
})
const detailRef = ref(null)
const getPageData = () => {
  // ConstructionApi.getPageData({ sectionId: sectionStore.currentSection?.id, workAreaId: props.workArea }).then((res) => {
  //   statisticsData.value = res.data
  // })
}

const currentRow = ref(null)
const showDialogBtn = (item, title) => {
  currentRow.value = item
  detailRef.value.showModal(item, title)
}

const environmentTypes = [
  { label: '噪音', value: 'noise' },
  { label: '湿度', value: 'humidity' },
  { label: 'pm10', value: 'pm10' },
  { label: 'pm25', value: 'pm25' },
  { label: '温度', value: 'temperature' },
  { label: '风向', value: 'windDirection' },
  { label: '风力', value: 'windPower' },
  { label: '风速', value: 'windSpeed' },
  { label: 'tsp', value: 'tsp' }
]
const classFn = (item, subItem) => {
  if (item.deviceStatus !== 2) return 'value-white'
  if (item?.emPushInfo[subItem.value] > item[subItem.value + 'Warn']) return 'value-red'
}
const getEmList = () => {
  ConstructionApi.getEnvironmentAssociation({
    sectionId: sectionStore.currentSection?.id,
    currentPage: 1,
    pageSize: 9999,
    hasLastPushData: true,
    workAreaId: props.workArea
  }).then((res) => {
    emList.value = res.data.list
    statisticsData.value.total = res.data.list.length
    statisticsData.value.exitTotal = res.data.list.filter((item) => item.deviceStatus !== 2).length
  })
}

watch(
  () => props.workArea,
  (newVal, oldVal) => {
    getEmList()
    getPageData()
  },
  { immediate: true, deep: true }
)

watch(
  () => sectionStore.currentSection?.id,
  () => {
    getEmList()
    getPageData()
  }
)
</script>
<style lang="scss" scoped>
.environment {
  width: 100%;
  height: 600px;
}

.r_charts {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.bk_charts {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  animation-name: mymove;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes mymove {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.r_list {
  height: 590px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: auto;

  .item {
    width: 476px;
    background: rgba(0, 40, 85, 0.38);
    border: 1px solid rgba(165, 194, 215, 0.6);
    border-radius: 6px;
    padding: 6px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      width: 100%;
      border-bottom: 1px dashed rgba(114, 147, 171, 0.61);
      .title {
        display: flex;
        gap: 8px;
        align-items: center;
        .text {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 500;
        }
      }
    }
    .content {
      margin-top:10px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 10px;
      width: 100%;
      .content-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 100%;
        width: 32%;
        .name {
          font-size: 16px;
          color: #ffffff;
          font-weight: 500;
        }
        .value {
          font-family: D-DIN-PRO-ExtraBold;
          font-size: 24px;
          color: #00da40;
          font-weight: 900;
        }
        .value-red {
          color: #f45656;
        }
        .value-white {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
