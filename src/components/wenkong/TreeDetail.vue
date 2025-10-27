<template>
  <div
    class="tree-detail"
    :class="treeName === '' ? 'treeDetailHide' : 'treeDetailShow'"
  >
    <div class="card-header">
      <div class="title">{{ treeName }}</div>
      <div class="logo-button">
        <div
          v-if="treeShow"
          class="logo right"
          @click="changeTreeShow(false)"
        ></div>
        <div
          v-if="!treeShow"
          class="logo left"
          @click="changeTreeShow(true)"
        ></div>
        <div class="logo close" @click="getClose()"></div>
      </div>
    </div>
    <div class="tab-over">
      <div
        v-for="(item, index) in tabs"
        :key="`tab` + item.value"
        class="tab"
        :class="item.value == indexTab ? 'tabActive' : ''"
        @click="getOverTab(item.value)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="tab-main">
      <div class="top">
        <div class="left">
          <div class="zhuan">
            <div class="img"></div>
          </div>
          <div class="content"></div>
        </div>
        <div class="right">
          <div class="name">实测值</div>
          <div class="value">{{ measuredValue }} <i class="unit">℃</i></div>
        </div>
      </div>
      <div class="env-title">
        点位布置图
        <div class="line" style="width: 250px"></div>
      </div>
      <div class="tu">
        <img :src="tu_url" alt="" />
      </div>
      <div class="env-title">
        温度检测曲线
        <div class="line" style="width: 233px"></div>
        <div class="setnum" @click="dialogTableVisible = true">预警值设置</div>
      </div>
      <div id="echart" ref="chartRef1"></div>
    </div>
    <el-dialog
      v-model="dialogTableVisible"
      title="预警值设置"
      width="500"
      top="40vh"
    >
      <div class="dialog-content">
        <div class="item">
          <div class="lable">高温预警值:</div>
          <el-input
            v-model="warnMaxValue"
            class="input-tree"
            placeholder="请输入高温预警值"
          />
        </div>
        <div class="item">
          <div class="lable">低温预警值:</div>
          <el-input
            v-model="warnMinValue"
            class="input-tree"
            placeholder="请输入低温预警值"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="setWarn()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import img1 from "@/assets/wenkong/2.png";
import img2 from "@/assets/wenkong/1.png";
import img3 from "@/assets/wenkong/3.png";
import img4 from "@/assets/wenkong/4.png";
import { getUe } from "@/utils/getUe";
import { getWenkongList } from "@/request/construct";
import { useStoreAlarm, useStoreRouter } from "@/store";

const storeAlarm = useStoreAlarm();
const storeRouter = useStoreRouter();

