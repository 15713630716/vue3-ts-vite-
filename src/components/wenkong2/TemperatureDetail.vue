<template>
  <div class="tree-detail">
    <div class="card-header">
      <div class="title">{{ detailData?.damPositionNum }}</div>
      <div class="logo-button">
        <div
          v-if="foundationShow"
          class="logo right"
          @click="changeTreeShow(false)"
        ></div>
        <div
          v-if="!foundationShow"
          class="logo left"
          @click="changeTreeShow(true)"
        ></div>
        <div class="logo close" @click="getClose()"></div>
      </div>
    </div>
    <div class="guankong-header">坝块信息</div>
    <div class="information">
      <div class="text">
        <div class="label">桩号:</div>
        <div class="value">{{ detailData?.stake || "-" }}</div>
      </div>
      <div class="text">
        <div class="label">所在区域:</div>
        <div class="value">{{ detailData?.constraintArea || "-" }}</div>
      </div>
      <div class="text">
        <div class="label">温度计埋设总数:</div>
        <div class="value">{{ detailData?.thermometerTotal || "-" }}</div>
      </div>
      <div class="text">
        <div class="label">已埋设温度计:</div>
        <div class="value">{{ detailData?.thermometerNum || "-" }}</div>
      </div>
    </div>
    <div class="guankong-header guankong-header1">坝块温度监测</div>
    <div class="information">
      <div class="text">
        <div class="label">浇筑温度:</div>
        <div class="value">{{ detailData?.pouringTemperature || "-" }}度</div>
      </div>
      <div class="text">
        <div class="label">最高温度:</div>
        <div class="value">{{ policeTotal?.maxTemp || "-" }}度</div>
      </div>
      <div class="text">
        <div class="label">正常天数:</div>
        <div class="value">{{ policeTotal?.normalDay || "-" }}</div>
      </div>
      <div class="text">
        <div class="label">出现异常天数:</div>
        <div class="value">{{ policeTotal?.abnormalDay || "-" }}</div>
      </div>
    </div>
    <div class="tu">
      <img src="../../assets/wenkong/all.png" alt="" />
    </div>
    <div class="main">
      <div class="item-header">
        <div class="textHeader" style="flex: 1.8">测点</div>
        <div class="textHeader" style="flex: 0.9">当前温度</div>
        <div class="textHeader" style="flex: 1.5">历史最高温度</div>
        <div class="textHeader" style="flex: 1.3">状态</div>
      </div>
      <div class="box">
        <div
          class="item"
          v-for="(item, index) in statuAbnormal"
          :key="`abnormal${index}`"
        >
          <div class="text" style="flex: 2">{{ item.sensorName }}</div>
          <div class="text" style="flex: 0.9">{{ item.currentValue }}</div>
          <div class="text" style="flex: 1.3">{{ item.historyValue }}</div>
          <div class="text postpone1" v-if="item.status == 0" style="flex: 1.3">
            <i class="icon"></i>异常
          </div>
          <div class="text postpone2" v-if="item.status == 1" style="flex: 1.3">
            <i class="icon"></i>正常
          </div>
          <div class="text postpone1" v-if="!item?.status" style="flex: 1.3">
            -
          </div>
        </div>
        <div class="empty" v-if="statuAbnormal.length == '0'">暂无数据</div>
      </div>
    </div>
    <div class="guankong-header">预警信息</div>
    <div class="section-item">
      <div class="tab">
        <div
          v-for="item in dianweis1"
          :key="item.value"
          class="tab-item"
          :class="tabActive1 == item.value ? 'hide' : ''"
          @click="getTab(item)"
        >
          {{ item.label }}
        </div>
        <div class="picker">
          <div class="timeType">
            <div
              class="day"
              :class="timeType == 'day' ? 'active' : ''"
              @click="changeTimeType('day')"
            >
              日
            </div>
            <div
              class="day"
              :class="timeType == 'month' ? 'active' : ''"
              @click="changeTimeType('month')"
            >
              月
            </div>
          </div>
          <div class="picker-box">
            <el-date-picker
              v-if="timeType == 'day'"
              size="small"
              :clearable="false"
              v-model="timesDay"
              @change="changeDateDay()"
              value-format="YYYY-MM-DD"
              type="date"
            />
            <el-date-picker
              v-if="timeType == 'month'"
              size="small"
              :clearable="false"
              v-model="timesMonth"
              @change="changeDateMonth()"
              value-format="YYYY-MM"
              type="month"
            />
          </div>
        </div>
      </div>
      <div id="echart1" ref="chartRef1" class="echart"></div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { getCangEchart, getWarnCang } from "@/request/temperature";
