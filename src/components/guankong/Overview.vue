<template>
  <div class="box">
    <div class="guankong-header">
      人员管理
    </div>
    <div class="ren-box">
      <div class="item">
        <div class="left"></div>
        <div class="right">
          <div class="top">今日总数</div>
          <div class="bottom">{{ peopleData.offtotal }}</div>
        </div>
      </div>
      <div class="item">
        <div class="left"></div>
        <div class="right">
          <div class="top">场内实时</div>
          <div class="bottom" style="color: #53EE8A;">0</div>
        </div>
      </div>
    </div>
    <div class="guankong-header" style="margin-bottom: 10px;">
      机械设备
    </div>
    <div class="jixie-box">
      <div class="left  pointer-events-all">
        <div ref="chartRef" style="width: 100%;height: 100%;"></div>
        <div class="content"></div>
      </div>
      <div class="right">
        <div class="item">
          <img src="../../assets/guankong/huang.png" alt="">
          <span>在场机械 <i>{{ jixieData.ontotal }}</i>个</span>
        </div>
        <div class="item">
          <img src="../../assets/guankong/lv.png" alt="">
          <span>场外机械 <i style="color: #53EE8A;">{{ jixieData.offtotal }}</i>个</span>
        </div>
      </div>
    </div>
    <div class="guankong-header" style="margin-top: 10px;">
      环境监测
    </div>
    <div class="huanjing-box">
      <div class="item">
        <div class="left"></div>
        <div class="right">
          <div class="top">设备总数</div>
          <div class="bottom">{{ statisticsData.total }}</div>
        </div>
      </div>
      <div class="item">
        <div class="left"></div>
        <div class="right">
          <div class="top">在线总数</div>
          <div class="bottom" style="color: #53EE8A;">{{ statisticsData.total - statisticsData.exitTotal }}</div>
        </div>
      </div>
    </div>
    <div class="guankong-header">
      视频监控
    </div>
    <div class="mv-box">
      <div class="left">
        <div class="top">摄像头总数</div>
        <div class="center">{{ mvData.total }}</div>
        <div class="bottom"></div>
      </div>
      <div class="right">
        <div class="item huan">
          <div class="name name-bg">环机</div>
          <div class="num">
            <div class="num-top">
              <div class="num-name">在线</div>
              <div class="num-name">离线</div>
            </div>
            <div class="num-bottom">
              <div class="num-num">{{ mvData.huanOnTotal }}</div>
              <div class="num-num" style="color: #fff;">{{ mvData.huanOffTotal }}</div>
            </div>
          </div>
        </div>
        <div class="item qiang">
          <div class="name">枪机</div>
          <div class="num">
            <div class="num-top">
              <div class="num-name">在线</div>
              <div class="num-name">离线</div>
            </div>
            <div class="num-bottom">
              <div class="num-num">{{ mvData.qiangOnTotal }}</div>
              <div class="num-num" style="color: #fff;">{{ mvData.qiangOffTotal }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { nextTick, onMounted, ref } from 'vue';
import type { EChartsType } from 'echarts';
import { getHuanJingWarn, getDeviceLists, getRenWork, getMvLists } from '@/request/guankong'

const chartRef = ref()

// 监听最外层宽度改变时  控制筛选行的显示样式
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
          { value: jixieData.value.ontotal, name: '在场机械', itemStyle: { color: '#53ee8a' } },
          { value: jixieData.value.offtotal, name: '场外机械', itemStyle: { color: '#e9ca7a' } },
        ]
      }
    ]
  };
  chartIns.setOption(option)
}