const props = defineProps({
  treeShow: {
    type: Boolean,
    default: true,
  },
  treeName: {
    type: String,
    default: "",
  },
  measuredValues: {
    type: Object,
    default: () => {
      return {};
    },
  },
  echartDatas: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emits = defineEmits(["update:treeShow", "update:treeName"]);

const dialogTableVisible = ref(false);
const indexTab = ref(1);
const tu_url = ref();
//当前点，实测值，仓code
const measuredValue = ref();
const tabs = ref([
  {
    name: "上游点",
    value: 1,
  },
  {
    name: "中心点",
    value: 2,
  },
  {
    name: "表面点",
    value: 3,
  },
  {
    name: "下游侧",
    value: 4,
  },
]);
const getOverTab = (index) => {
  indexTab.value = index;
  getUe({ type: "wenkongdian", name: index });
  if (index == 1) {
    measuredValue.value = props.measuredValues?.upstream || "暂无";
    tu_url.value = img1;
    processEchartData(1);
    setWarn();
  }
  if (index == 2) {
    measuredValue.value = props.measuredValues?.center || "暂无";
    tu_url.value = img2;
    processEchartData(2);
    setWarn();
  }
  if (index == 3) {
    measuredValue.value = props.measuredValues?.surface || "暂无";
    tu_url.value = img3;
    processEchartData(3);
    setWarn();
  }
  if (index == 4) {
    measuredValue.value = props.measuredValues?.downstream || "暂无";
    tu_url.value = img4;
    processEchartData(4);
    setWarn();
  }
};

const getClose = () => {
  emits("update:treeName", "");
  emits("update:treeShow", true);
};
const changeTreeShow = (value) => {
  emits("update:treeShow", value);
};

const processEchartData = (index) => {
  //提取折线图时间
  echatTime.value = props.echartDatas.filter(item => item.dataMap[props.measuredValues?.centerKey])
  .map(item => item.heartbeatDate);
  if (index == 1) {
    //上游点
    lineData1.value[0].data = props.echartDatas
    .filter(item => item.dataMap[props.measuredValues?.upstreamKey])
  .map(item => item.dataMap[props.measuredValues?.upstreamKey]);
  }
  if (index == 2) {
    //中心点
    lineData1.value[0].data = props.echartDatas.filter(item => item.dataMap[props.measuredValues?.centerKey])
  .map(item => item.dataMap[props.measuredValues?.centerKey]);
  }
  if (index == 3) {
    //表面点
    lineData1.value[0].data = props.echartDatas
    .filter(item => item.dataMap[props.measuredValues?.surfaceKey])
  .map(item => item.dataMap[props.measuredValues?.surfaceKey]);
  }
  if (index == 4) {
    //下游侧
    lineData1.value[0].data = props.echartDatas
    .filter(item => item.dataMap[props.measuredValues?.downstreamKey])
  .map(item => item.dataMap[props.measuredValues?.downstreamKey]);
  }
};

/**
 * 图表配置
 */
const chartRef1 = ref(null);
// 折线1数据
const lineData1 = ref([
  {
    name: "实测值",
    data: [15, 18, 20, 23, 18, 25, 28],
    areaStyleTop: "rgba(54,206,255,0.5)",
    areaStyleBottom: "rgba(54,206,255,0.1)",
    lineStyle: "#36ceffff",
    visible: true,
  },
  {
    name: "高温预警",
    data: [],
    lineStyle: "#ff3c2eff",
    visible: true,
  },
  {
    name: "低温预警",
    data: [],
    lineStyle: "#ff9c50ff",
    visible: true,
  },
]);
const echatTime = ref([]);
const warnMaxValue = ref(50);
const warnMinValue = ref(5);
const warnMaxValueArr = ref([]);
const warnMinValueArr = ref([]);
const alarmShow = ref(""); //预警弹窗
//设置预警值
const setWarn = () => {
  dialogTableVisible.value = false;
  warnMaxValueArr.value = [];
  warnMinValueArr.value = [];
  echatTime.value.map((item) => {
    warnMaxValueArr.value.push(warnMaxValue.value);
    warnMinValueArr.value.push(warnMinValue.value);
  });
  nextTick(() => {
    updateChart1();
  });
  lineData1.value.map((item) => {
    if (item.name == "实测值") {
      alarmShow.value = "";
      storeAlarm.setAlarmStore({});
      getUe({
        type: "wenkongdian",
        name: props.measuredValues.code,
        alarm: false,
      });
      item.data.map((items) => {
        if (items > warnMaxValue.value) {
          alarmShow.value = "过高";
          storeAlarm.setAlarmStore({
            alarmShow: "过高",
            treeName: props.treeName,
            code: props.measuredValues.code,
          });
          // 直接刷新当前页面（可能会从浏览器缓存加载）
          window.location.href = storeRouter.routerUrl;
          console.log("href", window.location.href);
          window.location.reload();
          getUe({ type: "qiehuan_cz" });
        }
        if (items < warnMinValue.value) {
          alarmShow.value = "过低";
          storeAlarm.setAlarmStore({
            alarmShow: "过低",
            treeName: props.treeName,
            code: props.measuredValues.code,
          });
          // 直接刷新当前页面（可能会从浏览器缓存加载）
          window.location.href = storeRouter.routerUrl;
          console.log("href", window.location.href);
          window.location.reload();
          getUe({ type: "qiehuan_cz" });
        }
      });
    }
  });
};

let chart1 = null;
const updateChart1 = () => {
  chart1 = echarts.init(chartRef1.value);
  if (!chart1) return;

  const chartOption1 = {
    title: {},
    grid: {
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
      top: "20",
      left: "center",
      orient: "horizontal",
      selectedMode: false,
      icon: "rect", // 使用横线图标
      data: lineData1.value
        .filter((item) => item.visible)
        .map((item) => item.name),
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
      itemGap: 15,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: echatTime.value,
        axisLine: {
          lineStyle: {
            color: "#D4EDFC",
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            // 自定义显示格式
            return value.replace(/^(\d{2})(\d{2})-(\d{2})-(\d{2}).*$/, "$2/$3/$4")
          },
          color: "#D4EDFC",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        nameLocation: "end",
        nameGap: 0,
        name: "(℃)",
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
      ...lineData1.value
        .filter((item) => item.visible)
        .map((item) => ({
          name: item.name,
          type: "line",
          data:
            item.name == "高温预警"
              ? warnMaxValueArr.value
              : item.name == "低温预警"
              ? warnMinValueArr.value
              : item.data,
          smooth: true,
          symbol: "none",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: item?.areaStyleTop || "transparent" }, // 顶部颜色
              { offset: 1, color: item?.areaStyleBottom || "transparent" }, // 底部颜色
            ]),
          },
          lineStyle: {
            color: item.lineStyle,
          },
        })),
    ],
  };
  // console.log("chart", chartOption1);
  chart1.setOption(chartOption1, true); // 强制重新渲染
};

