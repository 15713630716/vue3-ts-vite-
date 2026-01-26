<template>
  <div class="pop-box pointer-events-all">
    <div class="foundation" v-if="foundationShow">
      <div class="box">
        <div class="line-box">
          <div class="header-box">
            <img class="img" src="../../assets/temperature/jichu.svg" alt="" />
            <div class="text">基础信息</div>
            <div class="detail" @click="goBack()">返回</div>
          </div>
          <div class="main">
            <div class="left">
              <div class="top">
                <div class="ba">
                  <el-scrollbar height="770px">
                    <div
                      class="item"
                      :class="item.active == true ? 'active' : ''"
                      v-for="item in badaunData"
                      :key="item.id"
                      @click="clickBa(item)"
                    >
                      坝段{{ item.dataLabel }}
                    </div>
                  </el-scrollbar>
                </div>
                <div class="cang">
                  <el-scrollbar height="790px">
                    <div
                      class="item"
                      :class="item.active == true ? 'active' : ''"
                      v-for="item in gaochengData"
                      :key="item.value"
                      @click="clickGaocheng(item)"
                    >
                      高程{{ item.value }}
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="clear" @click="clearAll()">
                <img src="../../assets/temperature/clear-icon.png" alt="" />
                一键清除
              </div>
            </div>
            <div class="right">
              <div class="search-box">
                <el-input
                  v-model="searchKey"
                  placeholder="请输入搜索内容"
                ></el-input>
                <div class="button search" @click="handleSearch">搜索</div>
              </div>
              <div class="scrollbar-box">
                <el-scrollbar height="785px">
                  <div
                    class="item"
                    v-for="item in cangData"
                    :key="item.id"
                    @click="clickCang(item)"
                    :class="itemActive == item.id ? 'item-active' : ''"
                  >
                    <div class="header">
                      <div class="name">{{ item?.damPositionNum }}</div>
                      <div class="state state1" v-if="item?.status == '1'">
                        正常
                      </div>
                      <div class="state state2" v-if="item?.status == '0'">
                        异常
                      </div>
                    </div>
                    <div class="content">
                      <div class="text">
                        <div class="label">名称:</div>
                        <div class="value">{{ item?.damPositionNum }}</div>
                      </div>
                      <div class="text">
                        <div class="label">约束区:</div>
                        <div class="value">{{ item?.constraintArea }}</div>
                      </div>
                      <!-- <div class="text">
                        <div class="label">桩号:</div>
                        <div class="value">{{ item?.stake }}</div>
                      </div> -->
                      <div class="text">
                        <div class="label">高程:</div>
                        <div class="value">{{ item?.endElevation }}m</div>
                      </div>
                      <!-- <div class="text">
                        <div class="label">轴距:</div>
                        <div class="value">{{ item?.wheelbase }}</div>
                      </div> -->
                      <div class="text">
                        <div class="label">材料:</div>
                        <div class="value">{{ item?.material }}</div>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-box" v-if="detailShow">
      <TemperatureDetail
        v-if="detailShow"
        v-model:foundationShow="foundationShow"
        v-model:detailShow="detailShow"
        :detailData="detailData"
      ></TemperatureDetail>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { getBadaun, getGaocheng, getCang } from "@/request/temperature";
import { removeByValue } from "@/utils/arrayToTree";
import TemperatureDetail from "./TemperatureDetail.vue";
import { getUe } from "@/utils/getUe";
import { fuzzySearch } from "@/utils/arrayToTree";

const emit = defineEmits(["update:value", "update:cangClick"]);
const detailShow = ref(false);
const detailData = ref({});
const foundationShow = ref(true);
const goBack = () => {
  emit("update:value", false);
  detailShow.value = false;
  getUe({ type: "temperatureDamSectionClear" });
};
watch(
  () => detailShow.value,
  (val) => {
    if (!val) {
      itemActive.value = "";
      getUe({ type: "wenkongcangNewEnd" });
    }
  },
);

