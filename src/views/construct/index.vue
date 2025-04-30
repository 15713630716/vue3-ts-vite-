<template>
  <div class="index">
    <div class="nav pointer-events-all">
      <div class="item" v-for="(item, index) in navs" :key="item.name" :class="item.active == true ? 'active' : ''"
        @click="getNav1(index)">
        <img :src="item.img" alt="">
        <div class="title">{{ item.name }}</div>
        <div class="active-nav" v-if="item.active && navItems[index]">
          <div class="nav-item" :class="navItem.active == true ? 'nav-item-active' : ''"
            v-for="(navItem, itemIndex) in navItems[index]" :key="navItem.id" @click.stop="getNav2(itemIndex, index)">
            {{ navItem.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-box" v-if="luanshengBoxShow">
      <div class="luansheng">
        <div class="luansheng-box">
          <div class="add" v-if="luanshengItem.id == 2 || luanshengItem.id == 4">
            新增
          </div>
          <div class="header-box">
            <img class="img" src="../../assets/img/jiansheqi/jindu-logo.png" alt="">
            <div class="text">{{ luanshengItem.name }}</div>
          </div>
          <div class="echart-box">
            <div class="item-echart">
              <div class="top none">
                <el-progress color="#07BEFF" :width="90" type="circle" :percentage="50">
                  <template #default="{ percentage }">
                    <div class="bg" style="width: 64px;
                    height: 64px;
                    margin: 0 auto;
                    border-radius: 50%;
                    text-align: center;line-height: 64px;
                    font-size: 22px;
                    color: #fff;
                    background: linear-gradient(0deg, #5BCEFF 0%, rgba(106, 207, 255, 0.21) 100%);">
                      {{ percentage }}<i style="font-size: 16px;">%</i>
                    </div>
                  </template>
                </el-progress>
              </div>
              <div class="bottom">
                未施工
              </div>
            </div>
            <div class="item-echart">
              <div class="top ing">
                <el-progress color="#E9CA7A" :width="90" type="circle" :percentage="50">
                  <template #default="{ percentage }">
                    <div class="bg" style="width: 64px;
                    height: 64px;
                    margin: 0 auto;
                    border-radius: 50%;
                    text-align: center;line-height: 64px;
                    font-size: 22px;
                    color: #fff;
                    background: linear-gradient(0deg, #cbbf82 0%, rgba(210, 195, 130, 0.21) 100%);">
                      {{ percentage }}<i style="font-size: 16px;">%</i>
                    </div>
                  </template>
                </el-progress>
              </div>
              <div class="bottom">
                施工中
              </div>
            </div>
            <div class="item-echart">
              <div class="top succes">
                <el-progress color="#1DDEA8" :width="90" type="circle" :percentage="50">
                  <template #default="{ percentage }">
                    <div class="bg" style="width: 64px;
                    height: 64px;
                    margin: 0 auto;
                    border-radius: 50%;
                    text-align: center;line-height: 64px;
                    font-size: 22px;
                    color: #fff;
                    background: linear-gradient(0deg, #2ccda8 0%, rgba(44, 206, 169, 0.21) 100%);">
                      {{ percentage }}<i style="font-size: 16px;">%</i>
                    </div>
                  </template>
                </el-progress>
              </div>
              <div class="bottom">
                已完成
              </div>
            </div>
          </div>
          <div class="bim-box">
            <div class="header">
              <div class="icon"></div>
              <div class="text">BIM模型</div>
              <div class="line"></div>
            </div>
            <div class="link-box"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="fangzhen-box" v-if="fangzhenBoxShow">
      <div class="wenkong pointer-events-all" v-if="wenkongBox">
        <div class="item" :class="wenkongShow == true ? 'wenkong-active' : ''" @click="getWenKong(1)">典型坝段1</div>
        <div class="item" :class="wenkongShow == false ? 'wenkong-active' : ''" @click="getWenKong(2)">典型坝段2</div>
      </div>
      <div class="yingli" v-if="yingliBox">
        <div class="yingli-top"></div>
        <div class="yingli-right">
          <div class="yingli-line">
            <div class="header-box">
              <img class="img" src="../../assets/img/jiansheqi/yingli-title.png" alt="">
              <div class="text">应力有限元</div>
            </div>
          </div>
        </div>
        <div class="yingli-bottom pointer-events-all">
          <div class="item" :class="yingliShow == 'x' ? 'yingli-active' : ''" @click="getYingLi('x')">UX</div>
          <div class="item" :class="yingliShow == 'y' ? 'yingli-active' : ''" @click="getYingLi('y')">UY</div>
          <div class="item" :class="yingliShow == 'z' ? 'yingli-active' : ''" @click="getYingLi('z')">UZ</div>
        </div>
      </div>
    </div>
    <div class="zhiliang-box" v-if="zhiliangActive">
      <div class="zhiliang-main">
        <div class="zhiliang-line">
          <div class="header-box">
            <img class="img" src="../../assets/img/jiansheqi/yingli-title.png" alt="">
            <div class="text">质量评定列表</div>
            <div class="logo">
              <div class="on">已验评</div>
              <div class="off">未验评</div>
            </div>
          </div>
          <div class="content pointer-events-all">
            <el-input v-model="inputTree" :suffix-icon="Search" class="input-tree" placeholder="请输入工程名称" />
            <div class="tree-box">
              <el-scrollbar height="743px">
                <el-tree ref="treeRef" :expand-on-click-node="false" class="filter-tree" :data="dataTree" node-key="id"
                  default-expand-all :filter-node-method="filterNode" @node-click="handleNodeClick">
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <i class="off" v-if="data.evaluationStatus == 'UnAssess'"></i>
                      <i class="on" v-else></i>
                      <span class="node">{{ node.name }}</span>
                      <span class="data">{{ data.name }}</span>
                      <div>
                      </div>
                    </div>
                  </template>
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <div class="tree-pop" v-if="treePopShow">
        <div class="header pointer-events-all">
          {{ treePopName }}
          <div class="after" @click="treePopShow = false"></div>
        </div>
        <div class="content-pop">
          <div class="item">
            <div class="label">评定时间</div>
            <div class="value">{{ treeDetil.createTime }}</div>
          </div>
          <div class="item">
            <div class="label">评定等级</div>
            <div class="value dengji dengji1">
              合格
            </div>
            <!-- <div class="value dengji dengji2">
              不合格
            </div>
            <div class="value dengji dengji3">
              优良
            </div> -->
          </div>
          <div class="item">
            <div class="label">附件</div>
            <div class="value">暂无</div>
          </div>
          <div class="item">
            <div class="label">现场照片</div>
            <div class="value">暂无</div>
          </div>
        </div>
      </div>
    </div>
    <div class="anquan-box pointer-events-all" v-if="anquanActive">
      <div class="anquan-line">
        <div class="header-box">
          <img class="img" src="../../assets/img/jiansheqi/anquan/title.png" alt="">
          <div class="text">危险源列表</div>
        </div>
        <div class="content-anquan" v-if="false"></div>
        <div class="emty" v-else>
          <img src="../../assets//img/jiansheqi/anquan/emty.png" alt="">
          <div class="text">无危险源预警</div>
        </div>
      </div>
    </div>
    <div class="tuceng pointer-events-all">
      <div class="title">图层控制</div>
      <div class="item">
        <div class="text">村庄</div>
        <div class="switch">
          <el-switch size="small" v-model="tuceng.cunzhuang" />
        </div>
      </div>
      <div class="item">
        <div class="text">现状工程</div>
        <div class="switch">
          <el-switch size="small" v-model="tuceng.xianzhuang" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, type PropType } from 'vue'
import img1 from '@/assets/img/jiansheqi/nav1.png'
import img2 from '@/assets/img/jiansheqi/nav2.png'
import img3 from '@/assets/img/jiansheqi/nav3.png'
import img4 from '@/assets/img/jiansheqi/nav4.png'
import { Search } from '@element-plus/icons-vue'
import { getZhiliangTree, getZhiliangTreeDetil } from '@/request/construct'

const props = defineProps({
  //施工仿真模拟
  iframeDomsgfzmn: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  },
  //建设期重置场景
  iframeDomjianseqi: {
    type: Object as PropType<HTMLIFrameElement>,
    required: true,
  },
});

const tuceng = reactive({
  cunzhuang: '',
  xianzhuang: ''
})

const navs = ref([
  {
    name: '孪生中心',
    img: img1,
    active: false,
  },
  {
    name: '仿真中心',
    img: img2,
    active: false
  },
  {
    name: '质量中心',
    img: img3,
    active: false
  },
  {
    name: '安全中心',
    img: img4,
    active: false
  },
])
const navItems = ref([
  [
    {
      name: '整体工程',
      active: false,
      id: '1'
    }, {
      name: '导流洞',
      active: false,
      id: '2'
    }, {
      name: '混凝土重力拱坝',
      active: false,
      id: '3'
    }, {
      name: '发电引水隧洞',
      active: false,
      id: '4'
    }, {
      name: '管理房',
      active: false,
      id: '5'
    },
  ],
  [
    {
      name: '温控有限元',
      active: false,
      id: '1'
    }, {
      name: '应力有限元',
      active: false,
      id: '2'
    }, {
      name: '施工仿真模拟',
      active: false,
      id: '3'
    },
  ]
])
const zhiliangActive = ref<boolean>(false)
const anquanActive = ref<boolean>(false)
const getNav1 = (indexs: number) => {
  navs.value.map((item: any, index: number) => {
    if (indexs == index) {
      item.active = true
      if (indexs < 2) {
        getNav2(0, indexs)
      } else {
        luanshengBoxShow.value = false
        fangzhenBoxShow.value = false
      }

      if (indexs == 2) {
        console.log(indexs);
        zhiliangActive.value = true
      } else {
        zhiliangActive.value = false
      }
      if (indexs == 3) {
        anquanActive.value = true
      } else {
        anquanActive.value = false
      }
    } else {
      item.active = false
    }
  })
}
const luanshengBoxShow = ref<boolean>(false)
const fangzhenBoxShow = ref<boolean>(false)
const luanshengItem = ref({} as any)
const fangzhenItem = ref({} as any)
const getNav2 = (indexs: number, index: number) => {
  navItems.value[index].map((item: any, itemIndex: number) => {
    if (indexs == itemIndex) {
      item.active = true
    } else {
      item.active = false
    }
  })
  if (index == 0) {
    //孪生中心
    luanshengBoxShow.value = true
    getLuansheng(navItems.value[index][indexs])

  } else {
    luanshengBoxShow.value = false
  }
  if (index == 1) {
    //仿真中心
    fangzhenBoxShow.value = true
    getFangzhen(navItems.value[index][indexs])

  } else {
    fangzhenBoxShow.value = false
  }
}
// 获取孪生中心的信息
const getLuansheng = (item: any) => {
  luanshengItem.value = item
  // 发请求，调接口获取数据，接口还没写
}


// 获取仿真中心的信息
const wenkongBox = ref<boolean>(false)
const yingliBox = ref<boolean>(false)
const getFangzhen = (item: any) => {
  fangzhenItem.value = item
  // 发请求，调接口获取数据，接口还没写
  if (item.id == 1) {
    //温控有限元
    wenkongBox.value = true
    getWenKong(1)//首次触发
  } else {
    wenkongBox.value = false
  }
  if (item.id == 2) {
    //应力有限元
    yingliBox.value = true
    getYingLi('x')
  } else {
    yingliBox.value = false
  }
  if (item.id == 3) {
    //施工仿真模拟
    props.iframeDomsgfzmn.click()
  } else {

  }

}
//温控
const wenkongShow = ref<boolean>()
const getWenKong = (num: number) => {
  if (num == 1) {
    wenkongShow.value = true
  } else {
    wenkongShow.value = false
  }
}
//应力
const yingliShow = ref<string>()
const getYingLi = (num: string) => {
  yingliShow.value = num
}

//质量中心
const inputTree = ref()
import type { TreeInstance } from 'element-plus'

interface Tree {
  [key: string]: any
}

const treeRef = ref<TreeInstance>()

watch(inputTree, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const dataTree = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          }
        ],
      },
    ],
  }
])
const getTreeDatas = async () => {
  const res = await getZhiliangTree()
  console.log('res', res);
  dataTree.value = res
}
//树节点弹窗
const treePopShow = ref(false)
const treePopName = ref('')
const handleNodeClick = (data: Tree) => {
  treePopShow.value = true
  treePopName.value = data.name
  getZhiliangTreeDeti(data.id)
}
// 监听树弹窗关闭时把详细信息弹窗也关闭
watch(
  () => zhiliangActive.value,
  () => {
    if (!zhiliangActive.value) {
      treePopShow.value = false
    }
  }
);
//获取节点详细信息
const treeDetil = ref({} as any)
const getZhiliangTreeDeti = async (id: any) => {
  const res = await getZhiliangTreeDetil(id)
  treeDetil.value = res
  console.log('res', treeDetil.value);
}