const shebei = ref();
//监听点变化，获取当前仓和初始化
watch(
  () => props.measuredValues,
  () => {
    if (props.measuredValues) {
      nextTick(() => {
        getOverTab(props.measuredValues.dian);
      });
    }
  },
  { immediate: true }
);
watch(
  () => props.echartDatas,
  () => {
    if (props.echartDatas) {
      nextTick(() => {
        getOverTab(props.measuredValues.dian);
      });
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.alarm {
  position: absolute;
  height: 36px;
  top: 60px;
  left: 335px;
  display: flex;
  align-items: center;
  .left {
    width: 36px;
    height: 36px;
    background: url("../../assets/wenkong/alarm-logo.png") no-repeat;
    background-size: 100% 100%;
  }
  .right {
    margin-left: 13px;
    width: auto;
    height: 36px;
    background: url("../../assets/wenkong/alarm-bg.png") no-repeat;
    background-size: 100% 100%;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: justify;
    font-weight: 400;
    line-height: 36px;
    padding: 0 5px;
  }
}
:deep(.el-dialog) {
  background: rgba(4, 80, 120, 0.7);
  border: 1px solid rgba(108, 204, 255, 0.6);
  border-radius: 6px;
  padding: 15px;
}

:deep(.el-dialog__title) {
  padding-left: 10px;
  color: #fff;
  display: block;
  width: 100%;
  height: 35px;
  line-height: 35px;
  background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13a4eb 100%);
}

:deep(.el-dialog__title) {
  padding-left: 10px;
  color: #fff;
}
.dialog-content {
  width: 100%;
  height: 80px;
  .item {
    width: 100%;
    padding-left: 15px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    .lable {
      font-family: MicrosoftYaHeiSemibold;
      font-size: 14px;
      color: #ede6e6;
      letter-spacing: 0;
      font-weight: 400;
      margin-right: 10px;
    }
  }
  .input-tree {
    width: 40%;
    background: rgba(7, 50, 74, 0.46);
    border-radius: 5px;
    border: 1px solid rgba(81, 172, 224, 0.5);
    padding: 0 5px;
  }
  :deep(.el-input__wrapper) {
    background-color: rgba(7, 50, 74, 0);
    border-radius: 0px;
    padding: 0;
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    color: #ffffff;
  }
}
.tree-detail {
  width: 410px;
  height: 803px;
  position: absolute;
  top: 0px;
  left: -436px;
  background: url("../../assets/wenkong/treeDetail_bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 22px 22px;
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
  .tab-over {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    .tab {
      width: 96px;
      height: 46px;
      background: url("../../assets/wenkong/tab.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 10px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      font-weight: 500;
      text-align: center;
      line-height: 46px;
      cursor: pointer;
      pointer-events: all;
    }
    .tabActive {
      background: url("../../assets/wenkong/tab_active.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .tab-main {
    width: 100%;
    padding: 5px;
    margin-top: 15px;
    .env-title {
      width: 100%;
      font-family: MicrosoftYaHeiSemibold;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 600;
      position: relative;
      padding-left: 23px;
      margin: 15px 0;

      &::after {
        display: block;
        position: absolute;
        content: "";
        top: 6px;
        left: 0;
        width: 16px;
        height: 16px;
        background: url(../../assets/wenkong/title_logo.png) no-repeat;
        background-size: 100% 100%;
      }
      .line {
        position: absolute;
        right: 0;
        top: 12px;
        height: 3px;
        background: url(../../assets/wenkong/line.png) no-repeat;
        background-size: 100% 100%;
      }
      .setnum {
        position: absolute;
        right: 0;
        top: 0;
        width: 98px;
        height: 30px;
        background: url(../../assets/wenkong/button.png) no-repeat;
        background-size: 100% 100%;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 400;
        text-align: center;
        cursor: pointer;
      }
    }
    .top {
      width: 100%;
      height: 118px;
      display: flex;
      align-items: center;
      justify-content: start;
      .left {
        width: 118px;
        height: 118px;
        background: url("../../assets/wenkong/zhuan_bg.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        .zhuan {
          width: 100%;
          height: 100%;
          position: relative;
          .img {
            width: 50%;
            height: 50%;
            background: url("../../assets/wenkong/zhuan.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            /* 关键配置：设置变换原点为左上角 */
            transform-origin: left top;
            /* 动画配置 */
            animation: rotate-left-top 3s linear infinite;
          }
        }
        .content {
          width: 60%;
          height: 60%;
          background: url("../../assets/wenkong/logo.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 20%;
          left: 20%;
        }
      }
      .right {
        height: 118px;
        padding: 33px 30px;
        .name {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #87d5ff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
        }
        .value {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          line-height: 32px;
          font-weight: 400;
          .unit {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            line-height: 32px;
            font-weight: 400;
          }
        }
      }
    }
    .tu {
      width: 100%;
      height: 188px;
      background: rgba(4, 80, 120, 0.4);
      border: 1px solid rgba(108, 204, 255, 0.47);
      border-radius: 6px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    #echart {
      width: 100%;
      height: 240px;
    }
  }
}
.treeHide {
  .tree-detail {
    position: absolute;
    right: 0px;
    left: auto;
    transition: all 0.3s;
  }
}
</style>
