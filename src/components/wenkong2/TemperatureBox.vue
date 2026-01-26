<template>
  <div class="dam-tree">
    <template v-if="!detailTemperatureShow">
      <div class="pouring-progress box">
        <div class="line-box">
          <div class="header-box">
            <img
              class="img"
              src="../../assets/temperature/jiaozhu.svg"
              alt=""
            />
            <div class="text">浇筑进度</div>
            <div class="detail" @click="detailProgress()">详情</div>
          </div>
          <div class="total">
            <div class="left">
              <div class="top">坝段数</div>
              <div class="bottom">{{ obtTotals?.damSectionNum }}</div>
            </div>
            <div class="right">
              <div class="top">
                <div class="text">总仓数</div>
                <div class="item">
                  <div class="text2">已浇筑</div>
                  <div class="num">{{ obtTotals?.pouredNum }}</div>
                </div>
              </div>
              <div class="bottom">
                <div class="text">{{ obtTotals?.damPositionNum }}</div>
                <div class="item">
                  <div class="text2">未浇筑</div>
                  <div class="num">{{ obtTotals?.unpouredNum }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-main">
            <div
              class="tab-item"
              v-for="item in progressData"
              :key="`tab${item?.year}`"
            >
              <div
                class="top"
                :class="item?.year == tabActive?.year ? 'tabActive' : ''"
                @click="getYear(item)"
              >
                {{ item?.year }}
              </div>
              <div class="bottom">{{ item?.plan }}</div>
            </div>
          </div>
          <div class="table-box">
            <div class="header">
              <div class="month">月份</div>
              <div class="planNum">计划浇筑</div>
              <div class="finished">已浇筑</div>
              <div class="notFinished">未浇筑</div>
              <div class="postpone">滞后</div>
            </div>
            <el-scrollbar height="120px">
              <div
                class="item-table"
                v-for="item in tabActive?.data"
                :key="`yue${item?.month}`"
              >
                <div class="month">{{ item?.month }}月</div>
                <div class="planNum">
                  {{ item?.pouredNum + item?.unpouredNum }}
                </div>
                <div class="finished">{{ item?.pouredNum }}</div>
                <div class="notFinished">{{ item?.unpouredNum }}</div>
                <div class="postpone">{{ item?.delayNum }}</div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="monitoring box">
        <div class="line-box">
          <div class="header-box">
            <img class="img" src="../../assets/temperature/wen.svg" alt="" />
            <div class="text">温控监测</div>
            <div class="detail" @click="detailTemperature()">详情</div>
          </div>
          <div class="total">
            <div class="item">
              <div class="lable">计划浇筑仓数</div>
              <div class="value">{{ obtTotals?.damPositionNum }}</div>
            </div>
            <div class="item">
              <div class="lable">已埋设仓数</div>
              <div class="value" style="color: #53ee8a">
                {{ obtTotals?.pouredNum }}
              </div>
            </div>
            <div class="item">
              <div class="lable">计划埋设温度计</div>
              <div class="value">{{ obtTotals?.damPositionNum * 4 }}</div>
            </div>
            <div class="item">
              <div class="lable">已埋设温度计</div>
              <div class="value" style="color: #53ee8a">
                {{ obtTotals?.pouredNum * 4 }}
              </div>
            </div>
          </div>
          <div class="police-box">
            <div class="police-text">
              <div class="lable" @click="detailPolice()">
                报警信息<i class="icon"></i>
              </div>
              <div class="value">
                {{ policeTotal.handleNum + policeTotal.notHandleNum || "0" }}
              </div>
            </div>
            <div class="unprocessed">
              <div class="lable">未处理</div>
              <div class="value">{{ policeTotal.notHandleNum || "0" }}</div>
            </div>
            <div class="processed">
              <div class="lable">已处理</div>
              <div class="value">{{ policeTotal.handleNum || "0" }}</div>
            </div>
          </div>
          <div class="police-tab">
            <div
              :class="policeTab == 1 ? 'policeActive' : ''"
              @click="policeTab = 1"
            >
              坝段监测
            </div>
            <div
              :class="policeTab == 2 ? 'policeActive' : ''"
              @click="policeTab = 2"
            >
              分区监测
            </div>
          </div>
          <div class="table-box" v-if="policeTab == 1">
            <div class="header">
              <div class="month" style="flex: 2">测点</div>
              <div class="planNum">所属坝段</div>
              <div class="finished">当前温度</div>
              <div class="notFinished">历史最高</div>
              <div class="postpone">状态</div>
            </div>
            <el-scrollbar height="150px">
              <div
                class="item-table"
                v-for="item in policeData[policeTab - 1]"
                :key="`yue${item.month}`"
              >
                <div class="month" style="flex: 2">
                  {{ item.sensorName || "-" }}
                </div>
                <div class="planNum">
                  坝段{{ item.sensorName?.split("-")[0] || "-" }}
                </div>
                <div class="finished">{{ item.currentValue || "-" }}</div>
                <div class="notFinished">{{ item.historyValue || "-" }}</div>
                <div class="postpone1" v-if="item.status == '0'">异常</div>
                <div class="postpone2" v-else-if="item.status == '1'">正常</div>
                <div class="postpone" v-else>-</div>
              </div>
            </el-scrollbar>
          </div>
          <div class="table-box" v-if="policeTab == 2">
            <div class="header">
              <div class="month" style="flex: 2">测点</div>
              <div class="planNum">所属区域</div>
              <div class="finished">当前温度</div>
              <div class="notFinished">历史最高</div>
              <div class="postpone">状态</div>
            </div>
            <el-scrollbar height="150px">
              <div
                class="item-table"
                v-for="item in policeData[policeTab - 1]"
                :key="`yue${item.month}`"
              >
                <div class="month" style="flex: 2">
                  {{ item.sensorName || "-" }}
                </div>
                <div class="planNum">{{ item.constraintArea || "-" }}</div>
                <div class="finished">{{ item.currentValue || "-" }}</div>
                <div class="notFinished">{{ item.historyValue || "-" }}</div>
                <div class="postpone1" v-if="item.status == '0'">异常</div>
                <div class="postpone2" v-else-if="item.status == '1'">正常</div>
                <div class="postpone" v-else>-</div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="bottom-button">
        <div class="anli button" @click="detailAnli()">案例分析</div>
        <div class="guize button" @click="detailGuize()">规则库</div>
      </div>
    </template>
    <ProgressPop
      v-if="detailProgressShow"
      v-model:value="detailProgressShow"
    ></ProgressPop>
    <TemperaturePop
      v-if="detailTemperatureShow"
      v-model:value="detailTemperatureShow"
      v-model:cangClick="cangClick"
    ></TemperaturePop>
    <PolicePop
      v-if="detailPoliceShow"
      v-model:value="detailPoliceShow"
      :policeTotal="policeTotal"
    ></PolicePop>
    <GuizePop v-if="detailGuizeShow" v-model:value="detailGuizeShow"></GuizePop>
    <AnliPop v-if="detailAnliShow" v-model:value="detailAnliShow"></AnliPop>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import ProgressPop from "./ProgressPop.vue";
import TemperaturePop from "./TemperaturePop.vue";
import PolicePop from "./PolicePop.vue";
import GuizePop from "./GuizePop2.vue";
import AnliPop from "./AnliPop.vue";
import {
  getTotal,
  getTotalYear,
  getWarnStats,
  getWarnTotal,
} from "@/request/temperature";
import { arrAySun } from "@/utils/arrayToTree";
import { getUe } from "@/utils/getUe";

const emit = defineEmits(["update:value"]);
const cangClick = ref();
watch(
  () => cangClick.value,
  () => {
    emit("update:value", [
      {
        name: "强约束区",
        value: false,
        id: "qiang",
      },
      {
        name: "弱约束区",
        value: false,
        id: "ruo",
      },
      {
        name: "非约束区",
        value: false,
        id: "fei",
      },
    ]);
  }
);

const progressData = ref([
  {
    year: 2025,
    plan: 20,
    data: [
      {
        month: "12月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "11月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "10月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "9月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "8月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "7月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "6月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "5月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "4月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "3月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "2月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "1月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
    ],
  },
  {
    year: 2026,
    plan: 420,
    data: [
      {
        month: "12月",
        planNum: 20,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "11月",
        planNum: 22,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "10月",
        planNum: 12,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "9月",
        planNum: 32,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "8月",
        planNum: 22,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "7月",
        planNum: 12,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "6月",
        planNum: 12,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "5月",
        planNum: 12,
        finished: 0,
        notFinished: 0,
        postpone: 0,
      },
      {
        month: "4月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "3月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "2月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "1月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
    ],
  },
  {
    year: 2027,
    plan: 290,
    data: [
      {
        month: "12月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "11月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "10月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "9月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "8月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "7月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "6月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "5月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "4月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "3月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "2月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
      {
        month: "1月",
        planNum: 12,
        finished: 4,
        notFinished: 8,
        postpone: 4,
      },
    ],
  },
]);
//获取进度数据
const obtTotals = ref();
const obtTotal = async (par) => {
  const res = await getTotal(par);
  obtTotals.value = res;
};
const obtTotalYear = async (par) => {
  const res = await getTotalYear(par);
  if (par.year == "2025") {
    progressData.value[0] = {
      year: par.year,
      plan: arrAySun(res, "unpouredNum") + arrAySun(res, "pouredNum"),
      data: res,
    };
  }
  if (par.year == "2026") {
    progressData.value[1] = {
      year: par.year,
      plan: arrAySun(res, "unpouredNum") + arrAySun(res, "pouredNum"),
      data: res,
    };
  }
  if (par.year == "2027") {
    progressData.value[2] = {
      year: par.year,
      plan: arrAySun(res, "unpouredNum") + arrAySun(res, "pouredNum"),
      data: res,
    };
  }
};

const tabActive = ref();
const getYear = (item) => {
  tabActive.value = item;
};

//报警表格信息
const policeTab = ref(1);
const policeData = ref([
  [
    {
      point: "测点1",
      badaun: "坝段18 k1-01仓",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
    {
      point: "测点2",
      badaun: "坝段18 k1-01仓",
      temperature: "23度",
      maxtemperature: "34度",
      status: "2",
    },
    {
      point: "测点3",
      badaun: "坝段18 k1-01仓",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
    {
      point: "测点4",
      badaun: "坝段18 k1-01仓",
      temperature: "23度",
      maxtemperature: "34度",
      status: "2",
    },
    {
      point: "测点5",
      badaun: "坝段18 k1-01仓",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
  ],
  [
    {
      point: "测点1",
      quyu: "强约束区",
      temperature: "23度",
      maxtemperature: "34度",
      status: "2",
    },
    {
      point: "测点2",
      quyu: "强约束区",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
    {
      point: "测点3",
      quyu: "强约束区",
      temperature: "23度",
      maxtemperature: "34度",
      status: "2",
    },
    {
      point: "测点4",
      quyu: "强约束区",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
    {
      point: "测点5",
      quyu: "强约束区",
      temperature: "23度",
      maxtemperature: "34度",
      status: "1",
    },
  ],
]);
const policeTotal = ref({});
const getWarnStatss = async (par) => {
  const res = await getWarnStats(par);
  const resTotal = await getWarnTotal(par);
  // policeData.value = [res.tempWarnList, res.damInfoList];
  policeData.value = [res.tempWarnList, res.tempWarnList];
  policeTotal.value = resTotal;
};

//浇筑进度详情
const detailProgressShow = ref(false);
const detailProgress = () => {
  detailProgressShow.value = true;
};
//温控监测详情
const detailTemperatureShow = ref(false);
const detailTemperature = () => {
  detailTemperatureShow.value = true;
};
//报警信息
const detailPoliceShow = ref(false);
const detailPolice = () => {
  detailPoliceShow.value = true;
};
//规则库
const detailGuizeShow = ref(false);
const detailGuize = () => {
  detailGuizeShow.value = true;
};
//案例分析
const detailAnliShow = ref(false);
const detailAnli = () => {
  detailAnliShow.value = true;
};

onMounted(async () => {
  await obtTotal({
    planId: "1971234154569814018",
  });
  await obtTotalYear({
    planId: "1971234154569814018",
    year: "2025",
  });
  getYear(progressData.value[0]);
  await getWarnStatss({});
  await obtTotalYear({
    planId: "1971234154569814018",
    year: "2026",
  });
  await obtTotalYear({
    planId: "1971234154569814018",
    year: "2027",
  });
});
</script>
<style lang="scss" scoped>
.dam-tree {
  width: 100%;
  height: 100%;
  .line-box {
    width: 100%;
    height: 100%;
    position: relative;
    background: rgba(3, 60, 93, 0.4);
    background-image: linear-gradient(
      -43deg,
      rgba(63, 118, 170, 0) 98%,
      rgba(63, 118, 170, 0.4) 100%
    );
    border: 1px solid #3cbaf7;
    box-shadow: inset 0 0 19px 0 rgba(88, 207, 255, 0.72);
    border-radius: 12px;
  }
  .box {
    width: 100%;
    padding: 5px;
    background: rgba(15, 88, 111, 0.39);
    background-image: linear-gradient(
      50deg,
      rgba(63, 118, 170, 0) 93%,
      rgba(63, 118, 170, 0.4) 100%
    );
    border: 1px solid rgba(110, 181, 242, 0.57);
    border-radius: 14px;
    .header-box {
      position: relative;
      .detail {
        position: absolute;
        right: 15px;
        width: 56px;
        height: 24px;
        background-image: linear-gradient(
          0deg,
          rgba(4, 176, 243, 0.94) 6%,
          rgba(11, 130, 201, 0.29) 99%
        );
        border-radius: 12px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 400;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
      }
    }
  }
  .pouring-progress {
    height: 365px;
    .total {
      width: 100%;
      padding: 0 15px;
      margin: 15px 0;
      height: 50px;
      display: flex;
      align-items: center;
      .left {
        width: 120px;
        height: 50px;
        background: url("../../assets/temperature/baduan.png") no-repeat;
        background-size: 100% 100%;
        .top {
          padding-left: 50px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
        }
        .bottom {
          padding-left: 50px;
          font-family: PangMenZhengDao;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 600;
        }
      }
      .right {
        width: 200px;
        height: 50px;
        background: url("../../assets/temperature/cang.png") no-repeat;
        background-size: 100% 100%;
        .top {
          display: flex;
          align-items: center;
          padding-left: 60px;
          position: relative;
          .text {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #ffffff;
            letter-spacing: 0;
            line-height: 24px;
            font-weight: 400;
          }
          .item {
            position: absolute;
            right: -55px;
            width: 125px;
            display: flex;
            align-items: center;
            .text2 {
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 0;
              line-height: 22px;
              font-weight: 400;
              padding-left: 10px;
              margin-right: 5px;
              &::before {
                content: " ";
                position: absolute;
                left: -8px;
                top: 6px;
                width: 14px;
                height: 14px;
                background: url("../../assets/temperature/yijiao.png") no-repeat;
                background-size: 100% 100%;
              }
            }
            .num {
              font-family: PangMenZhengDao;
              font-size: 18px;
              color: #53ee8a;
              letter-spacing: 0;
              line-height: 24px;
              font-weight: 600;
            }
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          padding-left: 60px;
          position: relative;
          .text {
            font-family: PangMenZhengDao;
            font-size: 20px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            line-height: 22px;
            font-weight: 600;
          }
          .item {
            position: absolute;
            right: -55px;
            width: 125px;
            display: flex;
            align-items: center;
            .text2 {
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 0;
              line-height: 22px;
              font-weight: 400;
              padding-left: 10px;
              margin-right: 5px;
              &::before {
                content: " ";
                position: absolute;
                left: -8px;
                top: 6px;
                width: 14px;
                height: 14px;
                background: url("../../assets/temperature/weijiao.png")
                  no-repeat;
                background-size: 100% 100%;
              }
            }
            .num {
              font-family: PangMenZhengDao;
              font-size: 18px;
              color: #ffde87;
              letter-spacing: 0;
              line-height: 24px;
              font-weight: 600;
            }
          }
        }
      }
    }
    .tab-main {
      width: 100%;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tab-item {
        width: 110px;
        background-image: linear-gradient(
          179deg,
          rgba(106, 203, 246, 0.14) 33%,
          rgba(86, 189, 255, 0.62) 100%
        );
        .top {
          width: 110px;
          height: 28px;
          background: url("../../assets/temperature/tab.png") no-repeat;
          background-size: 100% 100%;
          font-family: MicrosoftYaHeiSemibold;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 28px;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
        }
        .tabActive {
          background: url("../../assets/temperature/tab-active.png") no-repeat;
          background-size: 100% 100%;
        }
        .bottom {
          width: 110px;
          height: 28px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0;
          line-height: 28px;
          font-weight: 400;
          text-align: center;
        }
      }
    }
    .table-box {
      width: 100%;
      height: 160px;
      margin-top: 8px;
      padding: 0 10px;
      .header {
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
      .item-table {
        width: 100%;
        height: 32px;
        display: flex;
        margin-bottom: 10px;
        background: rgba(45, 164, 227, 0.24);
        align-items: center;
        div {
          flex: 1;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
      }
    }
  }
  .monitoring {
    height: 475px;
    margin: 10px 0;
    .total {
      width: 100%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        width: 184px;
        height: 36px;
        margin-bottom: 8px;
        background: url("../../assets/temperature/total-bg.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        line-height: 36px;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 400;
        .value {
          font-family: PangMenZhengDao;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          font-weight: 600;
        }
      }
    }
    .police-box {
      width: 100%;
      height: 65px;
      background: url("../../assets/temperature/police.png") no-repeat;
      background-size: 100% 60%;
      background-position-y: 100%;
      display: flex;
      .police-text {
        position: relative;
        padding-left: 90px;
        .lable {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
          cursor: pointer;
          .icon {
            display: inline-block;
            width: 9px;
            height: 15px;
            background: url("../../assets/temperature/goDetail.png") no-repeat;
            background-size: 100% 100%;
            margin-left: 5px;
          }
        }
        .value {
          font-family: PangMenZhengDao;
          font-size: 18px;
          color: #ff8181;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
        &::before {
          content: " ";
          position: absolute;
          left: 15px;
          top: 0px;
          width: 66px;
          height: 56px;
          background: url("../../assets/temperature/police-icon.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .unprocessed {
        position: relative;
        padding-left: 20px;
        margin: 0 15px;
        .lable {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
        .value {
          font-family: PangMenZhengDao;
          font-size: 18px;
          color: #ff8181;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
        &::before {
          content: " ";
          position: absolute;
          left: 2px;
          top: 3px;
          width: 16px;
          height: 34px;
          background: url("../../assets/temperature/unprocessed.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .processed {
        position: relative;
        padding-left: 20px;
        margin: 0 10px;
        .lable {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
        .value {
          font-family: PangMenZhengDao;
          font-size: 18px;
          color: #fff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
        &::before {
          content: " ";
          position: absolute;
          left: 2px;
          top: 3px;
          width: 16px;
          height: 34px;
          background: url("../../assets/temperature/processed.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .police-tab {
      display: flex;
      align-items: center;
      margin: 10px;
      div {
        width: 104px;
        height: 34px;
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 34px;
        font-weight: 400;
        cursor: pointer;
      }
      .policeActive {
        background: url("../../assets/temperature/police-tab.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .table-box {
      width: 100%;
      height: 160px;
      margin-top: 8px;
      padding: 0 0px;
      .header {
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
      .item-table {
        width: 100%;
        height: 32px;
        display: flex;
        margin-bottom: 10px;
        background: rgba(45, 164, 227, 0.24);
        align-items: center;
        div {
          flex: 1;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
        .postpone1 {
          position: relative;
          &::before {
            content: " ";
            position: absolute;
            left: 4px;
            top: 12px;
            width: 10px;
            height: 10px;
            background: url("../../assets/temperature/yichang.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .postpone2 {
          position: relative;
          &::before {
            content: " ";
            position: absolute;
            left: 4px;
            top: 12px;
            width: 10px;
            height: 10px;
            background: url("../../assets/temperature/zhengchang.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .bottom-button {
    width: 100%;
    height: 38px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .button {
      width: 188px;
      height: 38px;
      background: url("../../assets/temperature/but_bg.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 400;
      text-align: center;
      line-height: 38px;
    }
  }
}
</style>