const searchKey = ref();
const handleSearch = () => {
  cangData.value = fuzzySearch(
    cangDataLists.value,
    "damPositionNum",
    searchKey.value,
  );
};
const badaunData = ref([]);
const badaunActive = ref([]);
const obtBadaun = async () => {
  const res = await getBadaun();
  // 初始化选中字段
  res?.forEach((org) => {
    org["active"] = false;
  });
  badaunData.value = res;
};
const clickBa = (item) => {
  item.active = !item.active;
  if (item.active) {
    badaunActive.value.push(item.dataValue);
  } else {
    removeByValue(badaunActive.value, item.dataValue);
  }
  getUe({
    type: "temperatureDamSection",
    code: item.dataLabel,
    state: item.active,
  }); //控制坝段显隐
  gaochengActive.value = []; //重选坝段后要删除已选择的高程
  itemActive.value = ""; //关闭选中的仓
  detailShow.value = false; //关闭选中的仓
};

const gaochengData = ref([]);
const gaochengActive = ref([]);
const obtGaocheng = async (par) => {
  const res = await getGaocheng(par);
  // 初始化选中字段
  let data = [];
  res?.forEach((org) => {
    data.push({
      value: org,
      active: false,
    });
  });
  gaochengData.value = data;
};
const clickGaocheng = (item) => {
  item.active = !item.active;
  if (item.active) {
    gaochengActive.value.push(item.value);
  } else {
    removeByValue(gaochengActive.value, item.value);
  }
  //关闭选中的仓
  itemActive.value = "";
  detailShow.value = false;
};

const cangData = ref([]);
const cangDataLists = ref([]);
const obtCang = async (par) => {
  const res = await getCang(par);
  cangDataLists.value = res;
  cangData.value = res;
};
const itemActive = ref();
const clickCang = (item) => {
  // console.log("item", item);
  itemActive.value = item.id;
  detailData.value = item;
  detailShow.value = true;
  getUe({ type: "wenkongcangNew", name: item?.bimComponentIds });
  foundationShow.value = false;
  emit("update:cangClick", new Date());
};

//一键清除
const clearAll = () => {
  badaunActive.value = [];
  badaunData.value?.forEach((org) => {
    org["active"] = false;
  });
  gaochengActive.value = [];
  gaochengData.value?.forEach((org) => {
    org["active"] = false;
  });
  itemActive.value = ""; //关闭选中的仓
  detailShow.value = false; //关闭选中的仓
  getUe({ type: "temperatureDamSectionClear" });
};

watch(
  () => badaunActive.value,
  () => {
    let str = badaunActive.value.join(",");
    let str1 = gaochengActive.value.join(",");
    obtGaocheng({ damSectionNums: str });
    obtCang({ damSectionNums: str, endElevations: str1 });
  },
  {
    deep: true,
  },
);
watch(
  () => gaochengActive.value,
  () => {
    let str = badaunActive.value.join(",");
    let str1 = gaochengActive.value.join(",");
    obtCang({ damSectionNums: str, endElevations: str1 });
  },
  {
    deep: true,
  },
);

