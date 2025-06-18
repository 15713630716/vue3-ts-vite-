<template>
  <CreateDetailForm v-model="dialogVisible" :width="912" title="环境记录" :close-on-click-modal="false" @close="onClose" @full-screen="fullScreen">
    <div class="date-selector mb-4 flex">
      <div class="switch-button-wrapper mr-4">
        <SwitchButton v-model:index="state.dateTypeIndex" :buttons="['今日', '近七日', '自定义']" @click="handleSearch()"></SwitchButton>
      </div>

      <!-- 导出 -->
    </div>
    <div class="mb-4 flex">
      <!-- <el-button class="mr-4" type="primary" size="small" @click="onExport">导出</el-button> -->
      <div class="ml-auto">
        <el-date-picker
          v-if="isCustomDate"
          v-model="state.datetimeRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleSearch()"
        />
        <el-radio-group v-model="showType" size="large" class="ml-4" @change="handleSearch()">
          <el-radio-button label="图表" value="chart" />
          <el-radio-button label="列表" value="table" />
        </el-radio-group>
      </div>
    </div>
    <div v-show="showType === 'chart'" class="flex !min-h-[400px] flex-col">
      <el-radio-group v-model="showChartType" size="large" class="ml-4" @change="initChart()">
        <el-radio-button label="噪音" value="noise" />
        <el-radio-button label="pm25" value="pm25" />
        <el-radio-button label="pm10" value="pm10" />
        <el-radio-button label="风速" value="windSpeed" />
        <el-radio-button label="风力" value="windPower" />
        <el-radio-button label="气温" value="temperature" />
        <el-radio-button label="湿度" value="humidity" />
        <el-radio-button label="tsp" value="tsp" />
      </el-radio-group>
      <div ref="chartRef" class="h-full w-full flex-1" />
    </div>

    <CreateTable v-show="showType === 'table'" class="!min-h-[400px]">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column type="index" align="center" width="76" :index="(idx) => idx + 1 + (searchForm.currentPage - 1) * searchForm.pageSize" label="序号" />
        <el-table-column label="记录时间" prop="dataTime" width="180" />
        <el-table-column label="噪音(Db)" prop="noise" />
        <el-table-column label="pm25(ug/m³)" prop="pm25" />
        <el-table-column label="pm10(ug/m³)" prop="pm10" />
        <el-table-column label="风速(m/s)" prop="windSpeed" />
        <el-table-column label="风力(级)" prop="windPower" />
        <el-table-column label="风向" prop="windDirection" :formatter="(row) => WIND_DIRECTION_MAP[row.windDirection]" />
        <el-table-column label="气温(­°C)" prop="temperature" />
        <el-table-column label="湿度(%RH)" prop="humidity" />
        <el-table-column label="tsp(ug/m³)" prop="tsp" />
      </el-table>
    </CreateTable>

    <CreatePageLine
      v-show="showType === 'table'"
      :search-form="searchForm"
      :handle-size-change="handleSizeChange"
      :total="total"
      :handle-current-change="handleCurrentChange"
    />
    <template #footer></template>
  </CreateDetailForm>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { CreateDetailForm, useBaseForm } from '@/hooks/BaseForm'
import { CreateBaseView, CreatePageLine, CreateTable, useBaseView } from '@/hooks/BaseView'
import SwitchButton from '@/components/SwitchButton.vue'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {}
  }
})

const WIND_DIRECTION_MAP = {
  0: '北风',
  1: '东北风',
  2: '东风',
  3: '东南风',
  4: '南风',
  5: '西南风',
  6: '西风',
  7: '西北风'
}
/**
 * 组件属性
 */
const state = reactive({
  /**
   * 日期类型按钮索引
   */
  dateTypeIndex: 1,
  /**
   * 时间段
   */
  datetimeRange: [null, null],
  /**
   * 数据
   */
  datalist: []
})

