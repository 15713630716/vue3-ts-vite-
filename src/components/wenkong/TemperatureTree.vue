<template>
  <div class="dam-tree" :class="treeShow === false ? 'treeHide' : 'treeShow'">
    <div v-if="treeShow" class="line-box">
      <div class="tree">
        <div class="header">设备树</div>
        <el-input
          v-model="keyword"
          :suffix-icon="Search"
          class="input-tree"
          placeholder="请输入"
        />
        <el-scrollbar height="760px">
          <el-tree
            ref="treeRef"
            :filter-node-method="filterNode"
            :highlight-current="true"
            :data="dataTree"
            :current-node-key="currentNodeKey"
            node-key="label"
            default-expand-all
            :props="defaultProps"
            :check-strictly="true"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div
                class="custom-tree-node"
                :class="
                  currentNodeKey == data.id ? 'custom-tree-node-active' : ''
                "
              >
                <span
                  class="node"
                  :class="data.status && data.status === 1 ? 'gray' : ''"
                  >{{
                    data.hasOwnProperty("value") == true
                      ? `TH ${data.ba}-01-0${data?.value}`
                      : ""
                  }}
                  {{ node.label }}</span
                >
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <TreeDetail
      v-if="treeName"
      v-model:tree-name="treeName"
      v-model:tree-show="treeShow"
      :treeDetailTab="treeDetailTab"
      :measuredValues="measuredValues"
      :echartDatas="echartDatas"
    ></TreeDetail>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import TreeDetail from "./TreeDetail.vue";
import { getUe } from "@/utils/getUe";
import { getWenkong, getWenkongList } from "@/request/construct";
import { useStoreTuzhi } from "@/store";
import { parseDamSection } from "@/utils/arrayToTree";

// const props = defineProps({
//   dataWenkongTree: {
//     type: Array,
//     default: function () {
//       return [];
//     },
//   },
// });
// const dataTree = ref([]);
// watch(
//   () => props.dataWenkongTree,
//   (val) => {
//     if (val) {
//       // dataTree.value = props.dataWenkongTree
//       console.log('data',dataTree.value);
//     }
//   },
//   { immediate: true }
// );

const storeTuzhi = useStoreTuzhi();

