<template>
  <div class="box">
    <div class="guankong-header">
      人员定位
    </div>
    <div class="jixie-box">
      <div class="left  pointer-events-all">
        <div ref="chartRef" style="width: 100%;height: 100%;"></div>
        <div class="content">
          <div class="label">设备总数</div>
          <div class="value">{{ peoplePositioning.total }} <i>个</i></div>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <img src="../../assets/guankong/huang.png" alt="">
          <span>离线数量 <i>{{ peoplePositioning.offLineCount }}</i>个</span>
        </div>
        <div class="item">
          <img src="../../assets/guankong/lv.png" alt="">
          <span>在线数量 <i style="color: #53EE8A;">{{ peoplePositioning.onLineCount }}</i>个</span>
        </div>
      </div>
    </div>
    <div class="guankong-header">
      人员考勤
    </div>
    <div class="kaoqin">
      <div class="today">
        <div class="left"></div>
        <div class="right">
          <div class="top content">
            <div class="label">今日出勤</div>
            <div class="value">{{ statisticsData.countOfToday }} <i>人</i></div>
          </div>
          <div class="center">
            <el-progress :color="'#53ee8a'" :text-inside="true" :stroke-width="8"
              :percentage="Number((statisticsData.per * 100).toFixed(2))" status="exception">
              <span></span>
            </el-progress>
          </div>
          <div class="bottom content">
            <div class="label">出勤率</div>
            <div class="value">{{ (statisticsData.per * 100).toFixed(2) }} <i>%</i></div>
          </div>
        </div>
      </div>
      <div class="zong">
        <div class="name">出勤总人数</div>
        <div class="value">{{ statisticsData.countOfTotal }} <i>人</i></div>
      </div>
      <div class="zong yue">
        <div class="name">月出勤人数</div>
        <div class="value">{{ statisticsData.countOfMonth }} <i>人</i></div>
      </div>
    </div>
    <div class="slider-box">
      <TimeSlider></TimeSlider>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getRenLine, getRenWork } from '@/request/guankong'
import * as echarts from 'echarts';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { EChartsType } from 'echarts';
import TimeSlider from './TimeSlider.vue';




onMounted(() => {
  getLists()
})

const statisticsData = ref({} as any)
const peoplePositioning = ref({} as any)
const getLists = async () => {
  const res = await getRenLine()
  peoplePositioning.value = res

  const attendance = await getRenWork()
  statisticsData.value = attendance
  // console.log(statisticsData.value);
}

const chartRef = ref()

// 监听最外层宽度改变时  控制筛选行的显示样式
let ro = null as any
onMounted(() => {
  nextTick(() => {
    initEchart()
  })
  ro = new ResizeObserver(() => {
    nextTick(() => {
      chartIns && chartIns.resize()
    })
  })
  chartRef.value && ro.observe(chartRef.value)
})
onUnmounted(() => {
  ro.disconnect()
})

let chartIns: EChartsType | null = null
const initEchart = () => {

  if (!chartIns) {
    chartIns = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    series: [
      {
        center: ['47%', '50%'],
        type: 'pie',
        radius: ['62%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 0
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 0, name: '离线数量', itemStyle: { color: '#53ee8a' } },
          { value: 0, name: '在线数量', itemStyle: { color: '#e9ca7a' } },
        ]
      }
    ]
  };
  chartIns.setOption(option)
}

</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  position: relative;

  .slider-box {
    position: absolute;
    bottom: -120px;
    left: -1049px;
    width: 1000px;
    height: 130px;
  }

  .jixie-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 200px;
      height: 200px;
      background: url('@/assets/guankong/yuan-bg.png') no-repeat;
      background-size: 100% 100%;
      position: relative;

      .content {
        width: 62px;
        height: 70px;
        position: absolute;
        top: 60px;
        left: 60px;

        .label {
          font-size: 14px;
          color: #FFFFFF;
          width: 100%;
          text-align: center;
        }

        .value {
          width: 100%;
          text-align: center;
          margin-top: 10px;
          font-family: PangMenZhengDao;
          font-size: 28px;
          color: #FFFFFF;
          letter-spacing: -0.09px;
          font-weight: 400;

          i {
            font-size: 14px;
          }
        }
      }
    }

    .right {
      width: 178px;

      .item {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }

        span {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: justify;
          font-weight: 400;
        }

        i {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #E9CA7A;
          letter-spacing: -0.07px;
          font-weight: 500;
          margin-left: 10px;
          margin-right: 5px;
        }
      }
    }
  }

  .kaoqin {
    width: 100%;
    min-height: 290px;
    background: rgba(4, 80, 120, 0.40);
    border: 1px solid rgba(108, 204, 255, 0.47);
    border-radius: 8px;
    padding: 20px 10px;

    .today {
      width: 100%;
      height: 90px;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      margin-top: 7px;

      .right {
        width: 248px;

        .content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #FFFFFF;

          .value {
            font-family: D-DIN-PRO-Bold;
            font-size: 24px;
            color: #53EE8A;
            letter-spacing: -0.07px;
            font-weight: 700;

            i {
              font-size: 14px;
              color: #FFFFFF;
              font-weight: 400;
            }
          }
        }

        .center {
          width: 100%;
          height: 20px;
          margin: 6px 0;
          background: rgba(255, 255, 255, 0.21);
          border-radius: 10px;
          padding: 6px;
        }
      }

      .left {
        width: 90px;
        height: 90px;
        background: url('@/assets/guankong/kaoqin.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 15px;
      }
    }

    .zong {
      width: 100%;
      height: 56px;
      background: url('@/assets/guankong/zongchuqin.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #FFFFFF;
      padding: 0 15px 0 75px;

      .name {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: justify;
        font-weight: 400;
      }

      .value {
        font-family: D-DIN-PRO-Bold;
        font-size: 24px;
        color: #30C8FF;
        letter-spacing: -0.07px;
        font-weight: 700;

        i {
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }

    .yue {
      background: url('@/assets/guankong/yuechuqin.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>