import { groupArrayWithNameData } from "@/utils/arrayToTree";

const props = defineProps({
  foundationShow: {
    type: Boolean,
    default: true,
  },
  detailShow: {
    type: Boolean,
    default: true,
  },
  detailData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emits = defineEmits(["update:foundationShow", "update:detailShow"]);

const getClose = () => {
  emits("update:detailShow", false);
  emits("update:foundationShow", true);
};
const changeTreeShow = (value) => {
  emits("update:foundationShow", value);
};

const statuAbnormal = ref([]);
const policeTotal = ref({});
const timesDay = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const timesMonth = ref(dayjs(new Date()).format("YYYY-MM"));
const getWarnStatss = async (par) => {
  const res = await getWarnCang({
    damPositionNum: props.detailData?.damPositionNum,
  });
  policeTotal.value = res;
  statuAbnormal.value = res?.tempWarnList || [];
  if (statuAbnormal.value.length != 0) {
    timesDay.value = statuAbnormal.value[0].latestDate;
    timesMonth.value = statuAbnormal.value[0].latestDate.substring(0, 7);
  }
};
/**
 * 图表配置
 */
const chartRef1 = ref(null);
// 折线数据
const echartTime = ref([]);
const lineData1 = ref([
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(117,255,236,0.5)",
    areaStyleBottom: "rgba(117,255,236,0)",
    lineStyle: "rgba(117,255,236,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(255,237,145,0.5)",
    areaStyleBottom: "rgba(255,237,145,0)",
    lineStyle: "rgba(255,237,145,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(8,117,253,0.5)",
    areaStyleBottom: "rgba(8,117,253,0)",
    lineStyle: "rgba(8,117,253,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(255,103,72,0.5)",
    areaStyleBottom: "rgba(255,103,72,0)",
    lineStyle: "rgba(255,103,72,1.00)",
    visible: true,
  },
]);
const lineData = ref([
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(117,255,236,0.5)",
    areaStyleBottom: "rgba(117,255,236,0)",
    lineStyle: "rgba(117,255,236,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(255,237,145,0.5)",
    areaStyleBottom: "rgba(255,237,145,0)",
    lineStyle: "rgba(255,237,145,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(8,117,253,0.5)",
    areaStyleBottom: "rgba(8,117,253,0)",
    lineStyle: "rgba(8,117,253,1.00)",
    visible: true,
  },
  {
    name: "",
    data: [],
    areaStyleTop: "rgba(255,103,72,0.5)",
    areaStyleBottom: "rgba(255,103,72,0)",
    lineStyle: "rgba(255,103,72,1.00)",
    visible: true,
  },
]);
let chart1 = null;
const tabActive1 = ref(1);
const dianweis1 = ref([
  {
    label: "基础温差",
    value: "1",
    active: false,
  },
  {
    label: "最高温度",
    value: "2",
    active: false,
  },
  // {
  //   label: "上下层温差",
  //   value: "3",
  //   active: false,
  // },
]);
const getTab = (item) => {
  tabActive1.value = item.value;
  changeTimeType("day");
};
const timeType = ref("day");
const changeTimeType = async (val) => {
  timeType.value = val;
  if (val == "day") {
    changeDateDay();
  }
  if (val == "month") {
    changeDateMonth();
  }
};
const changeDateDay = async () => {
  const params = {
    damPositionNum: props.detailData?.damPositionNum,
    time: timesDay.value,
    type: "day",
  };
  const res = await getCangEchart(params);
  const result = groupArrayWithNameData(res, "sensorId", "sensorName");
  if (result.length != 0) {
    result?.map((item, index) => {
      lineData1.value[index].name = item?.name;
      lineData1.value[index].data = item?.data
        ?.filter((item) => item.temp < 80 && item.temp > -20)
        .map((item) => {
          if (tabActive1.value == "1") {
            return (item.temp - 16).toFixed(2);
          }
          if (tabActive1.value == "2") {
            return item.temp;
          }
        });
      echartTime.value = item.data?.map((item) => (item?.time).slice(-2));
    });
  } else {
    lineData1.value = lineData.value;
    echartTime.value = [];
  }
  initChart1(lineData1.value);
};
const changeDateMonth = async () => {
  const params = {
    damPositionNum: props.detailData?.damPositionNum,
    time: timesMonth.value,
    type: "month",
  };
  const res = await getCangEchart(params);
  const result = groupArrayWithNameData(res, "sensorId", "sensorName");
  if (result.length != 0) {
    result.map((item, index) => {
      lineData1.value[index].name = item?.name;
      lineData1.value[index].data = item?.data
        ?.filter((item) => item.temp < 80 && item.temp > -20)
        .map((item) => {
          if (tabActive1.value == "1") {
            return (item.temp - 16).toFixed(2);
          }
          if (tabActive1.value == "2") {
            return item.temp;
          }
        });
      echartTime.value = item.data?.map((item) => (item?.time).slice(-2));
    });
  } else {
    lineData1.value = lineData.value;
    echartTime.value = [];
  }
  initChart1(lineData1.value);
};
function initChart1(lineData) {
  nextTick(() => {
    chart1 = echarts.init(chartRef1.value);
    updateChart1(lineData);
  });
}
const updateChart1 = (lineData) => {
  if (!chart1) return;

  // 计算 Y 轴范围，确保包含警告线
  const upperLimit = 26; // 强约束区告警值
  const upperLimitRuo = 20; // 弱约束区告警值
  const data = [];
  lineData.map((item) => {
    data.push(...item.data);
  });
  const maxValue = Math.max(...data, upperLimit); // 关键：包含警告线数值
  const maxValueRuo = Math.max(...data, upperLimitRuo); // 关键：包含警告线数值

  const chartOption1 = {
    title: {},
    grid: {
      top: "50",
      bottom: "23%",
      left: "8%",
      right: "6%",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: "0",
      left: "center",
      orient: "horizontal",
      selectedMode: true,
      icon: "rect", // 使用横线图标
      data: lineData
        .filter((item) => item.visible)
        .map((item, index) => ({
          name: item.name,
          // 设置图例项样式
          itemStyle: {
            color: item.lineStyle, // 使用折线的颜色
          },
        })),
      itemStyle: {
        borderWidth: 0, // 边框宽度
      },
      textStyle: {
        color: "#D4EDFC ", // 文字颜色
        fontSize: 14, // 字体大小
        fontWeight: "normal", // 字体粗细
        fontFamily: "Arial", // 字体
        padding: [5, 5, 2, 5], // 文字内边距
      },
      itemWidth: 15, // 横线宽度
      itemHeight: 2, // 横线高度
      itemGap: 8,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: echartTime.value,
        axisLine: {
          lineStyle: {
            color: "#D4EDFC",
          },
        },
        axisLabel: {
          color: "#D4EDFC",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        nameLocation: "end",
        nameGap: 0,
        name: "", //强约束区
        nameTextStyle: {
          color: "#D4EDFC",
          fontSize: "12px",
          padding: [0, 0, 15, -35],
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            width: 0.5,
            opacity: 0.5,
          },
        },
        axisLabel: {
          color: "#D4EDFC",
        },
        // 关键：设置 Y 轴范围，确保警告线可见
        max: Math.ceil(maxValue * 1.1), // 最大值稍微大一点，包含警告线
        // interval: Math.ceil((maxValue - minValue) / 5) // 自动计算间隔
      },
      {
        type: "value",
        nameLocation: "end",
        nameGap: 0,
        name: "", //弱约束区
        nameTextStyle: {
          color: "#D4EDFC",
          fontSize: "12px",
          padding: [0, 0, 15, -35],
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            width: 0.5,
            opacity: 0.5,
          },
        },
        axisLabel: {
          color: "#D4EDFC",
        },
        // 关键：设置 Y 轴范围，确保警告线可见
        max: Math.ceil(maxValueRuo * 1.1), // 最大值稍微大一点，包含警告线
        // interval: Math.ceil((maxValue - minValue) / 5) // 自动计算间隔
      },
    ],
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
        moveHandleSize: 0,
        fillerColor: "#5683a2",
        backgroundColor: "transparent",
        borderColor: "#B6DDF6",
        borderRadius: 0,
        dataBackground: {
          lineStyle: {
            width: 0,
          },
        },
        handleIcon:
          "path://m400,312c-6.62983,0 -12,-5.37017 -12,-12c0,-6.62983 5.37017,-12 12,-12c6.62983,0 12,5.37017 12,12c0,6.62983 -5.37017,12 -12,12z",
        showDetail: false,
        height: 10,
        width: "94%",
        left: "3%",
        bottom: "5%",
      },
    ],
    series: [
      ...lineData
        .filter((item) => item.visible)
        .map((item) => ({
          name: item.name,
          type: "line",
          data: item.data,
          smooth: false,
          symbol: "none",
          lineStyle: {
            color: item.lineStyle,
          },
        })),
      // 警告线系列 - 水平警告线
      {
        name: "警告线",
        type: "line",
        zlevel: 10,

        markLine: {
          silent: true, // 不触发事件
          symbol: "none", // 无箭头
          data: [
            {
              yAxis: upperLimit,
              name: "警戒线",
              lineStyle: {
                type: "dashed",
                color: "#FFD93D",
                width: 2,
              },
              label: {
                show: true,
                position: "insideEndTop",
                formatter: "强约束区:{c}",
                color: "#FFD93D",
              },
            },
            {
              yAxis: upperLimitRuo,
              name: "警告线",
              lineStyle: {
                type: "dashed",
                color: "#FF6B6B",
                width: 2,
              },
              label: {
                show: true,
                position: "insideEndTop",
                formatter: "弱约束区:{c}",
                color: "#FF6B6B",
              },
            },
          ],
        },
        data: [], // 不需要实际数据
      },
    ],
  };
  // console.log('chart', chartOption1)
  chart1.setOption(chartOption1, true); // 强制重新渲染
};

