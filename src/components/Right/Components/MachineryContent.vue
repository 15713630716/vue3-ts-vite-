<!--  -->
<template>
  <div class="machinery-content">
    <div class="header flex-box">
      <div :class="['header-child', active === 1 ? 'header-child-active' : '']" @click="changeActive(1)">
        <div class="header-total">{{ total }}</div>
        <div class="header-name">机械总投入</div>
      </div>
      <div :class="['header-child', active === 2 ? 'header-child-active' : '']" @click="changeActive(2)">
        <div class="header-total">{{ dayTotal }}</div>
        <div class="header-name">当日投入</div>
      </div>
      <div :class="['header-child', active === 3 ? 'header-child-active' : '']" @click="changeActive(3)">
        <div class="header-total">{{ monthTotal }}</div>
        <div class="header-name">月度投入</div>
      </div>
    </div>
    <div class="center-box">
      <div v-for="(item, index) in perData" :key="index" class="flex-box center-child">
        <img src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/right_jiantou.png" alt="" />
        <div class="center-name">{{ item.mechanicalTypeName }}</div>
        <div class="progress">
          <el-progress :percentage="item.progress" :show-text="false" :color="customColors" />
        </div>
        <div class="center-total">{{ item.count }}</div>
      </div>
    </div>
    <div class="table-title" style="display: flex; align-items: center">
      <div class="name">设备列表</div>
    </div>
    <div class="change-list">
      <div class="thead">
        <div>序号</div>
        <div>设备</div>
        <div>类型</div>
        <div>进场时间</div>
        <div>状态</div>
      </div>
      <vue3ScrollSeamless :key="active" :data-list="tableData" style="height: 400px; overflow: hidden" :class-option="scrollDefaultOption">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          :class="['change-cell', index % 2 !== 0 ? 'change-cell-odd' : '']"
          @click="openMachineryDetail(item)"
          @dblclick="locateItem(item)"
        >
          <div>
            <div class="index">
              <div class="index-box">{{ index + 1 }}</div>
            </div>
          </div>
          <div class="section">
            <el-tooltip class="box-item" effect="dark" :content="item.deviceName" placement="top">
              <div class="text-style">
                {{ item.deviceName }}
              </div>
            </el-tooltip>
          </div>
          <div class="name">{{ item.mechanicalTypeName }}</div>
          <div class="date">
            <el-tooltip class="box-item" effect="dark" :content="item.entryTime" placement="top">
              <div class="text-style">
                {{ item.entryTime }}
              </div>
            </el-tooltip>
          </div>
          <div class="status">
            <div v-if="item.deviceStatus === 1" class="status-red"></div>
            <div v-if="item.deviceStatus === 2" class="status-green"></div>
            {{ item.deviceStatus === 1 ? '退场' : '在场' }}
          </div>
        </div>
      </vue3ScrollSeamless>
      <machineryDetailDialog ref="machineryDetail"></machineryDetailDialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import { useSectionStore } from '@/stores'
import ConstructionApi from '@/api/modular/Construction/construction.js'
import machineryDetailDialog from '../../Dialog/MachineryDetailDialog.vue'

const props = defineProps({
  workArea: {
    type: String,
    default: ''
  }
})

const sectionStore = useSectionStore()
const clickTimeId = ref(null)
const total = ref(0)
const dayTotal = ref(0)
const monthTotal = ref(0)
const active = ref(1)
const perData = ref({})
const customColors = [
  { color: '#DFE0E1', percentage: 50 },
  { color: '#1DE1E1', percentage: 80 },
  { color: '#1886F4', percentage: 100 }
]

const scrollDefaultOption = {
  step: 0.8, // 数值越大速度滚动越快
  limitMoveNum: 9, // 开始无缝滚动的数据量
  hoverStop: true, // 是否开启鼠标悬停stop
  direction: 1, // 0向下 1向上 2向左 3向右
  openWatch: true, // 开启数据实时监控刷新dom
  singleHeight: 50, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
  waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
}

const tableData = ref([])

onMounted(() => {
  getMechanicalPage()
  getConstructionMechanicalTypeCount()
  getMechanicalData()
})

const locateItem = (item) => {
  const paramsMessage = {
    messageType: 'locate',
    entityType: 'machine',
    res: item.id
  }
  // 取消上次延时未执行的方法
  clearTimeout(clickTimeId.value)
  document.getElementById('myIframe').contentWindow.postMessage(paramsMessage, '*')
}

const { proxy } = getCurrentInstance()
const openMachineryDetail = (item) => {
  // 取消上次延时未执行的方法
  clearTimeout(clickTimeId.value)
  // 执行延时
  clickTimeId.value = setTimeout(() => {
    // 此处为单击事件要执行的代码
    proxy.$refs.machineryDetail.showModal(item)
  }, 250)
}

