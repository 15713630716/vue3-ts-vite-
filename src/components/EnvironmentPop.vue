<template>
  <div class="video-box pointer-events-all" v-show="dialogTableVisible">
    <el-dialog v-model="dialogTableVisible" title="环境监测详情" width="1000">
      <div class="content">
        <div class="time">
          <div style="width: 150px;">
            <el-date-picker v-model="times" value-format="YYYY-MM-DD" type="daterange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" />
          </div>
          <el-radio-group v-model="showChartType" class="ml-4" @change="initChart()">
            <el-radio-button label="噪音" value="noise" />
            <el-radio-button label="pm25" value="pm25" />
            <el-radio-button label="pm10" value="pm10" />
            <el-radio-button label="风速" value="windSpeed" />
            <el-radio-button label="风力" value="windPower" />
            <el-radio-button label="气温" value="temperature" />
            <el-radio-button label="湿度" value="humidity" />
            <el-radio-button label="tsp" value="tsp" />
          </el-radio-group>
        </div>
        <div class="chart-main">
          <div class="warn">预警值 : {{ warnValue }}</div>
          <div class="chart-content" ref="chartRef" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue';
import { getHuanJing, getHuanJingWarn } from '@/request/construct'
import { ueStoreJson } from '@/store';
import dayjs from 'dayjs';
import type { EChartsType } from 'echarts';
import * as echarts from 'echarts'

const storeUe = ueStoreJson();


watch(
  () => storeUe.ueStore,
  () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore?.type == 'huanjing') {
        setTimeout(() => {
          dialogTableVisible.value = true
          nextTick(() => {
            initChart()
          })
        }, 2500);
      }
    }
  }
);


const NAME_MAP = {
  windSpeed: '风速',
  windPower: '风力',
  windDirection: '风向',
  temperature: '气温',
  humidity: '湿度',
  noise: '噪音',
  pm25: 'pm25',
  pm10: 'pm10',
  tsp: 'tsp'
} as any

const UNIT_MAP = {
  windSpeed: 'm/s',
  windPower: '级',
  windDirection: '',
  temperature: '°C',
  humidity: '%RH',
  noise: 'Db',
  pm25: 'ug/m³',
  pm10: 'ug/m³',
  tsp: 'ug/m³'
} as any

const dialogTableVisible = ref(false)
const times = ref([null, null] as any)
const chartRef = ref(null)
const showChartType = ref('noise')
const currentRow = ref({} as any)
const tableData = ref([] as any)
let chartIns: EChartsType | null = null
const warnValue = ref('')
const initChart = () => {
  if (!chartIns) {
    chartIns = echarts.init(chartRef.value)
  }

  let markLineValue

  const markLineValues = {
    noise: currentRow.value.noiseWarn,
    pm25: currentRow.value.pm25Warn,
    pm10: currentRow.value.pm10Warn,
    windSpeed: currentRow.value.windSpeedWarn,
    windPower: currentRow.value.windPowerWarn,
    tsp: currentRow.value.tspWarn,
    temperature: currentRow.value.temperatureWarn,
    humidity: currentRow.value.humidityWarn
  } as any

  if (markLineValues[showChartType.value] !== undefined) {
    markLineValue = markLineValues[showChartType.value]
    warnValue.value = `${markLineValue} ${UNIT_MAP[showChartType.value]}`
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 60,
      top: 50,
      bottom: 50,
      right: 30
    },
    xAxis: {
      type: 'category',
      data: tableData.value.map((item: any) => item.dataTime),
      axisLabel: {
        color: '#ffffff', // 设置 X 轴标签字体颜色（红色）
        fontSize: 12,     // 可选：设置字体大小
      }
    },
    yAxis: {
      type: 'value',
      name: `${UNIT_MAP[showChartType.value]}`,
      nameTextStyle: {
        color: '#ffffff' // 坐标轴名称颜色（紫色）
      },
      axisLabel: {
        color: '#ffffff', // 设置 X 轴标签字体颜色（红色）
        fontSize: 12,     // 可选：设置字体大小
      },
      splitLine: {
        show: true, // 显示网格线（默认 true）
        lineStyle: {
          color: '#ccc', // 网格线颜色
          width: 1,     // 网格线宽度
          type: 'dashed' // 可选：'solid'（实线）、'dashed'（虚线）
        }
      }
    },
    series: [
      {
        data: tableData.value.map((item: any) => item[showChartType.value]),
        type: 'line',
        lineStyle: {
          color: '#0be2e2', // 折线颜色（红色）
          width: 1,        // 折线宽度
          type: 'solid'    // 可选：'solid'（实线）、'dashed'（虚线）
        },
        name: NAME_MAP[showChartType.value],
        markLine: markLineValue
          ? {
            // 消除箭头
            symbol: ['none', 'none'],
            data: [
              {
                name: `超标：${markLineValue}${UNIT_MAP[showChartType.value]}`,
                type: 'average',
                lineStyle: {
                  color: '#FA1616',
                  width: 1
                },
                yAxis: markLineValue,
                label: {
                  show: true,
                  position: 'insideEndTop',
                  formatter: `超标：${markLineValue}${UNIT_MAP[showChartType.value]}`,
                  color: '#FA1616',
                  fontSize: 12
                }
              }
            ]
          }
          : null
      }
    ]
  }
  chartIns.setOption(option)
}
// 监听最外层宽度改变时  控制筛选行的显示样式
let ro = null as any
onMounted(() => {
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
onMounted(async () => {
  getTestTime()
  const res = await getHuanJingWarn()
  currentRow.value = res.list[0]
})

// 默认 当日
const getTestTime = () => {
  const formatStr = 'YYYY-MM-DD'
  const now = dayjs(new Date()).format(formatStr)
  times.value = [dayjs(new Date()).format('YYYY-MM-DD'), now]
}
watch(
  () => times.value,
  async () => {
    if (times.value) {
      const res = await getHuanJing({ dataStartTime: times.value[0] + ' 00:00:00', dataEndTime: times.value[1] + ' 23:59:59' })
      // console.log('res', res);
      tableData.value = res.list
      nextTick(() => {
        initChart()
      })
    }
  }
);
</script>
<style lang="scss" scoped>
.video-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :deep(.el-dialog) {
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 76, 111, 0.8);
    box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
    border-radius: 0px 32px 0px 32px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 15px;

  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
    display: block;
    width: 100%;
    height: 35px;
    line-height: 35px;
    background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);
  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
  }

  .content {
    width: 100%;
    height: 570px;
    object-fit: cover;

    .time {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 35px;
      margin-top: 15px;

      :deep(.el-date-editor--daterange) {
        opacity: 0.85;
      }

      :deep(.el-radio-group) {
        opacity: 0.85;
      }
    }

    .chart-main {
      width: 100%;
      height: 500px;
      position: relative;

      .warn {
        position: absolute;
        right: 0;
        top: 20px;
        color: #ffb00e;
      }

      .chart-content {
        width: 100%;
        height: 500px;
      }
    }
  }
}
</style>