onMounted(() => {
  getNav1(0)
  getTreeDatas()
})




</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  padding: 0 24px 0 16px;
  position: relative;
  overflow: hidden;

  .nav {
    width: 266px;
    margin-top: 85px;
    padding-left: 28px;

    .item {
      width: 72px;
      margin-bottom: 23px;
      cursor: pointer;
      position: relative;

      img {
        width: 54px;
        height: 54px;
        margin-left: 6px;
      }

      .title {
        width: 72px;
        height: 26px;
        font-family: MicrosoftYaHeiSemibold;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 26px;
        text-align: left;
        font-style: normal;
      }

      .active-nav {
        position: absolute;
        top: 0;
        right: -170px;
        width: 148px;

        .nav-item {
          width: 100%;
          height: 34px;
          margin-bottom: 16px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 34px;
          text-align: center;
          background: url('../../assets/img/jiansheqi/nav-item.png') no-repeat;
          background-size: 100%;
        }

        .nav-item-active {
          background: url('../../assets/img/jiansheqi/nav-item-active.png') no-repeat;
          background-size: 100%;
        }
      }
    }

    .active {
      position: relative;

      &::after {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        left: -30px;
        top: 20px;
        background: url('../../assets/img/jiansheqi/nav-active.png') no-repeat;
        background-size: 100%;
      }
    }
  }

  .right-box {
    width: 410px;
    position: absolute;
    top: 19px;
    right: 19px;

    .luansheng {
      width: 100%;
      height: 505px;
      background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
      border-radius: 14px;
      border: 1px solid rgba(110, 181, 242, 0.57);
      display: flex;
      align-items: center;
      justify-content: center;

      .luansheng-box {
        width: 398px;
        height: 495px;
        background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.35);
        box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
        border-radius: 12px;
        border: 1px solid #3CBAF7;
        position: relative;

        .add {
          position: absolute;
          top: 10px;
          right: 14px;
          width: 34px;
          height: 21px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 21px;
          letter-spacing: 1px;
          text-align: center;
          cursor: pointer;

          &::after {
            content: '';
            width: 12px;
            height: 12px;
            background: url('../../assets/img/jiansheqi/add.png') no-repeat;
            background-size: 100%;
            position: absolute;
            top: 6px;
            left: -19px;
          }
        }

        .echart-box {
          width: 100%;
          height: 190px;
          padding-top: 24px;
          padding-bottom: 30px;
          padding-left: 10px;
          display: flex;
          align-items: center;
          justify-content: space-around;

          .item-echart {
            width: 93px;
            height: 100%;

            .top {
              width: 86px;
              height: 86px;
              margin: 0 auto;

              .none {

                .bg {
                  width: 64px;
                  height: 64px;
                  font-size: 20px;
                  background: linear-gradient(180deg, #5BCEFF 0%, rgba(106, 207, 255, 0.21) 100%);
                }
              }
            }

            .bottom {
              width: 100%;
              height: 50px;
              background: url('../../assets/img/jiansheqi/jindu-text-bg.png') no-repeat;
              background-size: 100%;
              margin-top: 15px;
              text-align: center;
              line-height: 32px;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
            }
          }
        }

        .bim-box {
          width: 100%;

          .header {
            width: 100%;
            height: 20px;
            display: flex;
            align-items: center;

            .icon {
              width: 20px;
              height: 20px;
              margin-left: 24px;
              margin-right: 9px;
              background: url('../../assets/img/jiansheqi/bim-logo.png') no-repeat;
              background-size: 100%;
            }

            .text {
              font-family: DingTalk, DingTalk;
              font-size: 16px;
              color: #FFFFFF;
              line-height: 19px;
              text-align: center;
              font-style: italic;
            }

            .line {
              width: 250px;
              height: 6px;
              margin-left: 7px;
              background: url('../../assets/img/jiansheqi/bim-xian.png') no-repeat;
              background-size: 100% 100%;
            }
          }

          .link-box {
            width: 352px;
            height: 199px;
            cursor: pointer;
            background-color: #FFFFFF;
            border-radius: 5px;
            margin: 20px auto;
          }
        }
      }
    }
  }

  .fangzhen-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .wenkong {
      width: 250px;
      height: 35px;
      left: 840px;
      position: absolute;
      bottom: 60px;
      background: url('../../assets/img/jiansheqi/wenkong-bg.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item {
        width: 120px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        font-size: 16px;
        color: #FFFFFF;
        cursor: pointer;
      }

      .wenkong-active {
        background: url('../../assets/img/jiansheqi/wenkong-active.png') no-repeat;
        background-size: 100% 100%;
      }
    }

    .yingli {
      width: 100%;
      height: 100%;
      position: absolute;

      .yingli-right {
        position: absolute;
        top: 19px;
        right: 19px;
        width: 410px;
        height: 881px;
        background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
        border-radius: 14px;
        border: 1px solid rgba(110, 181, 242, 0.57);

        .yingli-line {
          width: 398px;
          height: 869px;
          margin: 5px auto;
          background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.35);
          box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
          border-radius: 12px;
          border: 1px solid #3CBAF7;
        }
      }

      .yingli-bottom {
        width: 250px;
        height: 35px;
        left: 840px;
        position: absolute;
        bottom: 60px;
        background: url('../../assets/img/jiansheqi/yingli-bg.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .item {
          width: 80px;
          height: 35px;
          text-align: center;
          line-height: 35px;
          font-size: 16px;
          color: #FFFFFF;
          cursor: pointer;
        }

        .yingli-active {
          background: url('../../assets/img/jiansheqi/yingli-active.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  .zhiliang-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .zhiliang-main {
      position: absolute;
      top: 19px;
      right: 19px;
      width: 410px;
      height: 881px;
      background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
      border-radius: 14px;
      border: 1px solid rgba(110, 181, 242, 0.57);

      .zhiliang-line {
        width: 398px;
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
            right: 19px;
            font-size: 14px;
            color: #FFFFFF;

            .on {
              position: relative;
              margin-right: 40px;

              &::after {
                position: absolute;
                content: '';
                width: 16px;
                height: 16px;
                background: url('../../assets/img/jiansheqi/ren-lv.png') no-repeat;
                background-size: 100% 100%;
                left: -23px;
                top: 1px;
              }
            }

            .off {
              position: relative;

              &::after {
                position: absolute;
                content: '';
                width: 16px;
                height: 16px;
                background: url('../../assets/img/jiansheqi/ren-lan.png') no-repeat;
                background-size: 100% 100%;
                left: -23px;
                top: 1px;
              }
            }
          }
        }

        .content {
          width: 372px;
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

            :deep(.el-tree-node) {
              .el-tree-node__content {
                background-color: rgba(88, 207, 255, 0) !important;

                .el-icon {
                  position: absolute;
                  right: 10px;
                  font-size: 16px;
                }
              }

              .is-current {
                .el-tree-node__content {
                  color: #3CBAF7;

                }

                .el-tree-node__children {
                  .el-tree-node__content {
                    color: #FFFFFF;
                  }
                }
              }
            }

            .custom-tree-node {
              width: 100%;
              display: flex;
              align-items: center;

              .on {
                width: 20px;
                height: 20px;
                display: inline-block;
                background: url('../../assets/img/jiansheqi/ren-lan.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 8px;
              }

              .off {
                width: 20px;
                height: 20px;
                display: inline-block;
                background: url('../../assets/img/jiansheqi/ren-lv.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    .tree-pop {
      width: 410px;
      height: 346px;
      position: absolute;
      top: 309px;
      left: 929px;
      background: url('../../assets/img/weilai/pop-bg.png') no-repeat;
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
          background: url('../../assets/img/weilai/cha.png') no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }

      .content-pop {
        width: 100%;
        height: 270px;
        padding: 9px;

        .item {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #FFFFFF;

          .label {
            width: 64px;
            margin-right: 24px;
            color: rgba(135, 213, 255, 1);
            line-height: 40px;
          }

          .dengji {
            width: 56px;
            height: 24px;
            text-align: center;
            line-height: 24px;
          }

          .dengji1 {
            background: url('../../assets/img/jiansheqi/lv-jun.png') no-repeat;
            background-size: 100% 100%;
          }

          .dengji2 {
            background: url('../../assets/img/jiansheqi/red-ju.png') no-repeat;
            background-size: 100% 100%;
          }

          .dengji3 {
            background: url('../../assets/img/jiansheqi/lan-ju.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }

    }
  }

  .anquan-box {
    position: absolute;
    top: 19px;
    right: 19px;
    width: 410px;
    min-height: 500px;
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
    border-radius: 14px;
    border: 1px solid rgba(110, 181, 242, 0.57);

    .anquan-line {
      width: 398px;
      min-height: 488px;
      margin: 5px auto;
      background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.35);
      box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
      border-radius: 12px;
      border: 1px solid #3CBAF7;

      .content-anquan {
        width: 100%;
      }

      .emty {
        width: 159px;
        height: 120px;
        margin: 100px auto;

        img {
          width: 159px;
          height: 116px;
        }

        .text {
          width: 100%;
          text-align: center;
          color: #FFFFFF;
        }
      }
    }
  }


  .tuceng {
    width: 116px;
    background: rgba(9, 88, 148, 0.28);
    border-radius: 8px;
    border: 1px solid rgba(79, 162, 206, 0.41);
    position: absolute;
    bottom: 0px;
    left: 16px;
    padding: 14px 10px;

    .title {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 35px;
      text-align: left;
    }

    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 28px;
        text-align: left;
      }

      .switch {
        transform: scale(0.7);
        cursor: pointer;
      }

    }
  }

}
</style>