const changeActive = (item) => {
  active.value = item
  getMechanicalPage()
}

const contrast = (arr) => {
  let maxCount = 0
  arr.forEach((item) => {
    if (item.count > maxCount) {
      maxCount = item.count
    }
  })
  arr.forEach((item) => {
    item.progress = Math.round((item.count / maxCount) * 100)
  })
}

const getConstructionMechanicalTypeCount = () => {
  ConstructionApi.getConstructionMechanicalTypeCount({
    sectionId: sectionStore.currentSection?.id,
    workAreaId: props.workArea
  }).then((res) => {
    perData.value = res.data
    contrast(perData.value)
  })
}

const getMechanicalData = () => {
  ConstructionApi.getMechanicalData({
    sectionId: sectionStore.currentSection?.id,
    workAreaId: props.workArea
  }).then((res) => {
    total.value = res.data.total
    dayTotal.value = res.data.totalByDay
    monthTotal.value = res.data.totalByMonth
  })
}

const getMechanicalPage = () => {
  const params = {
    sectionId: sectionStore.currentSection?.id,
    currentPage: 1,
    pageSize: 9999,
    workAreaId: props.workArea
  }
  if (active.value === 2) {
    params.dayTime = 1
  } else if (active.value === 3) {
    params.monthTime = 1
  }
  ConstructionApi.getMechanicalPage(params).then((res) => {
    tableData.value = res.data
  })
}

watch(
  () => props.workArea,
  (newVal, oldVal) => {
    getMechanicalPage()
    getConstructionMechanicalTypeCount()
    getMechanicalData()
  },
  { immediate: true, deep: true }
)

watch(
  () => sectionStore.currentSection?.id,
  () => {
    getMechanicalPage()
    getConstructionMechanicalTypeCount()
    getMechanicalData()
  }
)
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.machinery-content {
  width: 100%;
  height: 830px;
}
.header {
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
  .header-child {
    width: 150px;
    height: 150px;
    background: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/machinery_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    text-align: center;
    padding-top: 34px;
    .header-total {
      font-family: 优设标题黑;
      color: #fff;
      text-shadow: 0 0 20px #6fb9f5;
      font-size: 34px;
    }
    .header-name {
      font-family: 优设标题黑;
      color: #e6f7ff;
      opacity: 0.7;
      font-size: 18px;
    }
  }
  .header-child-active {
    background: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/machinery_bg_active.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
.center-box {
  width: 100%;
  .center-child {
    font-family: 优设标题黑;
    height: 50px;
    color: #fff;
    font-size: 20px;
    .center-name {
      width: 110px;
    }
    > img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    .center-total {
      text-align: right;
      width: 90px;
    }
  }
}
.progress {
  width: 250px;
  margin: 12px 20px 0 20px;
  :deep(.el-progress-bar__outer) {
    background: #10203d !important;
    border-radius: 0 !important;
    .el-progress-bar__inner {
      border-radius: 0 !important;
    }
  }
}
.table-title {
  width: 100%;
  height: 30px;
  background-image: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/sub_title.png');
  background-size: 100% 100%;
  padding-left: 30px;
  margin-bottom: 10px;
  .name {
    font-family: 优设标题黑;
    font-size: 22px;
    color: #d8edff;
    letter-spacing: 1px;
    line-height: 48px;
    margin-left: 5px;
    text-align: left;
    width: 100%;
    font-weight: normal;
    filter: drop-shadow(#0075ff 0px 0px 8px);
  }
}
.change-list {
  height: 300px;
  .change-cell {
    display: flex;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    font-family: 'Microsoft Yahei';
    font-weight: normal;
    line-height: 50px;
    padding-left: 10px;
    color: #fff;

    &-odd {
      background-color: rgba(0, 59, 163, 0.3);
    }

    > div {
      flex: 1;
      text-align: center;
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .index {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      //   background: rgba(0, 113, 154, 0.2);
      flex-shrink: 0;
      align-items: center;
      color: #fff;
      font-family: 优设标题黑;
      //   box-shadow: inset 0px 3px 21px rgba(50, 197, 255, 0.7);
      margin: 0 auto;
      .index-box {
        text-align: center;
        width: 20px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          right: -15px;
          top: 0;
          width: 50px;
          height: 50px;
          background-repeat: no-repeat;
          background: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/index-blue.png');
          background-size: 50px 50px;
        }
      }
    }
  }

  .thead {
    display: flex;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    font-family: 'Microsoft Yahei';
    font-weight: normal;
    line-height: 40px;
    // padding-left: 10px;
    color: rgb(135, 213, 255);

    > div {
      flex: 1;
      text-align: center;
    }
  }
}
.status {
  display: flex;
  .status-red {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #f00;
    margin: 21px 5px 0 20px;
  }
  .status-green {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #0f0;
    margin: 21px 5px 0 20px;
  }
}
.text-style {
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