//环境监测
const statisticsData = ref({
  exitTotal: 0,
  total: 0
})
//机械设备
const jixieData = ref({
  ontotal: 0,
  offtotal: 0
})
//人员定位
const peopleData = ref({
  ontotal: 0,
  offtotal: 0
})
//视频监控
const mvData = ref({
  total: 0,
  huanOnTotal: 0,
  huanOffTotal: 0,
  qiangOnTotal: 0,
  qiangOffTotal: 0
})
const getLists = async () => {
  //环境监测
  const res = await getHuanJingWarn()
  statisticsData.value.total = res.list.length
  statisticsData.value.exitTotal = res.list.filter((item: any) => item.deviceStatus !== 2).length
  //机械设备
  const jixie = await getDeviceLists({})
  jixie.map((item: any) => {
    if (item.deviceStatus == 1) {
      jixieData.value.offtotal++
    } else {
      jixieData.value.ontotal++
    }
  })
  //人员定位
  const attendance = await getRenWork()
  peopleData.value.offtotal = attendance.countOfToday
  //视频监控
  const mvs = await getMvLists()
  mvData.value.total = mvs.total
  mvs.list.map((item: any) => {
    if (item.deviceId == '1921732975325671426' || item.deviceId == '1921732975384391682') {
      if (item.deviceStatus == 1) {
        mvData.value.huanOffTotal++
      } else {
        mvData.value.huanOnTotal++
      }
    } else {
      if (item.deviceStatus == 1) {
        mvData.value.qiangOffTotal++
      } else {
        mvData.value.qiangOnTotal++
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;

  .ren-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item {
      width: 178px;
      height: 88px;
      background: url('@/assets/guankong/ren-box.png') no-repeat;
      background-size: 100% 100%;
      padding: 20px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        width: 64px;
        height: 48px;
        background: url('@/assets/guankong/ren-logo.png') no-repeat;
        background-size: 100% 100%;
      }

      .right {
        .top {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
        }

        .bottom {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #29CCFF;
          letter-spacing: 0;
          text-align: left;
          line-height: 32px;
          font-weight: 400;
        }
      }
    }
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
        background: url('@/assets/guankong/jixie-content.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 60px;
        left: 65px;
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

  .huanjing-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item {
      width: 178px;
      height: 88px;
      background: url('@/assets/guankong/ren-box.png') no-repeat;
      background-size: 100% 100%;
      padding: 20px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        width: 53px;
        height: 49px;
        background: url('@/assets/guankong/shebei.png') no-repeat;
        background-size: 100% 100%;
      }

      .right {
        .top {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
        }

        .bottom {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #29CCFF;
          letter-spacing: 0;
          text-align: left;
          line-height: 32px;
          font-weight: 400;
        }
      }
    }
  }

  .mv-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 140px;

      .top {
        width: 100%;
        height: 40px;
        background: url('@/assets/guankong/zongshu.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #FFFFFF;
      }

      .center {
        width: 100%;
        font-family: PangMenZhengDao;
        font-size: 24px;
        color: #E9CA7A;
        letter-spacing: -0.07px;
        font-weight: 400;
        text-align: center;
      }

      .bottom {
        width: 115px;
        height: 77px;
        background: url('@/assets/guankong/jiankong.png') no-repeat;
        background-size: 100% 100%;
        margin: 10px auto;
      }
    }

    .right {
      width: 225px;

      .item {
        width: 100%;
        height: 64px;
        margin-bottom: 15px;
        overflow: hidden;
        display: flex;
        align-items: center;

        .num {
          width: 82px;
          margin-left: 10px;

          .num-top {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            font-weight: 400;
          }

          .num-bottom {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            font-weight: 400;

            .num-num {
              text-align: center;
              width: 50%;
              font-family: PangMenZhengDao;
              font-size: 20px;
              color: #53EE8A;
            }
          }
        }

        .name {
          width: 65px;
          height: 23px;
          line-height: 23px;
          text-align: center;
          margin-left: 57px;
          // margin-top: 20px;
          font-family: MicrosoftYaHeiSemibold;
          font-size: 16px;
          color: #FFFFFF;
          letter-spacing: 0;
          font-weight: 600;
        }

        .name-bg {
          background: url('@/assets/guankong/jiankong-bg.png') no-repeat;
          background-size: 100% 100%;
        }
      }

      .huan {
        background: url('@/assets/guankong/huanjidi.png') no-repeat;
        background-size: 100% 100%;
      }

      .qiang {
        background: url('@/assets/guankong/qiangjidi.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>