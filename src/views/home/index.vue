<template>
  <div class="home">
    <div ref="chartRef" style="width: 800px;height: 450px;"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const chartRef = ref<HTMLElement>()
const chartInstance = ref<ECharts>()

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  // 销毁旧实例
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  
  // 创建新实例
  chartInstance.value = echarts.init(chartRef.value)
  chartInstance.value.setOption({
  title: {
    text: 'Vue3 + ECharts 示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
})
  
  // 窗口变化时自动调整
  window.addEventListener('resize', resizeChart)
}

// 调整图表大小
const resizeChart = () => {
  chartInstance.value?.resize()
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance.value?.dispose()
})
</script>
<style lang="scss" scoped>
.home{
  font-size: 14px;
}
  
</style>