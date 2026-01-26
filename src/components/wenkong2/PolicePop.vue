<template>
  <div class="pop-box pointer-events-all">
    <el-dialog v-model="popShow" title="报警详情" width="1100">
      <div class="content">
        <div class="header">
          <div class="left">
            <div class="item item1">
              <div class="num">
                {{ policeTotal.handleNum + policeTotal.notHandleNum }}
              </div>
              <div class="text">报警总数</div>
            </div>
            <div class="item item2">
              <div class="num">{{ policeTotal.handleNum }}</div>
              <div class="text">已处理</div>
            </div>
            <div class="item item3">
              <div class="num">{{ policeTotal.notHandleNum }}</div>
              <div class="text">未处理</div>
            </div>
          </div>
          <div class="right">
            <div class="item">
              <div class="text">温度报警</div>
              <div class="num">{{ policeTotal.tempNum }}条</div>
            </div>
            <div class="item">
              <div class="text">监控数据缺失预警</div>
              <div class="num">{{ policeTotal.dataLostNum }}条</div>
            </div>
            <div class="item">
              <div class="text">设备预警</div>
              <div class="num">{{ policeTotal.deviceNum }}条</div>
            </div>
            <div class="item">
              <div class="text">手动报警</div>
              <div class="num">0条</div>
            </div>
            <div class="item">
              <div class="text">最高温度预警</div>
              <div class="num">{{ policeTotal.maxTempNum }}条</div>
            </div>
            <div class="item">
              <div class="text">降温速率预警</div>
              <div class="num">{{ policeTotal.speedRateNum }}条</div>
            </div>
          </div>
        </div>
        <div class="search-box">
          <el-input v-model="searchKey" placeholder="请输入坝段"></el-input>
          <div class="button search" @click="handleSearch">搜索</div>
          <div class="button clear" @click="handleClear">重置</div>
        </div>
        <div class="main">
          <div class="headers">
            <div class="month" style="flex: 0.5">序号</div>
            <div class="planNum">坝段</div>
            <div class="finished">坝块名称</div>
            <div class="notFinished">所在分区</div>
            <div class="postpone">监测状态</div>
            <div class="postpone">当前温度</div>
            <div class="postpone">历史最高温度</div>
            <div class="postpone">报警信息</div>
            <div class="postpone">是否采取措施</div>
          </div>
          <el-scrollbar height="359px">
            <div
              class="item-table"
              v-for="(item, index) in policeTable"
              :key="`yue${index}`"
            >
              <div class="month" style="flex: 0.5">
                <div class="icon">{{ index + 1 }}</div>
              </div>
              <div class="planNum">{{ item.damSectionNum }}</div>
              <div class="planNum">{{ item?.damPositionNum }}</div>
              <div class="planNum">{{ item?.constraintArea || "-" }}</div>
              <div class="postpone1" v-if="item.sensorStatus == 0">
                <i class="icon"></i>
                异常
              </div>
              <div class="postpone2" v-if="item.sensorStatus == 1">
                <i class="icon"></i>
                正常
              </div>
              <div class="postpone2" v-if="!item?.sensorStatus">-</div>
              <div class="finished">{{ item?.currentValue || "-" }}</div>
              <div class="notFinished">{{ item.historyValue || "-" }}</div>
              <div class="police police1" v-if="item.warnStatus == 0">
                <i class="icon"></i>未处理
              </div>
              <div class="police police2" v-if="item.warnStatus == 1">
                <i class="icon"></i>已处理
              </div>
              <div class="police police3" v-if="item.warnStatus == 2">
                <i class="icon"></i>处理中
              </div>
              <div
                class="postpone2"
                v-if="!item?.warnStatus && item?.warnStatus != 0"
              >
                -
              </div>
              <div
                class="postpone1"
                v-if="item.warnStatus == 1 || item.warnStatus == 2"
              >
                是
              </div>
              <div class="postpone2" v-if="item.warnStatus == 0">否</div>
              <div
                class="postpone2"
                v-if="!item?.warnStatus && item?.warnStatus != 0"
              >
                -
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fuzzySearch } from "@/utils/arrayToTree";
import { getWarnLists } from "@/request/temperature";

