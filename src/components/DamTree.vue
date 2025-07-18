<template>
  <div class="dam-tree">
    <div class="dam-main">
      <div class="dam-line">
        <div class="header-box">
          <img class="img" src="../assets/img/jiansheqi/jindu-logo.png" alt="">
          <div class="text">拱坝浇筑进度</div>
          <!-- <div class="logo">
            <div class="on">已完成</div>
            <div class="huang">进行中</div>
            <div class="off">未开始</div>
          </div> -->
        </div>
        <div class="content pointer-events-all">
          <el-input v-model="inputTree" :suffix-icon="Search" class="input-tree" placeholder="请输入序号" />
          <div class="tree-box">
            <el-scrollbar height="720px">
              <el-tree ref="treeRef" :highlight-current="true" :data="dataTree" :current-node-key="currentNodeKey"
                node-key="id" default-expand-all :filter-node-method="filterNode" :props="defaultProps"
                :check-strictly="true" @node-click="handleNodeClick">
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <template v-if="data.parentId && data.no >= 9">
                      <i class="off" v-if="data.actualPer == 1"></i>
                      <i class="huang" v-else-if="data.actualPer && data.actualPer < 1"></i>
                      <i class="on" v-else></i>
                    </template>
                    <i class="off" v-if="data.no < 9"></i>
                    <span class="node">{{ node.jobName }}</span>
                    <span class="data-title">{{ data.no }} </span>
                    <span class="data">{{ data.jobName }}</span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-total" v-if="popTotal">
      <div class="end">已完成:15%</div>
      <div class="ing">正在进行:10层k14-48仓</div>
      <div class="height">当前高程:117-119(米)</div>
      <!-- <div class="after pointer-events-all" @click="popTotal = false"></div> -->
    </div>
    <div class="tree-pop" v-if="treePopShow">
      <div class="header pointer-events-all">
        {{ treePopData.name }}
        <div class="after" @click="treePopShow = false"></div>
      </div>
      <div class="content-pop">
        <div class="item">
          <div class="label">完成进度</div>
          <div class="value">{{ treePopData.stats * 100 }}%</div>
        </div>
        <div class="item">
          <div class="label">进度状态</div>
          <div class="values value1" v-if="treePopData.processStatus == 1">提前</div>
          <div class="values value2" v-if="treePopData.processStatus == 2">延迟</div>
          <div class="values value3" v-if="treePopData.processStatus == 3">正常</div>
          <div class="values value4" v-if="treePopData.processStatus == 4">未开始</div>
          <div class="values value5" v-if="treePopData.processStatus == 5">已经完成</div>
        </div>
        <div class="item">
          <div class="label">计划开始时间</div>
          <div class="value">{{ treePopData.planStartTime }}</div>
        </div>
        <div class="item">
          <div class="label">计划结束时间</div>
          <div class="value">{{ treePopData.planEndTime }}</div>
        </div>
        <div class="item">
          <div class="label">实际开始时间</div>
          <div class="value">{{ treePopData.actualStartTime }}</div>
        </div>
        <div class="item">
          <div class="label">实际结束时间</div>
          <div class="value">{{ treePopData.actualEndTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type TreeInstance } from 'element-plus'
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getUe } from '@/utils/getUe'

const popTotal = ref(true)