onMounted(async () => {
  await getWarnStatss();
  changeTimeType("day");
});
watch(
  () => props.detailData,
  async (val) => {
    if (val) {
      await getWarnStatss();
      changeTimeType("day");
    }
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
.tree-detail {
  width: 100%;
  height: 100%;
  padding: 8px;
  .card-header {
    height: 35px;
    background-image: linear-gradient(
      269deg,
      rgba(34, 102, 135, 0) 0%,
      #13a4eb 100%
    );
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 14px;
    .title {
      font-family: MicrosoftYaHeiSemibold;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 35px;
      font-weight: 600;
    }
    .logo-button {
      position: absolute;
      right: 25px;
      display: flex;
      align-items: center;
      .logo {
        width: 25px;
        height: 25px;
        cursor: pointer;
        pointer-events: all;
      }
      .right {
        background: url("../../assets/wenkong/right.png") no-repeat;
        background-size: 100% 100%;
      }
      .left {
        background: url("../../assets/wenkong/left.png") no-repeat;
        background-size: 100% 100%;
      }
      .close {
        background: url("../../assets/wenkong/close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .guankong-header {
    margin-top: 0px;
    margin-bottom: 5px;
    &::before {
      width: 300px;
    }
  }
  .information {
    margin-top: 6px;
    margin-bottom: 5px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px;
    .text {
      width: 45%;
      height: 24px;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 400;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .label {
        margin-right: 10px;
        color: #87d5ff;
      }
    }
  }
  .tu {
    width: 100%;
    height: 176px;
    background: rgba(4, 80, 120, 0.4);
    border: 1px solid rgba(108, 204, 255, 0.47);
    border-radius: 6px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    width: 100%;
    margin-top: 15px;
    .item-header {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #87d5ff;
      letter-spacing: 0;
      font-weight: 400;
      div {
        flex: 1;
        text-align: center;
      }
    }
    .box {
      width: 100%;
      height: 145px;
      overflow: hidden;
      overflow-y: auto;
      .empty {
        width: 100%;
        text-align: center;
        color: #cbb6b6;
        line-height: 60px;
      }
    }
    .item {
      width: 100%;
      height: 30px;
      display: flex;
      margin-bottom: 6px;
      background: rgba(0, 83, 126, 0.56);
      border: 1px solid rgba(112, 196, 239, 0.6);
      border-radius: 4px;
      align-items: center;
      div {
        flex: 1;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 400;
      }
      .postpone1 {
        text-align: center;
        .icon {
          display: inline-block;
          margin-bottom: 2px;
          margin-right: 5px;
          width: 10px;
          height: 10px;
          background: url("../../assets/temperature/yichang.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .postpone2 {
        text-align: center;
        .icon {
          display: inline-block;
          margin-bottom: 2px;
          margin-right: 5px;
          width: 10px;
          height: 10px;
          background: url("../../assets/temperature/zhengchang.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .section-item {
    width: 100%;
    .name {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 1px;
      line-height: 24px;
      font-weight: 400;
      width: 100%;
      padding-left: 25px;
      position: relative;

      &::before {
        display: block;
        content: "";
        width: 26px;
        height: 26px;
        position: absolute;
        left: 0;
        top: 2px;
        background: url("https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/yxsk-screen/x1chboa31p_1675157950135_dn3ib3he8s.png")
          no-repeat;
        background-size: 100% 100%;
        margin-right: 5px;
      }
    }
    .tab {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: start;
      .tab-item {
        height: 30px;
        margin-right: 8px;
        padding: 0 8px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 30px;
        font-weight: 400;
        background-image: linear-gradient(
          1deg,
          #46b1ec 2%,
          rgba(55, 179, 247, 0) 100%
        );
        border-radius: 2px;
        pointer-events: all;
        cursor: pointer;
      }
      .hide {
        background-image: linear-gradient(
          1deg,
          #e3a237 2%,
          rgba(247, 162, 55, 0) 98%
        );
        border-radius: 2px;
      }
    }
    .picker {
      width: 210px;
      height: 32px;
      background-image: linear-gradient(
        1deg,
        #46b1ec 2%,
        rgba(55, 179, 247, 0) 100%
      );
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .timeType {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100px;
        padding: 0 5px;
        position: relative;
        &::after {
          content: "";
          width: 0px;
          height: 20px;
          position: absolute;
          right: 0px;
          top: 7px;
          border-right: 1px solid #fff;
        }
        .day {
          width: 24px;
          height: 24px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          font-weight: 400;
          line-height: 24px;
          cursor: pointer;
          margin-right: 8px;
        }
        .active {
          background-image: linear-gradient(
            1deg,
            #e3a237 2%,
            rgba(247, 162, 55, 0) 98%
          );
          border-radius: 2px;
        }
      }
      .picker-box {
        padding-top: 2px;
      }
      :deep(.el-input) {
        border: none;
      }
      :deep(.el-input__wrapper) {
        background-color: rgba(0, 83, 126, 0);
        border: none;
        box-shadow: none;
      }
    }
    .echart {
      margin-top: 8px;
      width: 100%;
      height: 210px;
    }
  }
  .guankong-header1 {
    margin-top: 0px;
    margin-bottom: 10px;
    &::before {
      width: 270px;
    }
  }
}
</style>
