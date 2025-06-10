<template>
  <div class="index pointer-events-none">
    <div class="left">
      <div class="info">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/编组 25@2x.png" alt="">
          <div class="text">项目概况</div>
        </div>
        <div class="content">
          <div class="list">
            <div class="label">工程等级</div>
            <div class="value">III等级</div>
          </div>
          <div class="list">
            <div class="label">施工周期</div>
            <div class="value">48个月</div>
          </div>
          <div class="list">
            <div class="label">项目法人</div>
            <div class="value">仙居县水库事务中心</div>
          </div>
          <div class="list">
            <div class="label">设计单位</div>
            <div class="value">浙江省水利水电勘测设计院有限责任公司</div>
          </div>
          <div class="list">
            <div class="label">施工单位</div>
            <div class="value">浙江省第一水电建设集团股份有限公司</div>
          </div>
        </div>
      </div>
      <div class="touzi">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/编组 26@2x.png" alt="">
          <div class="text">投资控制</div>
        </div>
        <div class="content">
          <div class="list">
            <div class="icon icon1">
              <div class="icon-box">
                <div class="value">{{ touziData.rateInvest }} <i>%</i></div>
                <div class="label">投资完成率</div>
              </div>
            </div>
            <div class="text">
              <div class="test-icon"></div>
              <div class="text-content">
                <div class="text-item">
                  <div class="label">总投资</div>
                  <div class="value">{{ touziData.planInvest }} <i>万元</i></div>
                </div>
                <div class="text-item">
                  <div class="label">已完成</div>
                  <div class="value font-color-blue">{{ touziData.completeInvest }} <i style="color: #fff;">万元</i></div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="icon icon2">
              <div class="icon-box">
                <div class="value">{{ touziData.rateChanzhi }} <i>%</i></div>
                <div class="label">产值完成率</div>
              </div>
            </div>
            <div class="text">
              <div class="test-icon"></div>
              <div class="text-content">
                <div class="text-item">
                  <div class="label">计划完成</div>
                  <div class="value">{{ touziData.planChanzhi }} <i>万元</i></div>
                </div>
                <div class="text-item">
                  <div class="label">实际完成</div>
                  <div class="value font-color-green">{{ touziData.completeChanzhi }} <i style="color: #fff;">万元</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="icon icon3">
              <div class="icon-box">
                <div class="value">{{ touziData.rateHetonge }} <i>%</i></div>
                <div class="label">支付完成率</div>
              </div>
            </div>
            <div class="text">
              <div class="test-icon"></div>
              <div class="text-content">
                <div class="text-item">
                  <div class="label">总金额</div>
                  <div class="value">{{ touziData.planHetonge }} <i>万元</i></div>
                </div>
                <div class="text-item">
                  <div class="label">已支付</div>
                  <div class="value font-color-yellow">{{ touziData.completeHetonge }} <i style="color: #fff;">万元</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="jindu">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/jindu.png" alt="">
          <div class="text">进度控制</div>
        </div>
        <div class="content">
          <div class="item-jindu">
            <div class="jindu-left jindu-left1"></div>
            <div class="jindu-right">
              <div class="title">
                计划完成率
                <i>{{ jinduData.planPer }}%</i>
              </div>
              <div class="jindutiao jindutiao1">
                <el-progress :color="'#4E98C7'" :text-inside="true" :stroke-width="8"
                  :percentage="Number(jinduData.planPer)" status="exception">
                  <span></span>
                </el-progress>
              </div>
            </div>
          </div>
          <div class="item-jindu">
            <div class="jindu-left jindu-left2"></div>
            <div class="jindu-right">
              <div class="title">
                实际完成率
                <i>{{ jinduData.actualPer }}%</i>
              </div>
              <div class="jindutiao jindutiao2">
                <el-progress :color="'#3CFFC5'" :text-inside="true" :stroke-width="8" :percentage="jinduData.actualPer"
                  status="exception">
                  <span></span>
                </el-progress>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="shuzi">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/shuzi.png" alt="">
          <div class="text">数字工地</div>
        </div>
        <div class="content pointer-events-all">
          <el-carousel height="240px" :interval="5000" :arrow="'always'" :indicator-position="'none'">
            <el-carousel-item v-for="item in mvss" :key="item">
              <div class="mv-box">
                <div class="title">{{ item.name }}</div>
                <div class="video">
                  <Video :src="item.url"></Video>
                  <!-- <video style="width: 100%; object-fit: cover;" src="../../assets/4.mp4" controls autoplay muted
                    playsinline webkit-playsinline x5-video-player-fullscreen="true" x5-playsinline></video> -->
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="zhiliang">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/zhiliang.png" alt="">
          <div class="text">质量控制</div>
        </div>
        <div class="content">
          <div class="item" v-for="item in zhiliang" :key="item.type">
            <div class="header-zl">{{ item.type }}</div>
            <div class="label">合格率</div>
            <div class="lv">{{ item.qualifiedRate }} <i>%</i> </div>
            <div class="value">({{ item.qualifiedNum }}/{{ item.evaluatedNum }})</div>
          </div>
        </div>
      </div>
      <div class="anquan">
        <div class="header-box">
          <img class="img" src="../../assets/img/home/anquan-title.png" alt="">
          <div class="text">安全控制</div>
        </div>
        <div class="content">
          <div class="icon icon1">
            <div class="icon-box">
              <div class="value">{{ anquan.lv }} <i>%</i></div>
              <div class="label">整改率</div>
            </div>
          </div>
          <div class="text">
            <div class="text-content">
              <div class="text-item">
                <div class="img"></div>
                <div class="label">累计隐患</div>
                <div class="value">{{ anquan.letji }}</div>
              </div>
              <div class="text-item">
                <div class="img"></div>
                <div class="label">现存隐患</div>
                <div class="value font-color-blue">{{ anquan.xiancun }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref,watch } from 'vue'