const keyword = ref("");
const treeRef = ref(null);
watch(keyword, (val) => {
  treeRef.value.filter(val);
});
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label?.includes(value);
};
const treeShow = ref(true);
const currentNodeKey = ref("");
const treeName = ref("");
const treeDetailTab = ref({
  ba: "",
  ceng: "",
  dian: "",
  code: "",
});
//对应点的温度实测值
const measuredValues = ref({});
const deviceCode = ref(""); //选中仓的设备code
const handleNodeClick = (data) => {
  if ("children" in data) {
    //点击父元素时全部清空
    treeName.value = "";
    currentNodeKey.value = "";
    measuredValues.value = {
      center: "", // 中心点
      upstream: "", // 上游侧
      surface: "", // 表面点
      downstream: "", // 下游侧
      code: "", // 仓code
      dian: "", // 点序号
    };
  } else {
    currentNodeKey.value = data.id;
    //获取节点详情的title
    treeName.value = `${data.id.split("-").map(Number)[1]}坝段${
      data.id.split("-").map(Number)[2]
    }层仓混凝土温度监测`;
    // 图纸序号储存
    storeTuzhi.setTuzhiStore(`tuzhi${data.id.split("-").map(Number)[1] - 6}`);
    // 向ue传递仓信息
    getUe({ type: "wenkongcang", name: data.code, dian: data.value });

    //处理数据
    deviceCode.value = "";
    measuredValues.value = {
      center: "", // 中心点
      upstream: "", // 上游侧
      surface: "", // 表面点
      downstream: "", // 下游侧
      centerKey: "", // 中心点
      upstreamKey: "", // 上游侧
      surfaceKey: "", // 表面点
      downstreamKey: "", // 下游侧
      code: data.code, // 仓code
      dian: data.value, // 仓code
    };
    dataTemperatureTree.value.map((item) => {
      for (const key in item.dataMap) {
        let obj = parseDamSection(key);
        if (
          obj?.ba == data.id.split("-").map(Number)[1] &&
          obj?.cang == data.id.split("-").map(Number)[2]
        ) {
          deviceCode.value = item.deviceCode;
          if (obj.type == "中心点") {
            measuredValues.value.center = item.dataMap[key];
            measuredValues.value.centerKey = key;
          }
          if (obj.type == "上游侧") {
            measuredValues.value.upstream = item.dataMap[key];
            measuredValues.value.upstreamKey = key;
          }
          if (obj.type == "表面点") {
            measuredValues.value.surface = item.dataMap[key];
            measuredValues.value.surfaceKey = key;
          }
          if (obj.type == "下游侧") {
            measuredValues.value.downstream = item.dataMap[key];
            measuredValues.value.downstreamKey = key;
          }
        }
      }
    });
  }
};
// 监听仓对应的设备变化重新获取值
watch(
  () => deviceCode.value,
  async (val) => {
    if (val) {
      await getEchartDatas(val);
    } else {
      echartDatas.value = [];
    }
  }
);
const echartDatas = ref([]);
// 获取折线图数据
const getEchartDatas = async (deviceCode) => {
  let time = [
    dayjs().subtract(1000, "days").format("YYYY-MM-DD 00:00:00"),
    dayjs().format("YYYY-MM-DD HH:mm:ss"),
  ];
  const params = {
    startTime: time[0],
    endTime: time[1],
    deviceCode: deviceCode,
  };
  const res = await getWenkongList(params);
  echartDatas.value = sortByHeartbeatDate(res);
};
function sortByHeartbeatDate(array) {
  return array.sort((a, b) => {
    return new Date(a.heartbeatDate) - new Date(b.heartbeatDate);
  });
}
const dataTree = ref([]);
const defaultProps = {
  disabled: (data) => {
    if (data.disabled) {
      return true;
    } else {
      return false;
    }
  },
};
// 获取树信息
const getDataTree = () => {
  dataTree.value = [
    {
      label: "拱坝温控监测",
      parentId: "1",
      children: [
        {
          label: "12#坝段",
          parentId: "1-12",
          children: [
            {
              label: "1层仓",
              parentId: "1-12-1",
              code: "k11-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "12",
                  id: "1-12-1-1",
                  code: "k11-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "12",
                  id: "1-12-1-2",
                  code: "k11-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "12",
                  id: "1-12-1-3",
                  status: 2,
                  code: "k11-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "12",
                  id: "1-12-1-4",
                  status: 2,
                  code: "k11-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
        {
          label: "11#坝段",
          parentId: "1-11",
          children: [
            {
              label: "1层仓",
              parentId: "1-11-1",
              code: "k16-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "11",
                  id: "1-11-1-1",
                  code: "k16-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "11",
                  id: "1-11-1-2",
                  code: "k16-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "11",
                  id: "1-11-1-3",
                  status: 2,
                  code: "k16-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "11",
                  id: "1-11-1-4",
                  status: 2,
                  code: "k16-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
        {
          label: "10#坝段",
          parentId: "1-10",
          children: [
            {
              label: "1层仓",
              parentId: "1-10-1",
              code: "k0-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "10",
                  id: "1-10-1-1",
                  code: "k0-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "10",
                  id: "1-10-1-2",
                  code: "k0-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "10",
                  id: "1-10-1-3",
                  status: 2,
                  code: "k0-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "10",
                  id: "1-10-1-4",
                  status: 2,
                  code: "k0-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
        {
          label: "9#坝段",
          parentId: "1-9",
          children: [
            {
              label: "1层仓",
              parentId: "1-9-1",
              code: "k5-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "9",
                  id: "1-9-1-1",
                  code: "k5-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "9",
                  id: "1-9-1-2",
                  code: "k5-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "9",
                  id: "1-9-1-3",
                  status: 2,
                  code: "k5-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "9",
                  id: "1-9-1-4",
                  status: 2,
                  code: "k5-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
        {
          label: "8#坝段",
          parentId: "1-8",
          children: [
            {
              label: "1层仓",
              parentId: "1-8-1",
              code: "k4-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "8",
                  id: "1-8-1-1",
                  code: "k4-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "8",
                  id: "1-8-1-2",
                  code: "k4-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "8",
                  id: "1-8-1-3",
                  status: 2,
                  code: "k4-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "8",
                  id: "1-8-1-4",
                  status: 2,
                  code: "k4-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
        {
          label: "7#坝段",
          parentId: "1-7",
          children: [
            {
              label: "1层仓",
              parentId: "1-7-1",
              code: "k17-57",
              children: [
                {
                  label: "上游点",
                  value: "1",
                  ba: "7",
                  id: "1-7-1-1",
                  code: "k17-57",
                  disabled: true,
                },
                {
                  label: "中心点",
                  value: "2",
                  ba: "7",
                  id: "1-7-1-2",
                  code: "k17-57",
                  disabled: true,
                },
                {
                  label: "表面点",
                  value: "3",
                  ba: "7",
                  id: "1-7-1-3",
                  status: 2,
                  code: "k17-57",
                  disabled: true,
                },
                {
                  label: "下游侧",
                  value: "4",
                  ba: "7",
                  id: "1-7-1-4",
                  status: 2,
                  code: "k17-57",
                  disabled: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

const dataTemperatureTree = ref([]);
const getWenkongData = async () => {
  const res = await getWenkong();
  dataTemperatureTree.value = res.list;
};

onMounted(() => {
  getWenkongData();
  getDataTree();
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
    background: rgba(15, 88, 111, 0.49);
    background-image: linear-gradient(
      34deg,
      rgba(63, 118, 170, 0) 93%,
      rgba(63, 118, 170, 0.5) 100%
    );
    border: 1px solid rgba(110, 181, 242, 0.57);
    border-radius: 14px;
    padding: 6px;
    .tree {
      width: 100%;
      height: 100%;
      background: rgba(3, 60, 93, 0.58);
      background-image: linear-gradient(
        -27deg,
        rgba(63, 118, 170, 0) 98%,
        rgba(63, 118, 170, 0.4) 100%
      );
      border: 1px solid #3cbaf7;
      box-shadow: inset 0 0 19px 0 rgba(88, 207, 255, 0.72);
      border-radius: 12px;
      pointer-events: all;
      .header {
        width: 100%;
        height: 40px;
        margin: 12px 0;
        background-image: linear-gradient(
          186deg,
          rgba(0, 116, 172, 0) 29%,
          rgba(0, 116, 186, 0.66) 100%
        );
        font-family: MicrosoftYaHeiSemibold;
        font-size: 20px;
        color: #ffffff;
        letter-spacing: 0;
        font-weight: 600;
        background: url(../../assets/wenkong/treeTitle_logo.png) no-repeat;
        background-size: 100% 100%;
        padding-left: 75px;
      }
      .input-tree {
        width: 90%;
        margin-left: 5%;
        height: 40px;
        background: rgba(7, 50, 74, 0.26);
        border-radius: 21px;
        border: 1px solid rgba(81, 172, 224, 0.4);
        padding: 0 18px;
        margin-bottom: 5px;
      }
      :deep(.el-input__wrapper) {
        background-color: rgba(7, 50, 74, 0);
        border-radius: 0px;
        padding: 0;
        height: 100%;
        box-shadow: none;
      }

      :deep(.el-input__inner) {
        color: #ffffff;
      }

      :deep(.el-tree--highlight-current) {
        .el-tree-node.is-focusable > .el-tree-node__content {
          color: #fff;
        }
        // .el-tree-node.is-current > .el-tree-node__content {
        //   color: #3cbaf7 !important;
        // }
      }

      :deep(.el-tree) {
        width: 100%;
        padding: 0 15px;
        background-color: rgba(88, 207, 255, 0);
        color: #ffffff;
        .el-tree-node__content {
          background-color: rgba(88, 207, 255, 0) !important;
        }

        .el-tree-node__content {
          height: auto !important;
          margin-bottom: 0;
        }

        .el-icon {
          font-size: 20px;
          color: #5cd4ff;
        }
      }

      .custom-tree-node {
        font-family: MicrosoftYaHei;
        font-size: 18px;
        // color: #ffffff;
        letter-spacing: 0;
        line-height: 45px;
        font-weight: 400;
        padding-left: 10px;
        .gray {
          color: rgba(216, 216, 216, 0.7);
          pointer-events: none !important;
        }
      }
      .custom-tree-node-active {
        font-family: MicrosoftYaHeiSemibold;
        font-size: 18px;
        color: #1ebcf4;
        letter-spacing: 0;
        line-height: 45px;
        font-weight: 600;
      }
    }
  }
  .treeDetailHide {
    opacity: 0;
    transition: all 0.3s;
  }
  .treeDetailShow {
    opacity: 1;
    transition: all 0.3s;
  }
}
:deep(.el-button) {
  height: 30px;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
  font-weight: 400;
  padding: 5px 10px !important;
  line-height: 30px !important;
  box-sizing: border-box !important;
  background-image: linear-gradient(
    180deg,
    rgba(28, 86, 114, 0.89) 0%,
    rgba(70, 124, 158, 0.75) 100%
  );
  border: 1px solid #b6ddf6 !important;
  border-radius: 8px !important;
  & [class*="el-icon-"] + span {
    margin-left: 6px !important;
  }
  .el-button__text--expand {
    letter-spacing: normal;
  }
  &:hover {
    background-image: radial-gradient(
        circle at 50% 1e2%,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0) 50%
      ),
      linear-gradient(180deg, rgba(28, 86, 114, 0.49) 0%, #5aa8d8 100%);
    border: 1px solid #b6ddf6;
    border-radius: 8px;
  }
  &:active {
    background-image: radial-gradient(
        circle at 50% 1e2%,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0) 50%
      ),
      linear-gradient(180deg, rgba(28, 86, 114, 0.49) 0%, #5aa8d8 100%);
    border: 1px solid #b6ddf6;
    border-radius: 8px;
  }
}
:deep(.el-input) {
  width: 130px;
  height: 30px;
  color: white;
  .el-select__wrapper,
  .el-input__wrapper {
    height: 30px;
    line-height: 30px;
    background: transparent;
    border: none;
    box-shadow: none;
    color: white;
    .el-select__selection .el-select__selected-item {
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0.64px;
      font-weight: 400;
    }
    .el-input__inner {
      font-size: 14px;
      color: white;
      &::placeholder {
        color: #606266;
      }
    }
  }
  input {
    color: var(--el-text-color-regular);
  }
}
</style>
