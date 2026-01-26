<template>
  <div class="pop-box pointer-events-all">
    <el-dialog v-model="popShow" title="规则库" width="1100" top="80px">
      <div class="content">
        <div class="guankong-header">混凝土测温记录表</div>
        <div class="title-text">
          <div class="seaction">
            <div class="label">问题：</div>
            <div class="value">混凝土内部温度超限</div>
          </div>
          <div class="seaction">
            <div class="label">事件：</div>
            <div class="value">2025-11-22</div>
          </div>
          <div class="seaction">
            <div class="label">测点名称：</div>
            <div class="value">混凝土内部温度超限</div>
          </div>
          <div class="seaction">
            <div class="label">位置信息：</div>
            <div class="value">坝段11层</div>
          </div>
        </div>
        <div class="table-box">
          <el-table
            :data="tableDataPage"
            style="width: 100%; background: transparent"
            max-height="300"
          >
            <el-table-column prop="date" label="测温时间" width="130" />
            <el-table-column
              prop="atmosphericTemperature"
              label="大气温度"
              width="100"
            />
            <el-table-column label="各测点温度">
              <el-table-column prop="measurementPoint1" label="测点1" />
              <el-table-column prop="measurementPoint2" label="测点2" />
              <el-table-column prop="measurementPoint3" label="测点3" />
              <el-table-column prop="measurementPoint4" label="测点4" />
            </el-table-column>
            <el-table-column label="内外温差">
              <el-table-column prop="surfaceTemperature" label="表面" />
              <el-table-column prop="internalTemperature" label="内部" />
            </el-table-column>
            <el-table-column prop="timeInterval" label="时间间隔" width="130" />
            <el-table-column prop="" label="裂缝检查" width="100">
              <template #default="scope">
                <div v-if="scope.row.crack == 1" class="statu2">无裂缝</div>
                <div v-if="scope.row.crack == 2" class="statu">有裂缝</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage4"
            :page-size="5"
            :disabled="false"
            :background="false"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="bottom">
          <div class="left">
            <div class="guankong-header">状态正常措施</div>
            <div class="main">
              <el-scrollbar height="300px">
                <div
                  class="item"
                  v-for="(item, index) in statuNormal"
                  :key="`normal${index}`"
                >
                  <div class="text">{{ item.name }}</div>
                  <div class="icon1" v-if="item.status == '1'"></div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="right">
            <div class="guankong-header">状态异常措施</div>
            <div class="main">
              <el-scrollbar height="300px">
                <div class="item">
                  <div class="textHeader">问题</div>
                  <div class="textHeader" style="flex: 2.5">措施</div>
                  <div class="textHeader" style="flex: 0.8">责任人</div>
                  <div class="textHeader" style="flex: 0.8">状态</div>
                </div>
                <div
                  class="item"
                  v-for="(item, index) in statuAbnormal"
                  :key="`abnormal${index}`"
                >
                  <div class="text">{{ item.seaction }}</div>
                  <div class="text" style="flex: 2.5">{{ item.measure }}</div>
                  <div class="text" style="flex: 0.8">{{ item.people }}</div>
                  <div class="text" style="flex: 0.8">
                    <div class="icon1" v-if="item.status == 1"></div>
                    <div class="icon1" v-else>-</div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

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

