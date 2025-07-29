<template>
  <div class="bimDetail-box pointer-events-all" v-show="Dialog">
    <el-dialog v-model="Dialog" title="发电引水隧洞" width="1600" top="7vh">
      <div class="bim-content">
        <div class="bim-tab">
          <template v-for="tab in [{ name: '安全监测', id: '1' }, { name: '施工地质', id: '2' }]">
            <div :class="tab.id == activeName ? 'tab-active' : ''" @click="handleClick(tab.id)">{{ tab.name }}</div>
          </template>
        </div>
        <div class="tab-content" v-show="activeName == '1'">
          <div class="tab-item">
            <div class="top">
              <div class="title"><img style="width: 16px;height: 16px;margin-right: 10px;"
                  src="../assets/luansheng/tab-title.png" alt="">仪器安装进度</div>
              <div class="tuli" style="display: flex;align-items: center;">
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color:  #35EEE7;margin-right: 5px;"></span>
                  <span>已布设备</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color:  #EEA959;margin-right: 5px;"></span>
                  <span>已开挖未布置设备</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #3B9DFF;margin-right: 5px;"></span>
                  <span>未开挖</span>
                </div>
              </div>
            </div>
            <div class="tab-main">
              <div class="switch"><el-checkbox v-model="checked4">显示山体背景</el-checkbox></div>
              <div class="tab-main1" v-if="checked4"></div>
              <canvas ref="myCanvas4"></canvas>
            </div>
          </div>
          <img style="width: 100%;margin-top: 5px;" src="../assets//luansheng/111.png" alt="">
        </div>
        <div class="tab-content" v-show="activeName == '2'">
          <div class="tab-item">
            <div class="top">
              <div class="title"><img style="width: 16px;height: 16px;margin-right: 10px;"
                  src="../assets/luansheng/tab-title.png" alt="">地质超前预报(粗探)</div>
            </div>
            <div class="tab-main">
              <div class="switch"><el-checkbox v-model="checked1">显示山体背景</el-checkbox></div>
              <div class="tab-main1" v-if="checked1"></div>
              <canvas ref="myCanvas1"></canvas>
            </div>
          </div>
          <div class="tab-item" style="margin: 10px 0;">
            <div class="top">
              <div class="title"><img style="width: 16px;height: 16px;margin-right: 10px;"
                  src="../assets/luansheng/tab-title.png" alt="">地质超前预报(精探)</div>
              <div class="tuli" style="display: flex;align-items: center;">
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #27981b;margin-right: 5px;"></span>
                  <span>均完成</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #ea6d63;margin-right: 5px;"></span>
                  <span>仅完成红外探水预报</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #782ed8;margin-right: 5px;"></span>
                  <span>仅完成地质雷达探测</span>
                </div>
              </div>
            </div>
            <div class="tab-main">
              <div class="switch"><el-checkbox v-model="checked2">显示山体背景</el-checkbox></div>
              <div class="tab-main1" v-if="checked2"></div>
              <canvas ref="myCanvas2"></canvas>
            </div>
          </div>
          <div class="tab-item">
            <div class="top">
              <div class="title"><img style="width: 16px;height: 16px;margin-right: 10px;"
                  src="../assets/luansheng/tab-title.png" alt="">施工地质</div>
              <div class="tuli" style="display: flex;align-items: center;">
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #d5ae9f;margin-right: 5px;"></span>
                  <span>V</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #d8d9b7;margin-right: 5px;"></span>
                  <span>IV类</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #d7c39f;margin-right: 5px;"></span>
                  <span>|||类偏坏</span>
                </div>
                <div class="item">
                  <span
                    style="display: inline-block;width: 30px;height: 15px;background-color: #b29c86;margin-right: 5px;"></span>
                  <span>||类</span>
                </div>
              </div>
            </div>
            <div class="tab-main">
              <div class="switch"><el-checkbox v-model="checked3">显示山体背景</el-checkbox></div>
              <div class="tab-main1" v-if="checked3"></div>
              <canvas ref="myCanvas3"></canvas>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const Dialog = ref(false);

// 发电引水隧洞弹窗
const activeName = ref('0')
const handleClick = (tab: any) => {
  activeName.value = tab
  if (tab == '2') {
    getCanvas()
  }
  if (tab == '1') {
    setTimeout(() => {
      getCanvas1()
    }, 100);
  }
}
const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)
//绘制图片和折线
const myCanvas1 = ref(null) as any
const myCanvas2 = ref(null) as any
const myCanvas3 = ref(null) as any
const myCanvas4 = ref(null) as any
const points = [  // 折线坐标点数组（示例数据）
  { x: 312, y: 120 },
  { x: 355, y: 148 },
  { x: 510, y: 130 },
  { x: 540, y: 85 },
]