import Video from '@/components/Video.vue'
import { getInvest, getChanzhi, getHetonge, getProgress, getZhiLiang, getAnQuan } from '@/request/home'

const prop = defineProps({
  mvs: {
    type: Array,
    default: function () {
      return [];
    }
  }
});
const mvss = ref([] as any)
watch(
  () => prop.mvs,
  () => {
    mvss.value = prop.mvs;
  },
  { immediate: true }
);

onMounted(async () => {
  await getTouZi()
  await getProgressData()
  // await getMvs()
  await getZhiLiangs()
  await getAnQuans()
})

const touziData = reactive({
  rateInvest: '' as any,
  planInvest: '' as any,
  completeInvest: '' as any,
  rateChanzhi: '' as any,
  planChanzhi: '' as any,
  completeChanzhi: '' as any,
  rateHetonge: '' as any,
  planHetonge: '' as any,
  completeHetonge: '' as any,
})
const getTouZi = async () => {
  const invest = await getInvest()
  touziData.planInvest = invest.planInvestTotal?.toFixed(2)
  touziData.completeInvest = invest.actualInvestTotal?.toFixed(2)
  touziData.rateInvest = (touziData.completeInvest * 100 / touziData.planInvest * 1)?.toFixed(0)
  const chanzhi = await getChanzhi()
  touziData.planChanzhi = chanzhi.outputTotal?.toFixed(2)
  touziData.completeChanzhi = chanzhi.actualOutputTotal?.toFixed(2)
  touziData.rateChanzhi = (touziData.completeChanzhi * 100 / touziData.planChanzhi * 1)?.toFixed(0)
  const hetonge = await getHetonge()
  touziData.planHetonge = hetonge.totalContract?.toFixed(2)
  touziData.completeHetonge = hetonge.totalPay?.toFixed(2)
  touziData.rateHetonge = (touziData.completeHetonge * 100 / touziData.planHetonge * 1)?.toFixed(0)
}

//进度控制
const jinduData = reactive({
  actualPer: '',
  planPer: 0 as Number
})
const getProgressData = async () => {
  const res = await getProgress({
    jobLevel: 1,
    currentPage: 1,
    pageSize: 9999,
    sectionId: "1813759430390509569",
    planId: "1831145611508363265",
    projectId: "1813759284281929730"
  })
  const calcList = (res.list || []).filter((i: any) => i.parentId === '' || !i.parentId)
  let calcActualPer = 0
  let calcPlanPer = 0
    ; (calcList || []).forEach((item: any) => {
      const actualPer = Number(item.actualPer || 0) * 100 > 100 ? Number(item.actualPer || 0) / 100 : Number(item.actualPer || 0)
      const planPer = Number(item.planPer || 0)
      calcActualPer += actualPer * (item.weight || 0)
      calcPlanPer += planPer * (item.weight || 0)
    })
  jinduData.actualPer = (calcActualPer * 100).toFixed(1)
  jinduData.planPer = Number((calcPlanPer).toFixed(1))
}