const props = defineProps({
  policeTotal: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["update:value"]);
const popShow = ref(true);
watch(
  () => popShow.value,
  () => {
    if (!popShow.value) {
      emit("update:value", false);
    }
  }
);

const searchKey = ref();
const handleSearch = () => {
  policeTable.value = fuzzySearch(
    policeData.value,
    "damSectionNum",
    searchKey.value
  );
};
const handleClear = () => {
  searchKey.value = "";
  policeTable.value = policeData.value;
};

const policeTable = ref([] as any);
const policeData = ref([]);
const getWarnListss = async () => {
  const res = await getWarnLists();
  if (res?.length) {
    policeData.value = res;
  } else {
    policeData.value = [];
  }
};

onMounted(async () => {
  await getWarnListss();
  handleClear();
});
</script>
<style lang="scss" scoped>
.pop-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :deep(.el-dialog) {
    background: linear-gradient(
        55deg,
        rgba(63, 118, 170, 0) 0%,
        rgba(63, 118, 170, 0.4) 100%
      ),
      rgba(15, 76, 111, 0.8);
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
    background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13a4eb 100%);
    padding-left: 10px;
    color: #fff;
  }
  :deep(.el-dialog__close) {
    color: #fff;
    font-size: 20px;
    margin-top: 14px;
  }

  .content {
    width: 100%;
    height: 570px;
    padding: 0 10px;
    object-fit: cover;
    .header {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: top;
      justify-content: start;
      border-bottom: 1px solid rgba(0, 172, 255, 0.5);
      .left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 340px;
        height: 110px;
        .item {
          width: 100px;
          height: 110px;
          .num {
            font-family: PangMenZhengDao;
            font-size: 24px;
            letter-spacing: 0;
            text-align: center;
            line-height: 32px;
            font-weight: 600;
          }
          .text {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            line-height: 24px;
            font-weight: 400;
          }
        }
        .item1 {
          background: url("../../assets/temperature/police1.png") no-repeat;
          background-size: 100% 60%;
          background-position-y: 90%;
          .num {
            color: #ff8181;
          }
        }
        .item2 {
          background: url("../../assets/temperature/police2.png") no-repeat;
          background-size: 100% 60%;
          background-position-y: 90%;
          .num {
            color: #ffffff;
          }
        }
        .item3 {
          background: url("../../assets/temperature/police3.png") no-repeat;
          background-size: 100% 60%;
          background-position-y: 90%;
          .num {
            color: #ffb681;
          }
        }
      }
      .right {
        margin-left: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 660px;
        height: 110px;
        .item {
          width: 210px;
          height: 28px;
          background: url("../../assets/temperature/police_bg.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          padding: 0 8px 0 15px;
          .num {
            font-family: MicrosoftYaHeiSemibold;
            font-size: 16px;
            color: #29e8ff;
            font-weight: 600;
          }
        }
      }
    }
    .search-box {
      margin: 10px 0;
      display: flex;
      align-items: center;
      .button {
        width: 60px;
        height: 32px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: rgba(255, 255, 255, 1);
        letter-spacing: 0;
        font-weight: 400;
        text-align: center;
        line-height: 32px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
        border: 1px solid rgba(117, 196, 255, 0.89);
      }
      .clear {
        background-image: radial-gradient(
          circle at 52% 95%,
          rgba(37, 163, 229, 0) 0%,
          rgba(16, 95, 148, 0) 121%
        );
      }
      .search {
        background-image: radial-gradient(
          circle at 52% 95%,
          #25a3e5 0%,
          rgba(16, 95, 148, 0) 121%
        );
      }
    }
    .main {
      width: 100%;
      margin-top: 15px;
      padding: 0 10px;
      .headers {
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
        height: 36px;
        display: flex;
        margin-bottom: 10px;
        background: rgba(45, 164, 227, 0.24);
        align-items: center;
        div {
          flex: 1;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
        .postpone1 {
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
        .police {
          .icon {
            display: inline-block;
            margin-bottom: 2px;
            margin-right: 5px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
          }
        }
        .police1 {
          .icon {
            background-image: linear-gradient(
              0deg,
              rgba(255, 91, 91, 0.88) 4%,
              rgba(255, 0, 0, 0.38) 99%
            );
          }
        }
        .police2 {
          .icon {
            background-image: linear-gradient(
              0deg,
              rgba(221, 221, 221, 0.88) 4%,
              rgba(158, 158, 158, 0.38) 97%
            );
          }
        }
        .police3 {
          .icon {
            background-image: linear-gradient(
              0deg,
              rgba(0, 249, 146, 0.8) 1%,
              rgba(2, 210, 122, 0.07) 100%
            );
          }
        }
        .month {
          .icon {
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 11px;
            margin: 7px auto;
            background-image: radial-gradient(
              circle at 50% 86%,
              rgba(255, 244, 112, 0.8) 0%,
              rgba(148, 108, 16, 0) 86%
            );
            border-radius: 11px;
          }
        }
      }
    }
  }
}
:deep(.el-input) {
  width: 240px;
  height: 32px;
  color: white;
  background: rgba(43, 174, 242, 0);
  border: 1px solid rgba(117, 196, 255, 0.89);
  border-radius: 4px;
  .el-input__wrapper {
    height: 32px;
    line-height: 32px;
    background: transparent;
    border: none;
    box-shadow: none;
    color: white;
    .el-select__selection .el-select__selected-item {
      font-size: 16px;
      color: #ffffff;
      font-weight: 400;
    }
    .el-input__inner {
      font-size: 16px;
      color: white;
      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>
