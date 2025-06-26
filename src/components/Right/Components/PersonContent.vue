<!--  -->
<template>
  <div class="person-content">
    <div class="table-title" style="display: flex; align-items: center">
      <div class="name">人员定位</div>
    </div>
    <div class="pie-charts" @click="openPosition">
      <personPieCharts :pie-data="pieData"></personPieCharts>
      <img class="bk_charts" src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/pie_bg.png" />
      <div class="pie-child flex-box">
        <div class="flex-box text-base">
          <div class="blue-box text-base"></div>
          在线数量
        </div>
        <div class="flex-box text-base">
          <div class="green-box"></div>
          离线数量
        </div>
      </div>
    </div>
    <div class="table-title" style="display: flex; align-items: center; margin: 20px 0">
      <div class="name">人员考勤</div>
    </div>
    <div class="progress-box flex-box" @click="openAttendance">
      <el-progress type="circle" width="200" :percentage="statisticsData.per * 100" :show-text="false" stroke-width="10"> </el-progress>
      <img src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/progress-bg.png" class="progress-bg" alt="" />
      <img class="bk_progress" src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/bk_envi_pie_charts.png" />
      <div class="progress-right flex-box">
        <div class="flex-box progress-right-child">
          <div>今日出勤</div>
          <div>
            <span class="progress-right-num">{{ statisticsData.countOfToday }}</span
            >人
          </div>
        </div>
        <div class="flex-box progress-right-child">
          <div>出勤率</div>
          <div>
            <span class="progress-right-num">{{ (statisticsData.per * 100).toFixed(2) }}</span
            >%
          </div>
        </div>
      </div>
    </div>
    <div class="person-bottom flex-box">
      <div class="person-bottom-child">
        <div>
          <img
            src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person-left.png"
            class="bottom-img"
            alt=""
          />出勤总人数
        </div>
        <div>
          <span class="bottom-num">{{ statisticsData.countOfTotal }}</span
          >人
        </div>
      </div>
      <div class="person-bottom-child">
        <div>
          <img
            src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person-right.png"
            class="bottom-img"
            alt=""
          />月出勤人数
        </div>
        <div>
          <span class="bottom-num">{{ statisticsData.countOfMonth }}</span
          >人
        </div>
      </div>
    </div>
    <positioningDialog ref="positioning" :pie-data="pieData"></positioningDialog>
    <attendanceDialog ref="attendance" :statistics-data="statisticsData"></attendanceDialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from 'vue'
import { useSectionStore } from '@/stores'
import ConstructionApi from '@/api/modular/Construction/construction.js'
import attendanceDialog from '../../Dialog/AttendanceDialog.vue'
import positioningDialog from '../../Dialog/positioningDialog.vue'
import personPieCharts from '../../Envi/PersonPieCharts.vue'

const props = defineProps({
  workArea: {
    type: String,
    default: ''
  }
})
const sectionStore = useSectionStore()
const { proxy } = getCurrentInstance()
const statisticsData = ref({})
const workAreaId = ref('')
const pieData = ref({})

const getQueryEmployeeSummary = () => {
  ConstructionApi.getQueryEmployeeSummary({
    sectionId: sectionStore.currentSection?.id,
    workAreaId: props.workArea
  }).then((res) => {
    pieData.value = res.data
  })
}
const getQueryAttendanceSummary = () => {
  ConstructionApi.getQueryAttendanceSummary({
    sectionId: sectionStore.currentSection?.id,
    workAreaId: props.workArea
  }).then((res) => {
    statisticsData.value = res.data
  })
}

watch(
  () => props.workArea,
  (newVal, oldVal) => {
    workAreaId.value = newVal
    getQueryAttendanceSummary()
    getQueryEmployeeSummary()
  },
  { immediate: true, deep: true }
)
const openPosition = () => {
  proxy.$refs.positioning.showModal()
}
const openAttendance = () => {
  proxy.$refs.attendance.showModal()
}
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.person-content {
  width: 100%;
  height: 600px;
  margin-left: 30px;
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
.pie-charts {
  width: 100%;
  height: 200px;
  position: relative;
  .pie-child {
    width: 40%;
    position: absolute;
    bottom: -22px;
    left: 32%;
    color: #fff;
    justify-content: space-between;
  }
}
.blue-box {
  width: 10px;
  height: 10px;
  background: #1777d6;
  margin-top: 4px;
  margin-right: 10px;
}
.green-box {
  width: 10px;
  height: 10px;
  background: #1ee7e8;
  margin-top: 4px;
  margin-right: 10px;
}
.bk_charts {
  position: absolute;
  bottom: 5px;
  left: 62px;
  width: 73%;
  height: 75%;
  z-index: 90;
  animation: imgAnimation 5s infinite linear;
}
@keyframes imgAnimation {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0.5;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.progress-box {
  height: 200px;
  width: 100%;
  position: relative;
  margin: 30px 0;
  .progress-bg {
    position: absolute;
    left: 0;
    top: 33px;
    height: 116px;
    width: 195px;
  }
  :deep(.el-progress) {
    .el-progress-circle {
      svg > path:nth-child(1) {
        stroke: url(#2b496a); // #write 此处的id就是定义的svg标签id 做替换即可
      }
    }
    // background: #2b496a !important;
  }
}

.bk_progress {
  width: 290px;
  height: 290px;
  position: absolute;
  top: -45px;
  left: -45px;
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
.progress-right {
  font-size: 18px;
  color: #d8edff;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 30px;
  padding: 20px 0;
  width: 180px;
  .progress-right-child {
    width: 100%;
    justify-content: space-between;
    line-height: 27px;
  }
}
.progress-right-num {
  font-size: 27px;
  color: #ffc300;
  font-weight: 600;
  text-shadow: 0 0 20px #936c12;
}
.person-bottom {
  justify-content: space-between;
  .person-bottom-child {
    width: 48%;
    height: 100px;
    background-image: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person_bottom_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #d8edff;
    font-size: 18px;
    text-align: center;
    line-height: 45px;
  }
}
.bottom-img {
  width: 30px;
  height: 30px;
  margin-left: -20px;
}
.bottom-num {
  font-weight: 600;
  font-size: 27px;
  color: #fff;
  text-shadow: 0 0 20px #859dc1;
}
</style>