//mv
// const mvs = ref([] as any)
// const getMvs = async () => {
//   const res1 = await getMv('adcea4b72f8f4de2a3f8c6c42d7bd67e')//施工进场道闸
//   const res2 = await getMv('85186de42f6b40fcade625be8de952d0')//下游临时贝雷桥
//   const res3 = await getMv('bb69dd176f924ac5a8129769a20e159c')//办公区停车场1
//   mvs.value = [
//     {
//       name: '施工进场道闸',
//       url: res1
//     },
//     {
//       name: '下游临时贝雷桥',
//       url: res2
//     },
//     {
//       name: '办公区停车场1',
//       url: res3
//     },
//   ]
// }
//质量
const zhiliang = ref([] as any)
const getZhiLiangs = async () => {
  const res1 = await getZhiLiang()
  zhiliang.value = res1
  // console.log('zl', res1);
}
//质量
const anquan = reactive({
  letji: '',
  xiancun: '',
  lv: '' as any
})
const getAnQuans = async () => {
  const res1 = await getAnQuan()
  anquan.letji = res1.commonSicknessTotalCount
  anquan.xiancun = res1.commonUntreatedSicknessCount
  anquan.lv = Number(((res1.commonSicknessTotalCount - res1.commonUntreatedSicknessCount) / res1.commonSicknessTotalCount).toFixed(2)) * 100 ? Number(((res1.commonSicknessTotalCount - res1.commonUntreatedSicknessCount) / res1.commonSicknessTotalCount).toFixed(2)) * 100 : '100'
}