const getCanvas = async () => {
  const canvas1 = myCanvas1.value
  const canvas2 = myCanvas2.value
  const canvas3 = myCanvas3.value
  await nextTick()
  if (!canvas1) return;
  if (!canvas2) return;
  if (!canvas3) return;
  const ctx1 = canvas1.getContext('2d')
  const ctx2 = canvas2.getContext('2d')
  const ctx3 = canvas3.getContext('2d')

  // 设置Canvas尺寸（需与图片匹配或自定义）
  canvas1.width = 800
  canvas1.height = 200
  canvas2.width = 800
  canvas2.height = 200
  canvas3.width = 800
  canvas3.height = 200

  // 开始绘制折线
  ctx1.beginPath()
  ctx1.moveTo(points[0].x, points[0].y)
  ctx2.beginPath()
  ctx2.moveTo(points[0].x, points[0].y)
  ctx3.beginPath()
  ctx3.moveTo(points[0].x, points[0].y)

  // 连接各个点
  points.forEach(point => {
    ctx1.lineTo(point.x, point.y)
    ctx2.lineTo(point.x, point.y)
    ctx3.lineTo(point.x, point.y)
  })

  // 设置线条样式
  ctx1.strokeStyle = '#d8d9b0'
  ctx1.lineWidth = 4
  ctx1.lineJoin = 'round' // 折线连接处圆角
  ctx2.strokeStyle = '#d8d9b0'
  ctx2.lineWidth = 4
  ctx2.lineJoin = 'round' // 折线连接处圆角
  ctx3.strokeStyle = '#d8d9b0'
  ctx3.lineWidth = 4
  ctx3.lineJoin = 'round' // 折线连接处圆角

  // 绘制路径
  ctx1.stroke()
  ctx2.stroke()
  ctx3.stroke()


  //开端线段
  const points1 = [  // 开端
    { x: 312, y: 120 },
    { x: 320, y: 124 }
  ]
  // 开始绘制折线
  ctx1.beginPath()
  ctx1.moveTo(points1[0].x, points1[0].y)
  ctx2.beginPath()
  ctx2.moveTo(points1[0].x, points1[0].y)
  ctx3.beginPath()
  ctx3.moveTo(points1[0].x, points1[0].y)

  // 连接各个点
  points1.forEach(point => {
    ctx1.lineTo(point.x, point.y)
    ctx2.lineTo(point.x, point.y)
    ctx3.lineTo(point.x, point.y)
  })

  // 设置线条样式
  ctx1.strokeStyle = '#174a82'
  ctx1.lineWidth = 4
  ctx1.lineJoin = 'round' // 折线连接处圆角
  ctx2.strokeStyle = '#174a82'
  ctx2.lineWidth = 4
  ctx2.lineJoin = 'round' // 折线连接处圆角
  ctx3.strokeStyle = '#174a82'
  ctx3.lineWidth = 4
  ctx3.lineJoin = 'round' // 折线连接处圆角

  // 绘制路径
  ctx1.stroke()
  ctx2.stroke()
  ctx3.stroke()
}
const getCanvas1 = async () => {
  const canvas4 = myCanvas4.value
  await nextTick()
  if (!canvas4) return;
  const ctx4 = canvas4.getContext('2d')

  // 设置Canvas尺寸（需与图片匹配或自定义）
  canvas4.width = 800
  canvas4.height = 200

  // 开始绘制折线
  ctx4.beginPath()
  ctx4.moveTo(points[0].x, points[0].y)

  // 连接各个点
  points.forEach(point => {
    ctx4.lineTo(point.x, point.y)
  })

  // 设置线条样式
  ctx4.strokeStyle = '#3b9dff'
  ctx4.lineWidth = 4
  ctx4.lineJoin = 'round' // 折线连接处圆角

  // 绘制路径
  ctx4.stroke()


  //开端线段
  const points1 = [  // 开端
    { x: 312, y: 120 },
    { x: 320, y: 124 }
  ]
  // 开始绘制折线
  ctx4.beginPath()
  ctx4.moveTo(points1[0].x, points1[0].y)

  // 连接各个点
  points1.forEach(point => {
    ctx4.lineTo(point.x, point.y)
  })

  // 设置线条样式
  ctx4.strokeStyle = '#eea959'
  ctx4.lineWidth = 4
  ctx4.lineJoin = 'round' // 折线连接处圆角

  // 绘制路径
  ctx4.stroke()
}

onMounted(() => {
  handleClick(1)
})

// watch(
//   () => props.dialogBim,
//   () => {
//     if (props.dialogBim) {
//       Dialog.value = true
//       handleClick(1)
//     }
//   },
//   { immediate: true }
// );
defineExpose({
  Dialog,
});
</script>
<style lang="scss" scoped>
.bimDetail-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :deep(.el-dialog) {
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 76, 111, 0.8);
    box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
    border-radius: 0px 32px 0px 32px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 11px;

  }

  :deep(.el-dialog__header) {
    display: flex;
    align-items: center;
  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
    display: block;
    width: 100%;
    height: 35px;
    line-height: 35px;
    background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);
  }

  .bim-content {
    width: 100%;
    height: 845px;

    .bim-tab {
      width: 100%;
      display: flex;
      align-items: center;
      height: 34px;
      color: #fff;
      margin-bottom: 15px;

      div {
        width: 148px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        background: url('../assets/luansheng/tab.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin-right: 10px;
      }

      .tab-active {
        background: url('../assets/luansheng/tab-active.png') no-repeat;
        background-size: 100% 100%;
      }
    }

    .tab-content {
      width: 100%;
      height: 100%;

      .tab-item {
        width: 100%;
        height: 260px;

        .top {
          width: 100%;
          padding: 0px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;

          .title {
            display: flex;
            align-items: center;
            font-size: 16px;
          }
        }

        .tuli {
          .item {
            margin-left: 20px;
            display: flex;
            align-items: center;
            color: #fff;
          }
        }

        .tab-main {
          width: 100%;
          height: 224px;
          margin-top: 10px;
          position: relative;
          background: rgba(11, 45, 66, 0.24);
          border: 1px solid rgba(60, 186, 247, 0.44);
          border-radius: 8px;

          .switch {
            margin-left: 10px;
            position: relative;
            z-index: 999999;

            :deep(.el-checkbox__label) {
              color: #fff;
            }

            :deep(.is-checked) {
              .el-checkbox__label {
                color: #409eff;
              }
            }
          }

          .tab-main1 {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: url('../assets/luansheng/dizhi.png') no-repeat;
            background-size: auto 100%;
            background-position-x: 50%;
            opacity: 1;
          }

          canvas {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999;
            width: 100%;
            height: 100%;
          }
        }

      }
    }
  }
}
</style>