const { usePageList, ApiModule } = useBaseView('xjsl.modular.ConstructionSite.EnvMonitor.Record')

const getDefaultSearchForm = () => ({
  currentPage: 1,
  pageSize: 20,
  dataStartTime: '',
  dataEndTime: '',
  deviceCode: ''
})

const { total, tableData, loading, searchForm, loadData, loadDataControl, handleCurrentChange, handleSizeChange, handleSearch } = usePageList({
  getDefaultSearchForm
})

loadDataControl.beforeLoadFn = () => {
  const formatStr = 'YYYY-MM-DD'
  const now = dayjs(new Date()).format(formatStr)

  if (shortcut.value === 'today') {
    state.datetimeRange = [dayjs(new Date()).format('YYYY-MM-DD'), now]
  } else if (shortcut.value === 'sevenday') {
    state.datetimeRange = [dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD'), now]
  }

  searchForm.value.dataStartTime = state.datetimeRange[0] + ' 00:00:00'
  searchForm.value.dataEndTime = state.datetimeRange[1] + ' 23:59:59'

  searchForm.value.pageSize = showType.value === 'table' ? 20 : 99999999
}

loadDataControl.makeUpLoadData = (data) => {
  return (data.list || []).filter((i) => !i.temperature || i.temperature < 500) // 过滤异常数据
}

const showType = ref('chart')

loadDataControl.afterLoadFn = () => {
  if (showType.value === 'chart') {
    nextTick().then(() => {
      initChart()
    })
  }
}

/**
 * 快捷日期列表
 */
const shortcutsDate = [
  {
    key: 'today',
    label: '今天'
  },
  {
    key: 'sevenday',
    label: '近七天'
  },
  {
    key: 'custom',
    label: '自定义'
  }
]

/**
 * 快捷日期
 */
const shortcut = computed(() => {
  return shortcutsDate[state.dateTypeIndex - 1].key
})

const { useForm } = useBaseForm()
const { form, dialogVisible, onClose, showModal, showModalControl } = useForm()

showModalControl.afterShowFn = () => {
  chartIns && chartIns.dispose()
  chartIns = null
  searchForm.value.deviceCode = form.value.deviceCode
  searchForm.value.currentPage = 1
  searchForm.value.pageSize = 20
  handleSearch()
}

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
}

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
}

/**
 * 是否自定义时间
 */
const isCustomDate = computed(() => {
  return state.dateTypeIndex === 3
})

const chartRef = ref(null)
let chartIns = null

const showChartType = ref('noise')

const initChart = () => {
  if (!chartIns) {
    chartIns = echarts.init(chartRef.value)
  }

  let markLineValue

  const markLineValues = {
    noise: props.currentRow.noiseWarn,
    // pm25: state.dateTypeIndex === 2 ? 35 : 75,
    pm10: props.currentRow.pm10Warn,
    windSpeed: props.currentRow.windSpeedWarn,
    windPower: props.currentRow.windPowerWarn,
    tsp: props.currentRow.tspWarn,
    temperature: props.currentRow.temperatureWarn,
    humidity: props.currentRow.humidityWarn
  }

  if (markLineValues[showChartType.value] !== undefined) {
    markLineValue = markLineValues[showChartType.value]
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 50,
      bottom: 50,
      right: 30
    },
    xAxis: {
      type: 'category',
      data: tableData.value.map((item) => item.dataTime)
    },
    yAxis: {
      type: 'value',
      name: `${UNIT_MAP[showChartType.value]}`
    },
    series: [
      {
        data: tableData.value.map((item) => item[showChartType.value]),
        type: 'line',
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
let ro = null
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

const fullScreen = () => {
  nextTick(() => {
    chartIns && chartIns.resize()
  })
}

defineExpose({ showModal })
</script>

<style lang="scss" scoped>
.switch-button-wrapper {
  width: 216px;
}
.date-picker-wrapper {
  width: 200px;
}
.history-table {
  height: 310px;
}
</style>