onMounted(() => {
  obtBadaun();
  obtGaocheng({});
  obtCang({});
});
</script>
<style lang="scss" scoped>
.pop-box {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}
.foundation {
  width: 592px;
  height: 100%;
  .main {
    width: 100%;
    height: 840px;
    padding: 13px 10px 7px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 190px;
      height: 100%;
      .top {
        width: 100%;
        height: 790px;
        display: flex;
        justify-content: space-between;
        .ba {
          width: 80px;
          height: 100%;
          .item {
            width: 100%;
            height: 28px;
            background: rgba(12, 89, 133, 0.2);
            border: 1px solid rgba(53, 184, 239, 0.73);
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            letter-spacing: 0;
            font-weight: 400;
            text-align: center;
            line-height: 24px;
            margin-bottom: 8px;
            cursor: pointer;
          }
          .active {
            background-image: linear-gradient(
              0deg,
              rgba(255, 169, 49, 0.8) 2%,
              rgba(255, 175, 60, 0.15) 100%
            );
          }
        }
        .cang {
          width: 80px;
          height: 100%;
          .item {
            width: 100%;
            height: 28px;
            background: rgba(12, 89, 133, 0.2);
            border: 1px solid rgba(53, 184, 239, 0.73);
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            letter-spacing: 0;
            font-weight: 400;
            text-align: center;
            line-height: 24px;
            margin-bottom: 8px;
            cursor: pointer;
          }
          .active {
            background-image: linear-gradient(
              0deg,
              rgba(255, 169, 49, 0.8) 2%,
              rgba(255, 175, 60, 0.15) 100%
            );
          }
        }
      }
      .clear {
        width: 100%;
        height: 27px;
        margin-top: 3px;
        background-image: linear-gradient(
          0deg,
          rgba(4, 176, 243, 0.5) 6%,
          rgba(11, 130, 201, 0.15) 99%
        );
        border: 1px solid #63d0fe;
        border-radius: 1px;
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 27px;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img {
          width: 18px;
          height: 18px;
          margin-right: 4px;
          margin-top: 2px;
        }
      }
    }
    .right {
      width: 340px;
      height: 100%;
      .search-box {
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
        .search {
          background-image: radial-gradient(
            circle at 52% 95%,
            #25a3e5 0%,
            rgba(16, 95, 148, 0) 121%
          );
        }
      }
      .scrollbar-box {
        width: 100%;
        height: 785px;
        .item {
          width: 100%;
          height: 132px;
          margin-top: 8px;
          background: rgba(4, 80, 120, 0.45);
          border: 1px solid rgba(108, 204, 255, 0.47);
          border-radius: 4px;
          border-radius: 4px;
          padding: 5px;
          cursor: pointer;
          .header {
            width: 100%;
            height: 28px;
            background-image: linear-gradient(
              90deg,
              rgba(21, 184, 238, 0.76) 0%,
              rgba(0, 165, 255, 0) 98%
            );
            font-family: MicrosoftYaHeiSemibold;
            font-size: 16px;
            color: #ffffff;
            letter-spacing: 0;
            line-height: 28px;
            font-weight: 600;
            padding-left: 30px;
            position: relative;
            &::before {
              content: " ";
              position: absolute;
              left: 3px;
              top: 2px;
              width: 20px;
              height: 23px;
              background: url("../../assets/temperature/point-cang.png")
                no-repeat;
              background-size: 100% 100%;
            }
            display: flex;
            align-items: center;
            justify-content: space-between;
            .state {
              width: 44px;
              height: 22px;
              text-align: center;
              line-height: 22px;
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 0;
              font-weight: 400;
            }
            .state1 {
              background-image: radial-gradient(
                circle at 47% 1e2%,
                rgba(0, 249, 146, 0.8) 0%,
                rgba(2, 210, 122, 0.4) 100%
              );
              border-radius: 4px;
            }
            .state2 {
              background-image: radial-gradient(
                circle at 50% 92%,
                rgba(255, 122, 122, 0.84) 0%,
                rgba(249, 77, 77, 0.7) 46%
              );
              border-radius: 4px;
            }
          }
          .content {
            margin-top: 6px;
            width: 100%;
            height: 80px;
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
        }
        .item-active {
          background: rgba(0, 83, 126, 0.56);
          border: 1px solid rgba(192, 233, 255, 0.96);
          box-shadow: inset 0 0 12px 0 rgba(30, 176, 239, 0.72);
        }
      }
    }
  }
}
.detail-box {
  width: 410px;
  height: 100%;
  position: absolute;
  top: 0;
  left: -425px;
  z-index: 9999;
  background:
    linear-gradient(
      55deg,
      rgba(63, 118, 170, 0) 0%,
      rgba(63, 118, 170, 0.4) 100%
    ),
    rgba(15, 76, 111, 0.8);
  box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
  border-radius: 0px 32px 0px 32px;
  border: 1px solid rgba(166, 219, 249, 0.75);
}
.box {
  width: 100%;
  height: 100%;
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
:deep(.el-input) {
  width: 268px;
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
