<template>
  <div class="home">
    <div ref="chartRef" style="width: 800px;height: 450px;"></div>
    <button @click="getClick">点击事件</button>
    <div class="box" v-show="show"></div>
    <button @click="sendUeMsg">前端向ue发送消息</button>
    <h1>{{ ueValue }}</h1>
    <!-- <button @click="sendToUE5('Hello UE5!')">Send Message</button>
    <p>UE5 Response: {{ response }}</p> -->
    <!-- <button @click="sendMessage()">Send Message websocket</button>
    <div id="output">{{ websoc }}</div> -->
    <button @click="jsfunction()">jsfunction加1</button>
    <h1>
      {{ jsfunctionData }}
    </h1>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'


// const ws = new WebSocket("ws://192.168.137.1:8080");
// const ws = new WebSocket("ws://172.21.218.13:8000/v1/fastcase/task/list");
// const websoc = ref()
// ws.onopen = () => {
//   console.log("Connected to UE5 server");
//   websoc.value = "连接已打卡";
// };
// ws.onmessage = (event) => {
//   console.log("Received:", event.data);
//   websoc.value = `UE5传过来的信息: ${event.data}`;
// };

// function sendMessage() {
//   const message = JSON.stringify({ name: 'web', msg: '你好' })
//   ws.send(message);
//   websoc.value = `web传过去的信息: ${message}`;
// }

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
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        // 确保 params 存在且 params[0] 有值
        if (!params || params.length === 0) return ''
        return params[0].name + '<br/>' +
          params.map((item: any) => {
            return `${item.seriesName}: ${item.value}`
          }).join('<br/>')
      }
    },
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

const show = ref(false)
const getClick = () => {
  show.value = !show.value
}



const ueValue = ref('77');
// 前端发送消息到ue
const sendUeMsg = () => {
  // 第一个参数为函数名，第二个参数为数据
  ue5("callbackTestCall", JSON.stringify({ name: 'web', id: 'qqkc' }))
}

ue.interface.getUeTestCall = (res: any) => {
  console.log(res);
  ueValue.value = JSON.parse(res).age
}




// const response = ref('');

// 发送消息到 UE5
// const sendToUE5 = (message: string) => {
//   if (window.ue5?.ReceiveFromVue) {
//     window.ue5.ReceiveFromVue(message);
//   } else {
//     console.error('UE5 bridge not ready');
//   }
// };

const jsfunctionData = ref(65)
const jsfunction = () => {
  jsfunctionData.value++
}
// 接收 UE5 的消息
onMounted(() => {
  jsfunction()

  // 在 Vue 的 mounted 钩子中检查
  // console.log('ue5 bridge exists?', window.ue5);

  // window.vueCallback = (message: string) => {
  //   response.value = message;
  // };
});

// 清理
// onUnmounted(() => {
//   window.vueCallback = () => { };
// });

</script>
<style lang="scss" scoped>
.home {
  font-size: 14px;
  padding: 100px;

  .box {
    width: 100px;
    height: 100px;
    background-color: red;
  }
}
</style>