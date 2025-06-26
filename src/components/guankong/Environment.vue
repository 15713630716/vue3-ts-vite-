<template>
  <div class="box">
    <div class="jixie-box">
      <div class="left  pointer-events-all">
        <div ref="chartRef" style="width: 100%;height: 100%;"></div>
        <div class="content">
          <div class="label">设备总数</div>
          <div class="value">{{ statisticsData.total }} <i>个</i></div>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <img src="../../assets/guankong/lv.png" alt="">
          <span>接入设备 <i style="color: #E9CA7A ;">{{ statisticsData.total }}</i>个</span>
        </div>
        <div class="item">
          <img src="../../assets/guankong/lv.png" alt="">
          <span>在线设备 <i style="color: #53EE8A ;">{{ statisticsData.total - statisticsData.exitTotal }}</i>个</span>
        </div>
        <div class="item">
          <img src="../../assets/guankong/huang.png" alt="">
          <span>离线设备 <i style="color: #fff ;">{{ statisticsData.exitTotal }}</i>个</span>
        </div>
      </div>
    </div>
    <div class="data-main">
      <div v-for="item in lists" :key="item.id" class="item">
        <div class="header">
          <div class="title">
            {{ item.deviceName }}
          </div>
          <img v-if="item.deviceStatus === 2" style="width: 56px; height: 24px"
            src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/xxdt/big/%E5%9C%A8%E7%BA%BF.png"
            alt="" />
          <img v-else style="width: 56px; height: 24px"
            src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/xxdt/big/%E7%A6%BB%E7%BA%BF.png"
            alt="" />
        </div>
        <div class="content">
          <div v-for="(subItem, index) in environmentTypes" :key="'subItem' + index" class="content-item">
            <div class="name">{{ `${subItem.label}(${item[subItem.value + 'Warn'] || '-'})` }}</div>
            <div :class="[classFn(item, subItem), 'value']">
              {{ item?.emPushInfo[subItem.value] || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getHuanJingWarn } from '@/request/guankong'
import * as echarts from 'echarts';
import { nextTick, onMounted, ref } from 'vue';
import type { EChartsType } from 'echarts';

const lists = ref([] as any)
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

const getLists = async () => {
  const res = await getHuanJingWarn()
  lists.value = res.list
  statisticsData.value.total = res.list.length
  statisticsData.value.exitTotal = res.list.filter((item: any) => item.deviceStatus !== 2).length
  // console.log(res);
}
const classFn = (item: any, subItem: any) => {
  if (item.deviceStatus !== 2) return 'value-white'
  if (item?.emPushInfo[subItem.value] > item[subItem.value + 'Warn']) return 'value-red'
}

const statisticsData = ref({
  exitTotal: 0,
  total: 0
})

const chartRef = ref()


onMounted(async () => {
  await getLists()
  nextTick(() => {
    initEchart()
  })
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
          { value: statisticsData.value.total, name: '接入设备', itemStyle: { color: '#E9CA7A' } },
          { value: statisticsData.value.total - statisticsData.value.exitTotal, name: '在线设备', itemStyle: { color: '#53EE8A ' } },
          { value: statisticsData.value.exitTotal, name: '离线设备', itemStyle: { color: '#FFFFFF' } },
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

  .data-main {
    width: 100%;
    height: 310px;
    margin-top: 10px;
    background: rgba(4, 80, 120, 0.40);
    border: 1px solid rgba(108, 204, 255, 0.47);
    border-radius: 8px;
    padding: 8px;

    .header {
      width: 100%;
      height: 35px;
      color: #FFFFFF;
      line-height: 35px;
      padding-left: 10px;
      background-image: linear-gradient(269deg, rgba(34, 102, 135, 0.00) 0%, rgba(21, 179, 255, 0.82) 100%);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .status {
        width: 56px;
        height: 24px;
        background-image: linear-gradient(0deg, rgba(0, 249, 146, 0.80) 1%, rgba(2, 210, 122, 0.07) 100%);
        border-radius: 4px;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
      }

      .li {
        background-image: linear-gradient(0deg, rgba(40, 43, 42, 0.8) 1%, rgba(2, 210, 122, 0.07) 100%);
        color: #d6cece;
      }
    }

    .content {
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 10px;

      .content-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 100%;
        width: 32%;

        .name {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #87D5FF;
          letter-spacing: 0;
          font-weight: 400;
        }

        .value {
          font-family: D-DIN-PRO-ExtraBold;
          font-size: 20px;
          color: #00da40;
          font-weight: 600;
          width: 95px;
          height: 31px;
          background-image: linear-gradient(90deg, rgba(0, 165, 255, 0.32) 7%, rgba(0, 165, 255, 0.00) 100%);
          text-align: center;
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