const tableData = ref([
  {
    date: "2016-05-03",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-03",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-03",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-03",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-04",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-05",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "4h",
    crack: "1",
  },
  {
    date: "2016-05-06",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "5h",
    crack: "2",
  },
  {
    date: "2016-05-07",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "2",
  },
  {
    date: "2016-05-08",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-09",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-09",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
  {
    date: "2016-05-09",
    atmosphericTemperature: "34.5℃",
    measurementPoint1: "24.5℃",
    measurementPoint2: "25.5℃",
    measurementPoint3: "26.5℃",
    measurementPoint4: "26.5℃",
    surfaceTemperature: "30.5℃",
    internalTemperature: "24.5℃",
    timeInterval: "3h",
    crack: "1",
  },
]);
const tableDataPage = ref([] as any);

const currentPage4 = ref(1);
const handleCurrentChange = (val: number) => {
  // console.log(`current page: ${val}`);
  tableDataPage.value = tableData.value.slice(5 * val - 5, 5 * val);
};

const statuNormal = ref([
  {
    name: "一期通水",
    status: "1",
  },
  {
    name: "水管间距确认",
    status: "1",
  },
  {
    name: "进口水温控制",
    status: "1",
  },
  {
    name: "通水流量控制",
    status: "1",
  },
  {
    name: "分层分块",
    status: "1",
  },
  {
    name: "保温措施",
    status: "1",
  },
]);

const statuAbnormal = ref([
  {
    seaction: "最高温度异常",
    measure:
      "严格控温：加强混凝土生产、运输、浇筑全过程、加强混凝土生产、运输、浇筑全过程",
    people: "张三",
    status: "",
  },
  {
    seaction: "基础温度异常",
    measure:
      "严格控温：加强混凝土生产、运输、浇筑全过程、加强混凝土生产、运输、浇筑全过程",
    people: "张三",
    status: "",
  },
  {
    seaction: "内外温度异常",
    measure:
      "严格控温：加强混凝土生产、运输、浇筑全过程、加强混凝土生产、运输、浇筑全过程",
    people: "张三",
    status: "",
  },
  {
    seaction: "上下层温差异常",
    measure:
      "严格控温：加强混凝土生产、运输、浇筑全过程、加强混凝土生产、运输、浇筑全过程",
    people: "张三",
    status: "",
  },
  {
    seaction: "温降速度异常",
    measure:
      "严格控温：加强混凝土生产、运输、浇筑全过程、加强混凝土生产、运输、浇筑全过程",
    people: "张三",
    status: "",
  },
]);

onMounted(() => {
  handleCurrentChange(1);
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
    height: 750px;
    object-fit: cover;
    padding: 0 10px;
    .guankong-header {
      margin-top: 0px;
      margin-bottom: 10px;
      &::before {
        width: 899px;
      }
    }
    .title-text {
      display: flex;
      align-items: center;
      .seaction {
        display: flex;
        align-items: center;
        .value {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
          margin-right: 30px;
        }
        .label {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #87d5ff;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
        }
      }
    }
    .table-box {
      width: 100%;
      height: 315px;
      margin-top: 10px;
      :deep(.el-table) {
        border: none;
        border: 0.5px solid rgba(26, 169, 244, 0.3);
        box-sizing: content-box;
        tr {
          background: rgba(41, 90, 123, 0);
          border: none;
        }
        .el-table__inner-wrapper {
          border: none;
          background: rgba(47, 183, 255, 0);
          .el-table__cell {
            text-align: center;
            background: rgba(47, 183, 255, 0);
            border: 0.5px solid rgba(26, 169, 244, 0.3);
            color: #fff;
          }
        }
        .el-table__header-wrapper {
          background: rgba(47, 183, 255, 0.2);
          .el-table__cell {
            color: #87d5ff;
            font-weight: 400;
            font-size: 16px;
          }
        }
      }
    }
    .pagination {
      width: 100%;
      position: relative;
      height: 40px;
      :deep(.el-pagination) {
        position: absolute;
        right: 0;
        .el-pagination__total {
          color: #d1eeff;
        }
        .el-pagination__goto {
          color: #d1eeff;
        }
        .el-pagination__classifier {
          color: #d1eeff;
        }
        .btn-prev {
          background: rgba(71, 177, 241, 0.5);
          border-radius: 4px;
          color: #fff;
          margin-right: 10px;
        }
        .btn-next {
          background: rgba(71, 177, 241, 0.5);
          border-radius: 4px;
          color: #fff;
          margin-left: 10px;
        }
        .el-pager {
          .number {
            background: transparent;
            color: #d1eeff;
          }
          .btn-quicknext {
            background: transparent;
            color: #d1eeff;
          }
          .is-active {
            background-image: linear-gradient(
              180deg,
              rgba(25, 193, 255, 0) 0%,
              #1fb5ff 99%
            );
            border-radius: 4px;
          }
        }
        .el-pagination__editor {
          width: 40px;
          background: transparent;
          border: none;
          .el-input__wrapper {
            background-image: linear-gradient(
              180deg,
              rgba(58, 186, 255, 0) 0%,
              rgba(58, 186, 255, 0.2) 100%
            );
            border: none;
            background-color: rgba(15, 76, 111, 0);
            box-shadow: none;
            border: 1px solid rgba(61, 148, 255, 0.38);
            padding: 1px 5px;
            .el-input__inner {
              color: #fff;
            }
          }
        }
      }
    }
    .bottom {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: top;
      justify-content: space-between;
      .left {
        width: 300px;
        height: 350px;
        .guankong-header {
          margin-top: 0px;
          margin-bottom: 10px;
          &::before {
            width: 169px;
          }
        }
        .main {
          width: 100%;
          height: 315px;
          .item {
            width: 100%;
            height: 36px;
            background: rgba(0, 73, 111, 0.61);
            border: 0.6px solid rgba(108, 204, 255, 0.47);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 10px;
            margin-bottom: 8px;
            .text {
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: rgba(255, 255, 255, 0.9);
              letter-spacing: 0;
              line-height: 24px;
              font-weight: 400;
            }
            .icon1 {
              width: 18px;
              height: 18px;
              background: url("../../assets/temperature/dui.png") no-repeat;
              background-size: 100%;
            }
          }
        }
      }
      .right {
        width: 680px;
        height: 350px;
        .guankong-header {
          margin-top: 0px;
          margin-bottom: 10px;
          &::before {
            width: 545px;
          }
        }
        .main {
          width: 100%;
          height: 315px;
          .item {
            width: 100%;
            height: 36px;
            background: rgba(0, 73, 111, 0.61);
            border: 0.6px solid rgba(108, 204, 255, 0.47);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 10px;
            margin-bottom: 8px;
            .text {
              flex: 1;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: rgba(255, 255, 255, 0.9);
              letter-spacing: 0;
              line-height: 24px;
              font-weight: 400;
              text-align: center;
              overflow: hidden; /* 溢出隐藏 */
              text-overflow: ellipsis; /* 文本溢出显示省略号 */
              white-space: nowrap; /* 不换行 */
            }
            .textHeader {
              flex: 1;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #87d5ff;
              letter-spacing: 0;
              line-height: 24px;
              font-weight: 400;
              text-align: center;
            }
            .icon1 {
              width: 18px;
              height: 18px;
              background: url("../../assets/temperature/dui.png") no-repeat;
              background-size: 100%;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}
</style>