const props = defineProps({
  dataDamTree: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const defaultProps = {
  disabled: 'disabled',  // 指定禁用字段
};
//树总体
const dataTree = ref([
  {
    id: 1,
    label: 'Level one 1',
    children: [],
  }
] as any)

watch(
  () => props.dataDamTree,
  () => {
    dataTree.value = props.dataDamTree;
  },
  { immediate: true }
);
//质量中心
const inputTree = ref()

interface Tree {
  [key: string]: any
}

const treeRef = ref<TreeInstance>()
//质量树搜索
watch(inputTree, (val) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.no.includes(value)
}

//树节点弹窗
const treePopShow = ref(false)
const treePopData = ref({} as any)
const currentNodeKey = ref('')
const handleNodeClick = (data: Tree) => {
  if (data.parentId) {
    console.log(data);
    currentNodeKey.value = data.id
    getUe({
      type: 'dam',
      // stats: data?.actualPer || 0,
      name: data.jobName
    })
    treePopShow.value = true
    treePopData.value = {
      name: data.jobName,
      stats: data?.actualPer || 0,
      processStatus: data?.processStatus || 4,
      actualStartTime: data?.actualStartTime || '暂未开始',
      actualEndTime: data?.actualEndTime || '暂未结束',
      planEndTime: data?.planEndTime || '暂无计划',
      planStartTime: data?.planStartTime || '暂无计划',
    }
    // if (data.actualPer) {
    //   ElMessage.warning({ message: `${data.jobName} 未开始`, duration: 3000 });
    // } else {
    //   treePopShow.value = true
    //   treePopData.value = {
    //     name: data.jobName,
    //     stats: data?.actualPer || 0,
    //     actualStartTime: data?.actualStartTime || '暂未开始',
    //     actualEndTime: data?.actualEndTime || '暂未结束',
    //     planEndTime: data?.planEndTime || '暂无计划',
    //     planStartTime: data?.planStartTime || '暂无计划',
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.dam-tree {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .dam-main {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 881px;
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
    border-radius: 14px;
    border: 1px solid rgba(110, 181, 242, 0.57);

    .dam-line {
      width: 388px;
      height: 869px;
      margin: 5px auto;
      background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.35);
      box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
      border-radius: 12px;
      border: 1px solid #3CBAF7;

      .header-box {
        .logo {
          display: flex;
          align-items: center;
          position: absolute;
          right: 0px;
          font-size: 14px;
          color: #FFFFFF;

          .on {
            position: relative;
            margin-right: 28px;

            &::after {
              position: absolute;
              content: '';
              width: 16px;
              height: 16px;
              background: url('../assets/img/jiansheqi/ren-lv.png') no-repeat;
              background-size: 100% 100%;
              left: -23px;
              top: 1px;
            }
          }

          .huang {
            position: relative;
            margin-right: 28px;

            &::after {
              position: absolute;
              content: '';
              width: 16px;
              height: 16px;
              background: url('../assets/img/jiansheqi/ren-huang.png') no-repeat;
              background-size: 100% 100%;
              left: -23px;
              top: 1px;
            }
          }

          .off {
            position: relative;
            margin-right: 15px;

            &::after {
              position: absolute;
              content: '';
              width: 16px;
              height: 16px;
              background: url('../assets/img/jiansheqi/ren-hui.png') no-repeat;
              background-size: 100% 100%;
              left: -23px;
              top: 1px;
            }
          }
        }
      }

      .content {
        width: 362px;
        margin: 14px auto;

        .input-tree {
          width: 100%;
          height: 42px;
          background: rgba(7, 50, 74, 0.26);
          border-radius: 21px;
          border: 1px solid rgba(81, 172, 224, 0.4);
          padding: 0 18px;
          margin-bottom: 15px;
        }

        :deep(.el-input__wrapper) {
          background-color: rgba(7, 50, 74, 0);
          border-radius: 0px;
          padding: 0;
          box-shadow: none;
        }

        :deep(.el-input__inner) {
          color: #FFFFFF;
        }

        .tree-box {
          width: 100%;
          height: 743px;
          padding: 10px;
          background-color: rgba(88, 207, 255, 0);


          :deep(.el-tree) {
            width: 100%;
            background-color: #1FC4FF;
            background-color: rgba(88, 207, 255, 0);
            color: #FFFFFF;
          }

          :deep(.el-tree-node__content) {
            &:hover {
              background-color: rgba(88, 207, 255, 0);
            }
          }

          :deep(.el-tree) {
            .el-tree-node__content {
              background-color: rgba(88, 207, 255, 0) !important;

              .el-icon {
                position: absolute;
                right: 10px;
                font-size: 16px;
              }
            }

            .el-tree-node__children {
              .is-current {
                .el-tree-node__content {
                  color: #3CBAF7;
                }

                // .el-tree-node__content {
                //   color: #FFFFFF;
                // }
              }
            }
          }


          .custom-tree-node {
            width: 100%;
            display: flex;
            align-items: center;

            .data-title {
              font-size: 14px;
              font-weight: bold;
              margin-right: 10px;
            }

            .on {
              width: 17px;
              height: 17px;
              display: inline-block;
              background: url('../assets/img/jiansheqi/ren-hui.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 8px;
            }

            .huang {
              width: 17px;
              height: 17px;
              display: inline-block;
              background: url('../assets/img/jiansheqi/ren-huang.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 8px;
            }

            .off {
              width: 17px;
              height: 17px;
              display: inline-block;
              background: url('../assets/img/jiansheqi/ren-lv.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }


  .pop-total {
    width: 540px;
    height: 35px;
    position: absolute;
    color: #FFFFFF;
    top: 0px;
    left: -797px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    // background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.35);
    // box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
    // border-radius: 4px;
    // border: 1px solid #3CBAF7;

    .after {
      width: 20px;
      height: 20px;
      background: url('../assets/img/weilai/cha.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }


    .end {
      padding: 2px 7px;
      background-image: linear-gradient(0deg, rgba(0, 249, 146, 0.80) 1%, rgba(2, 210, 122, 0.07) 100%);
      border-radius: 4px;
    }

    .ing {
      padding: 2px 7px;
      background-image: linear-gradient(0deg, rgba(231, 199, 19, 0.94) 6%, rgba(129, 139, 13, 0.29) 99%);
      border-radius: 4px;
    }

    .height {
      padding: 2px 7px;
      background-image: linear-gradient(0deg, rgba(231, 199, 19, 0.94) 6%, rgba(129, 139, 13, 0.29) 99%);
      border-radius: 4px;
    }
  }

  .tree-pop {
    width: 410px;
    min-height: 306px;
    position: absolute;
    top: 420px;
    left: -440px;
    background: url('../assets/img/weilai/pop-bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 21px 24px;

    .header {
      width: 100%;
      height: 35px;
      line-height: 35px;
      font-family: MicrosoftYaHeiSemibold;
      font-size: 18px;
      color: #FFFFFF;
      background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);
      padding-left: 16px;
      position: relative;

      .after {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 7px;
        right: 0px;
        background: url('../assets/img/weilai/cha.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .content-pop {
      width: 100%;
      min-height: 230px;
      padding: 9px;

      .item {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #FFFFFF;

        .label {
          width: 100px;
          margin-right: 24px;
          color: rgba(135, 213, 255, 1);
          line-height: 40px;
        }

        .values {
          width: auto;
          padding: 0px 15px;
          height: 26px;
          text-align: center;
          line-height: 26px;
        }

        .value1 {
          background-image: linear-gradient(0deg, rgba(4, 176, 243, 0.94) 6%, rgba(11, 130, 201, 0.29) 99%);
          border-radius: 4px;
        }

        .value2 {
          background-image: linear-gradient(0deg, rgba(246, 76, 76, 0.78) 3%, rgba(255, 46, 46, 0.29) 99%);
          border-radius: 4px;
        }

        .value3 {
          background-image: linear-gradient(0deg, rgba(231, 199, 19, 0.94) 6%, rgba(129, 139, 13, 0.29) 99%);
          border-radius: 4px;
        }

        .value4 {
          background-image: linear-gradient(0deg, rgba(162, 153, 153, 0.78) 3%, rgba(58, 56, 56, 0.29) 99%);
          border-radius: 4px;
        }

        .value5 {
          background-image: linear-gradient(0deg, rgba(0, 249, 146, 0.80) 1%, rgba(2, 210, 122, 0.07) 100%);
          border-radius: 4px;
        }
      }
    }

  }
}
</style>