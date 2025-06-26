<!--  -->
<template>
  <div class="right-box">
    <div class="title">
      现场管控
      <img
        src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/construction-title.png"
        class="title-bg"
        alt=""
      />
    </div>
    <div class="tab flex-box">
      <div v-for="(item, index) in tabData" :key="index" :class="['tab-child', activeId === item.id ? 'tab-child-active' : '']" @click="changeTab(item)">
        {{ item.name }}
      </div>
    </div>
    <environment v-if="activeId === '1'" v-bind="$attrs" ></environment>
    <personContnet v-if="activeId === '2'" v-bind="$attrs"></personContnet>
    <machineryContent v-if="activeId === '3'" v-bind="$attrs"></machineryContent>
    <EquipmentPositioning v-if="activeId === '4'" v-bind="$attrs"></EquipmentPositioning>
    <videoContent v-if="activeId === '5'" v-bind="$attrs" :video-id="videoId"></videoContent>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import environment from './Components/Environment.vue'
import EquipmentPositioning from './Components/EquipmentPositioning.vue'
import machineryContent from './Components/MachineryContent.vue'
import personContnet from './Components/PersonContent.vue'
import videoContent from './Components/VideoContent.vue'

const props = defineProps({
  videoId: {
    type: String,
    default: ''
  }
})

defineOptions({
  inheritAttrs: false
})

const route = useRoute()
const tabData = ref([
  {
    name: '视频监控',
    id: '5'
  },
  {
    name: '环境监测',
    id: '1'
  },
  {
    name: '人员信息',
    id: '2'
  },
  {
    name: '机械设备',
    id: '3'
  }

])

const activeId = ref('5')
const componentType = ref(true)

const changeTab = (item) => {
  activeId.value = item.id
}

const handleZero = () => {
  if (componentType.value) {
    activeId.value = '2'
  }
  componentType.value = false
}

watch(
  () => props.videoId,
  () => {
    if (props.videoId) {
      activeId.value = '5'
    }
  }
)
</script>
<style lang="scss" scoped>
.right-box {
  position: absolute;
  right: 20px;
  top:0px;
  height: 980px;
  width: 510px;
  padding: 0px 0px 0 40px;
  z-index:10;
  pointer-events: all;
  //   background: rgba(4, 16, 46, 0.9);
  //   background-image: url("https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/masking-out.svg");
  //   background-repeat: no-repeat;
  //   background-size: 100% 100%;
  .tab {
    width: 100%;
    height: 40px;
    gap:20px;
    color: #e6f7ff;
    opacity: 0.7;
    font-size: 18px;
    margin: 40px 0 20px 0;
    text-align: center;
    line-height: 40px;
    .tab-child {
      width: 100px;
      background: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/construction_bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .tab-child-active {
      background: url('https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/construction_bg_active.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: #fff;
      opacity: 1;
    }
  }
}
.flex-box {
  display: flex;
}
.title {
  width: 100%;
  height: 28px;
  padding-left: 30px;
  font-size: 26px;
  color: #fff;
  font-weight: 600;
  position: relative;
  .title-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: -17px;
  }
}
</style>
