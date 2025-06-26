<template>
  <div class="video-content">
    <div class="change-list">
      <div class="thead">
        <div>序号</div>
        <div>设备</div>
        <!-- <div>设备编号</div> -->
        <div>接入时间</div>
        <div>状态</div>
      </div>
      <div
        v-for="(item, index) in tableData"
        :key="index"
        :class="['change-cell cursor-pointer', index % 2 !== 0 ? 'change-cell-odd' : '', activeIndex === index ? 'actove-video' : '']"
        @click="openDialog(item)"
      >
        <div class="cell-index">
          <div class="index">
            <div class="index-box">{{ index + 1 }}</div>
          </div>
        </div>
        <div class="section">
          <el-tooltip class="box-item" effect="dark" :content="item.deviceAlias||item.deviceName" placement="top">
            <div class="text-style1">
              {{ item.deviceAlias || item.deviceName }}
            </div>
          </el-tooltip>
        </div>
        <!-- <div class="name">{{ item.deviceNumber }}</div> -->
        <div class="date">
          <el-tooltip class="box-item" effect="dark" :content="item.accessTime" placement="top">
            <div class="text-style">
              {{ item.accessTime }}
            </div>
          </el-tooltip>
        </div>
        <div class="status">
          <div v-if="item.deviceStatus === 1" class="status-red"></div>
          <div v-if="item.deviceStatus === 2" class="status-green"></div>
          {{ item.deviceStatus === 1 ? '离线' : '在线' }}
        </div>
      </div>
    </div>
    <VideoDialogDialog
      ref="videoRef"
      :show="showVideo"
      :video-id="curVideoId"
      style="position: absolute; z-index: 50;"
      @close="showVideo = false"
    >
    </VideoDialogDialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import { useSectionStore } from '@/stores'
import monitorApi from '@/api/modular/zjsl/monitor.js'

import VideoDialogDialog from '../../Dialog/VideoDialog.vue'

const props = defineProps({
  videoId: {
    type: String,
    default: ''
  }
})

const sectionStore = useSectionStore()
const showVideo = ref(false)
const curVideoId = ref('')
const videoData = ref({
  code: '',
  channelNo: ''
})
const activeIndex = ref('')
const tableData = ref([])
const scrollDefaultOption = {
  step: 0.8, // 数值越大速度滚动越快
  limitMoveNum: 5, // 开始无缝滚动的数据量
  hoverStop: true, // 是否开启鼠标悬停stop
  direction: 1, // 0向下 1向上 2向左 3向右
  openWatch: true, // 开启数据实时监控刷新dom
  singleHeight: 50, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
  waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
}

const { proxy } = getCurrentInstance()
const openDialog = (item) => {
  curVideoId.value = item.deviceId
  showVideo.value = true
}

const getDevicePage = () => {
  monitorApi.getListData({ currentPage: 1, pageSize: 1000, sectionId: sectionStore.currentSection?.id }).then((res) => {
    tableData.value = res.data.list || []
  })
}

onMounted(() => {
  getDevicePage()
})

watch(
  () => props.workArea,
  (newVal, oldVal) => {
    getDevicePage()
  },
  { immediate: true, deep: true }
)

watch(
  () => sectionStore.currentSection?.id,
  () => {
    getDevicePage()
  }
)

watch(
  () => props.videoId,
  () => {
    if (props.videoId) {
      curVideoId.value = props.videoId
      showVideo.value = true
    }
  }
)
</script>
<style lang="scss" scoped>
.video-content {
  width: 100%;
  height: 700px;
  margin-left: 5px;
  .video-title {
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
  .video-box {
    width: 100%;
    height: 200px;
    video {
      width: 100%;
      height: 100%;
    }
  }
}
.change-list {
  height: 700px;
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
      //   flex: 1;
      text-align: center;
    }
    .cell-index {
      width: 63px;
    }
    .section {
      width: 200px;
    }
    .date {
      flex: 1;
    }
    .status {
      flex: 1;
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
      //   flex: 1;
      text-align: center;
    }
    > div:nth-child(1) {
      width: 80px;
    }
    > div:nth-child(2) {
      width: 200px;
    }
    > div:nth-child(3) {
      flex: 1;
    }
    > div:nth-child(4) {
      flex: 1;
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
.text-style1 {
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.actove-video {
  line-height: 48px !important;
  border: 1px solid #dadc08;
}
</style>