</script>
<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 40px 0;

  .left {
    width: 400px;
    height: 100%;

    .info {
      width: 100%;

      .content {
        width: 100%;
        margin: 15px 0;

        .list {
          width: 100%;
          padding: 0 5px 0 25px;
          display: flex;
          align-items: center;
          height: 40px;
          line-height: 40px;

          .label {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #87D5FF;
            margin-right: 14px;
          }

          .value {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #FFFFFF;
          }

        }
      }
    }

    .touzi {
      margin-top: 20px;
      width: 100%;

      .content {
        margin: 15px 0;

        .list {
          margin-top: 5px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon {
          width: 106px;
          height: 100px;

          .icon-box {
            position: absolute;
            top: 4px;
            left: 62px;

            .value {
              font-family: PangMenZhengDao;
              font-size: 24px;
              color: #FFFFFF;
              line-height: 24px;

              i {
                font-size: 16px;
              }
            }

            .label {
              font-family: MicrosoftYaHeiSemibold;
              font-size: 16px;
              color: #FFFFFF;
              line-height: 20px;
            }
          }
        }

        .icon1 {
          background: url('../../assets/img/home/touzi1.png') no-repeat;
          background-size: 100%;
        }

        .icon2 {
          background: url('../../assets/img/home/touzi2.png') no-repeat;
          background-size: 100%;
        }

        .icon3 {
          background: url('../../assets/img/home/touzi3.png') no-repeat;
          background-size: 100%;
        }

        .text {
          display: flex;
          align-items: center;
          margin-left: 53px;
          margin-bottom: 15px;

          .test-icon {
            width: 24px;
            height: 45px;
            background: url('../../assets/img/home/touzi-jiantou.png') no-repeat;
            background-size: 100%;

          }

          .text-content {
            margin-left: 12px;

            .text-item {
              display: flex;
              align-items: center;
              color: #FFFFFF;
              line-height: 40px;

              .label {
                width: 64px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: #FFFFFF;
                line-height: 24px;
                text-align: left;
                font-style: normal;
              }

              .value {
                text-align: right;
                width: 140px;
                font-family: PangMenZhengDao;
                font-size: 20px;
                color: #FFFFFF;
                line-height: 28px;
                text-align: center;
                font-style: normal;

                i {
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
    }

    .jindu {
      margin-top: 20px;
      width: 100%;

      .content {
        margin: 25px 0;

        .item-jindu {
          width: 100%;
          margin: 23px 10px;
          display: flex;
          align-items: center;

          .jindu-left {
            width: 64px;
            height: 54px;
          }

          .jindu-right {
            width: 288px;
            height: 54px;
            margin-left: 25px;

            .title {
              height: 24px;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
              line-height: 24px;
              text-align: left;
              font-style: normal;

              i {
                display: inline-block;
                width: 203px;
                text-align: right;
                font-family: PangMenZhengDao;
                font-size: 20px;
                color: #FFFFFF;
                line-height: 28px;
              }
            }

            .jindutiao {
              margin-top: 10px;
              width: 100%;
              height: 18px;
              padding: 4px;
              border-radius: 10px;
            }

            .jindutiao1 {
              border: 1px solid #4E98C7;

              :deep(.el-progress-bar__outer) {
                background-color: rgba(45, 118, 149, 0.71);
              }
            }

            .jindutiao2 {
              border: 1px solid #3CFFC5;

              :deep(.el-progress-bar__outer) {
                background-color: rgba(29, 222, 134, 0.41);
              }
            }
          }

          .jindu-left1 {
            background: url('../../assets/img/home/jindu-lan.png') no-repeat;
            background-size: 100%;
          }

          .jindu-left2 {
            background: url('../../assets/img/home/jindu-lv.png') no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }

  .right {
    width: 400px;
    height: 100%;

    .shuzi {
      width: 100%;
      margin-bottom: 10px;

      .content {
        width: 100%;
        height: 250px;
        padding: 10px 8px 0 26px;

        .mv-box {
          width: 100%;
          height: 100%;
          position: relative;

          .title {
            height: 40px;
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 40px;
            text-align: center;
          }

          .video {
            width: 100%;
            height: 200px;
          }
        }

        :deep(.el-carousel) {
          .el-carousel__arrow {
            top: 20px;
          }

          .el-carousel__arrow--left {
            left: 75px;
            width: 24px;
            height: 22px;
            background: url('../../assets/img/banner/默认-左.png') no-repeat center center;
            background-size: 100%;
            color: transparent;
            transition: none;

            /* 隐藏默认图标 */
            &:hover {
              background: url('../../assets/img/banner/点击-左.png') no-repeat center center;
              background-size: 100%;
            }
          }

          .el-carousel__arrow--right {
            right: 75px;
            width: 24px;
            height: 22px;
            background: url('../../assets/img/banner/默认-右.png') no-repeat center center;
            background-size: 100%;
            color: transparent;
            transition: none;

            &:hover {
              background: url('../../assets/img/banner/点击-右.png') no-repeat center center;
              background-size: 100%;
            }
          }
        }
      }
    }

    .zhiliang {
      width: 100%;
      margin-bottom: 10px;

      .content {
        width: 100%;
        height: 333px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-left: 5px;

        .item {
          width: 180px;
          height: 150px;
          background: rgba(13, 107, 155, 0.37);
          margin-left: 15px;

          .header-zl {
            width: 100%;
            height: 46px;
            font-family: MicrosoftYaHeiSemibold;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 36px;
            letter-spacing: 1px;
            text-align: center;
            background: url('../../assets/img/home/zhiliang-title.png') no-repeat;
            background-size: 100%;
          }

          .label {
            width: 100%;
            text-align: center;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 30px;
            letter-spacing: 1px;
          }

          .lv {
            font-family: PangMenZhengDao;
            font-size: 24px;
            color: #3CFFC5;
            line-height: 40px;
            text-align: center;

            i {
              font-size: 16px;
            }
          }

          .value {
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #3CFFC5;
            line-height: 24px;
            text-align: center;
          }
        }

      }
    }

    .anquan {
      width: 100%;
      margin-top: 15px;

      .content {
        width: 100%;
        height: 155px;
        margin-top: 15px;
        position: relative;
        display: flex;
        align-items: center;

        .icon {
          width: 148px;
          height: 137px;
          background: url('../../assets/img/home/anquan.png') no-repeat;
          background-size: 100%;

          .icon-box {
            position: absolute;
            top: 15px;
            left: 59px;

            .value {
              font-family: PangMenZhengDao;
              font-size: 24px;
              color: #FFFFFF;
              line-height: 32px;

              i {
                font-size: 16px;
              }
            }

            .label {
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
              line-height: 24px;
            }
          }
        }


        .text {
          display: flex;
          align-items: center;
          margin-left: 32px;
          margin-bottom: 15px;

          .text-content {
            margin-left: 12px;

            .text-item {
              width: 200px;
              height: 40px;
              display: flex;
              align-items: center;
              background: url('../../assets/img/home/矩形@2x.png') no-repeat;
              background-size: 100%;

              .img {
                width: 22px;
                height: 22px;
                background: url('../../assets/img/home/yinhuan.png') no-repeat;
                background-size: 100%;
                margin-left: 24px;
              }

              .label {
                width: 74px;
                font-family: MicrosoftYaHei;
                font-size: 16px;
                color: #FFFFFF;
                margin-left: 15px;
              }

              .value {
                width: 50px;
                text-align: center;
                font-family: PangMenZhengDao;
                font-size: 24px;
                color: #FFFFFF;
              }
            }
          }
        }
      }
    }
  }
}
</style>