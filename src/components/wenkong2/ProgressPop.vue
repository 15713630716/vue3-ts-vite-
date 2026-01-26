<template>
  <div class="pop-box pointer-events-all">
    <el-dialog v-model="popShow" title="浇筑进度详情" width="1100">
      <div class="content">
        <div class="header">
          <div class="ba"><i>坝段数</i> {{ obtTotals?.damSectionNum }}</div>
          <div class="cang"><i>总仓数</i> {{ obtTotals?.damPositionNum }}</div>
          <div class="zhu">
            <div class="text2">已浇筑</div>
            <div class="num">{{ obtTotals?.pouredNum }}</div>
          </div>
          <div class="zhu unzhu">
            <div class="text2">未浇筑</div>
            <div class="num">{{ obtTotals?.unpouredNum }}</div>
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
            <div class="postpone">计划完成时间</div>
            <div class="postpone">实际完成时间</div>
            <div class="postpone">浇筑进度</div>
            <div class="postpone">浇筑方量</div>
          </div>
          <el-scrollbar height="400px">
            <div
              class="item-table"
              v-for="(item, index) in progressTable"
              :key="`yue${index}`"
            >
              <div class="month" style="flex: 0.5">
                <div class="icon">{{ index + 1 }}</div>
              </div>
              <div class="planNum">
                坝段{{ item.damPositionNum.split("-")[0] }}
              </div>
              <div class="notFinished" v-if="!item.damPositionNum">-</div>
              <div class="planNum">{{ item.damPositionNum }}</div>
              <div class="notFinished" v-if="!item.damPositionNum">-</div>
              <div class="progress progress1" v-if="item.sort == 1">
                强约束区
              </div>
              <div class="progress progress2" v-else>非约束区</div>
              <div class="progress progress3" v-if="!item.sort">-</div>
              <div class="finished" v-if="item.planEndDate">
                {{ item.planEndDate }}
              </div>
              <div class="progress progress3" v-if="!item.planEndDate">-</div>
              <div class="notFinished" v-if="item.actualEndDate">
                {{ item.actualEndDate?.slice(0, 10) }}
              </div>
              <div class="notFinished" v-if="!item.actualEndDate">-</div>
              <div class="notFinished">
                {{ item.scheduleStatus }}
              </div>
              <div class="notFinished" v-if="!item.scheduleStatus">-</div>
              <div class="postpone1">
                {{ item.volume }}
              </div>
              <div class="notFinished" v-if="!item.volume">-</div>
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
import { getTotal, getTotalDetail } from "@/request/temperature";

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
//获取进度数据
const obtTotals = ref();
const obtTotal = async (par: any) => {
  const res = await getTotal(par);
  obtTotals.value = res;
};

const searchKey = ref();
const handleSearch = () => {
  progressTable.value = fuzzySearch(
    progressData.value,
    "damPositionNum",
    searchKey.value
  );
};
const handleClear = () => {
  searchKey.value = "";
  progressTable.value = progressData.value;
};

const progressTable = ref([] as any);
const progressData = ref([
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "1",
    status: "1",
  },
  {
    badaun: "k12",
    baName: "k12-1",
    qu: "弱约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "2",
  },
  {
    badaun: "k11",
    baName: "k11-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "3",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
  {
    badaun: "k13",
    baName: "k13-1",
    qu: "强约束区",
    planTime: "2025.08.03",
    finshTime: "2025.09.03",
    progress: "2",
    status: "1",
  },
]);

const obtTotalDetail = async (par: any) => {
  const res = await getTotalDetail(par);
  progressData.value = res[0].itemList;
};

onMounted(async () => {
  await obtTotal({ planId: "1971234154569814018" });
  await obtTotalDetail({ pageSize: "9999999" });
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
      height: 70px;
      display: flex;
      align-items: top;
      justify-content: start;
      border-bottom: 1px solid rgba(0, 172, 255, 0.5);
      .ba {
        width: 200px;
        height: 53px;
        background: url("../../assets/temperature/zongba.png") no-repeat;
        background-size: 100% 100%;
        padding-left: 65px;
        font-family: PangMenZhengDao;
        font-size: 24px;
        color: #fff;
        letter-spacing: 0;
        font-weight: 600;
        i {
          font-family: MicrosoftYaHei;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
          line-height: 53px;
          margin-right: 5px;
        }
      }
      .cang {
        width: 300px;
        height: 53px;
        background: url("../../assets/temperature/zongcang.png") no-repeat;
        background-size: 100% 100%;
        padding-left: 65px;
        font-family: PangMenZhengDao;
        font-size: 24px;
        color: #fff;
        letter-spacing: 0;
        font-weight: 600;
        i {
          font-family: MicrosoftYaHei;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
          line-height: 53px;
          margin-right: 5px;
        }
      }
      .zhu {
        position: relative;
        padding-left: 30px;
        margin: 0 15px;
        .text2 {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          font-weight: 400;
        }
        .num {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #53ee8a;
          letter-spacing: 0;
          font-weight: 600;
        }
        &::before {
          content: " ";
          position: absolute;
          left: 0px;
          top: 3px;
          width: 25px;
          height: 45px;
          background: url("../../assets/temperature/pouring.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .unzhu {
        .num {
          color: #ffde87;
        }
        &::before {
          background: url("../../assets/temperature/unpouring.png") no-repeat;
          background-size: 100% 100%;
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
        .progress {
          .icon {
            display: inline-block;
            margin-bottom: 2px;
            margin-right: 5px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
          }
        }
        .progress1 {
          .icon {
            background-image: linear-gradient(
              0deg,
              rgba(255, 91, 91, 0.88) 4%,
              rgba(255, 0, 0, 0.38) 99%
            );
          }
        }
        .progress2 {
          .icon {
            background-image: linear-gradient(
              0deg,
              rgba(221, 221, 221, 0.88) 4%,
              rgba(158, 158, 158, 0.38) 97%
            );
          }
        }
        .progress3 {
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
