<template>
  <div class="anquanBox pointer-events-all" v-if="Dialog">
    <div class="line">
      <el-scrollbar max-height="660">
        <div class="header pointer-events-all">
          {{ detailData.name }}
          <div class="after" @click="Dialog = false"></div>
        </div>
        <div style="padding: 0 10px;">
          <div class="biaoqian">
            <div class="left">{{ detailData.levelDesc }}</div>
            <div class="right">{{ detailData.riskLevel }}</div>
          </div>
          <div class="text-content">
            <div class="logo"></div>
            <div class="text">
              风险动态调整 <span>{{ detailData.riskLevelChangeCount ? detailData.riskLevelChangeCount : 0 }}</span>
              次。已落实管控措施，累计巡查
              <span>{{ detailData.patrolCount ? detailData.patrolCount : 0 }}</span> 次，本年巡查 <span>{{
                detailData.currentYearPatrolCount ? detailData.currentYearPatrolCount : 0 }}</span> 次，累计发现隐患 <span>{{
                  detailData.sicknessCount ? detailData.sicknessCount : 0 }}</span> 处，已治理 <span>{{
                  detailData.treatedSicknessCount ? detailData.treatedSicknessCount : 0 }}</span> 处。累计发布预警 <span>{{
                  detailData.warnCount ? detailData.warnCount : 0 }}</span> 条
            </div>
          </div>
          <div class="tab">
            <div class="tab-item" :class="ActiveIndex == index ? 'wxactive' : ''" v-for="(item, index) in tab"
              @click="getTab(index)">{{ item.name }}</div>
          </div>
          <div class="tab-main" v-if="ActiveIndex == 0">
            <el-row>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>工程部位</div>
                  <span>{{ detailData.partDesc }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>作业项目</div>
                  <span>{{ detailData.workItemDesc }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>作业类别</div>
                  <span>{{ detailData.workTypeDesc }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>管理责任人</div>
                  <span>{{ detailData.principalUserName }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>当前状态</div>
                  <span :class="detailData.controlStatus === '1' ? 'spot' : 'spot-red'">{{
                    detailData.controlStatus === '1' ? '已管控' : '未管控' }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail flex-box">
                  <div>巡查频次</div>
                  <span>{{ detailData.perNum }}天/次</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="detail flex-box">
                  <div>可能导致的后果</div>
                  <span>{{ detailData.result ? detailData.result : '-' }}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="detail flex-box">
                  <div>管控责任主体</div>
                  <span></span>
                </div>
              </el-col>
              <el-col :span="8" v-for="(item, index) in unitData" :key="index">
                <div class="zeren-box">
                  <div class="title">{{ item.unitName }}</div>
                  <div class="name" :title="item.companyName">{{ item.companyName }}</div>
                  <div class="personName">{{ item.personName }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="tab-main-yanpan" v-if="ActiveIndex == 1">
            <div style="display: flex; flex-direction: column; width: 570px;margin-right: 50px;">
              <div class="title">
                <div class="blue_line"></div>
                <span>研判过程</span>
              </div>
              <div class="grid">
                <div v-for="(item, index) in processData" :key="index" class="grid_col">
                  <div class="grid_item" :style="{
                    backgroundColor: item.status === 3 ? '#E34D59' : '#01CDFF'
                  }"></div>
                  <div class="grid_item" :style="{
                    backgroundColor: item.status === 2 ? '#ED7B2F' : '#01CDFF'
                  }"></div>
                  <div class="grid_item" :style="{
                    backgroundColor: item.status === 1 ? '#FFB010' : '#01CDFF'
                  }"></div>
                  <div class="grid_item"></div>
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; width: 250px">
              <div class="title">
                <div class="blue_line"></div>
                <span>研判记录</span>
              </div>
              <div class="jilu">
                <el-scrollbar max-height="300">
                  <div v-for="(item, index) in timeLineData" :key="index" class="grid_col">
                    <div class="top">
                      <div class="yuan"></div>
                      <div class="time">{{ item.time }}</div>
                      <div class="name">{{ item.name }}</div>
                    </div>
                    <div class="bottom">
                      <div class="lines"></div>
                      <div class="status" v-if="item.content" :style="{
                        backgroundColor: item.bkColor
                      }">{{ item.content }}</div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
          <div class="tab-main-guankong" v-if="ActiveIndex == 2">
            <div class="title">
              <div class="blue_line"></div>
              <span>管控措施</span>
            </div>
            <div class="content">
              {{ detailData.controlStep ? detailData.controlStep : '-' }}
            </div>
            <div class="title">
              <div class="blue_line"></div>
              <span>整改期间防控管控措施</span>
            </div>

            <div class="content">
              {{ detailData.superviseStep ? detailData.superviseStep : '-' }}
            </div>
            <div class="title">
              <div class="blue_line"></div>
              <span>巡查记录</span>
            </div>
            <div style="display: flex;align-items: center;">
              <div class="text_num">
                <div>本年巡查次数</div>
                <div class="num">{{ detailData.currentYearPatrolCount ? detailData.currentYearPatrolCount : 0 }}</div>
              </div>

              <div class="text_num">
                <div>本年发现隐患</div>
                <div class="num" style="color: #e34d59">{{ detailData.sicknessCount ? detailData.sicknessCount : 0
                }}</div>
              </div>

              <!-- <div class="text_num">
                <span>本月巡查次数</span>
                <span class="num">{{ sicknessDataMonth.totalCount }}</span>
              </div>

              <div class="text_num">
                <span>本月发现隐患</span>
                <span class="num" style="color: #e34d59">{{ sicknessDataMonth.sicknessCount }}</span>
              </div> -->
            </div>

            <!-- <div style="margin-top: 10px">
              <Table :data="tableData" :height="350">
                <el-table-column prop="time" label="巡查日期" width="100"></el-table-column>
                <el-table-column prop="orgName" label="组织单位" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orgHandleDesc" label="组织人员" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="personName" label="参与人员" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="巡查状态" width="100">
                  <template #default="scope">
                    <div v-if="scope.row.status === 1" class="statu2">未开始</div>
                    <div v-if="scope.row.status === 2" class="statu">巡查中</div>
                    <div v-if="scope.row.status === 3" class="statu1">已结束</div>
                  </template>
</el-table-column>
<el-table-column prop="sicknessCount" label="隐患总数" width="100"></el-table-column>
<el-table-column prop="untreatedSicknessCount" label="未治理" width="100">
  <template #default="scope">
                    <div class="section" style="color: #e34d59">
                      {{ scope.row.untreatedSicknessCount }}
                    </div>
                  </template>
</el-table-column>
</Table>
</div> -->
          </div>
          <div class="tab-main-yujing" v-if="ActiveIndex == 3">
            <div class="yujing-box" v-if="detailData?.riskPatrolWarn">
              <el-row>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      预警名称
                    </div>
                    <div style="font-size: 16px;color: #FFFFFF;">{{ detailData?.riskPatrolWarn?.warnName ?? '-' }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      预警等级
                    </div>
                    <div style="color: #e34d59">一级预警</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      当前预警状态
                    </div>
                    <div v-if="detailData?.riskPatrolWarn?.warnStatus === 1"
                      style="display: flex; color: white; align-items: center; margin-left: 10px">
                      <div style="width: 8px;height: 8px;border-radius: 4px;margin-right: 10px;background: red;"></div>
                      未解除
                    </div>
                    <div v-else style="display: flex; color: white; align-items: center; margin-left: 10px">
                      <div style="width: 8px;height: 8px;border-radius: 4px;margin-right: 10px;background: #4BE264;">
                      </div>
                      已解除
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      预警时间
                    </div>
                    <div style="font-size: 16px;color: #FFFFFF;">{{ detailData?.riskPatrolWarn?.warnTime ?? '-' }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      解除时间
                    </div>
                    <div style="font-size: 16px;color: #FFFFFF;">{{ detailData?.riskPatrolWarn?.endTime ?? '-' }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      解除原因
                    </div>
                    <div style="font-size: 16px;color: #FFFFFF;">{{ detailData.riskPatrolWarn?.reason ?? '-' }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="detail" style="display: flex;align-items: center; margin-top: 15px;">
                    <div style="display: block;width: 96px;font-size: 16px;color: #87D5FF; margin-right: 16px;">
                      预警解除流程
                    </div>
                    <div style="font-size: 16px;color: #FFFFFF;"></div>
                  </div>
                </el-col>
              </el-row>
              <div style="width: 600px">
                <!-- <TimeLine :data="timeLineData1"></TimeLine> -->
              </div>
            </div>
            <div class="emty" v-else style="font-size: 18px;margin: 20px;color: #fff;opacity: 0.5;">暂无预警记录</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getDangerZeren, getDangerYanpan, getDangerYujing } from '@/request/construct'

const props = defineProps({
  detailData: {
    type: Object as any,
    required: true,
  },
  id: {
    type: String as any,
    required: true,
    default: '' as any
  }
});

const Dialog = ref(false);

onMounted(() => {
  console.log(props.detailData);

})

const ActiveIndex = ref<number>(0)
const tab = ref([
  {
    id: 1,
    name: '基本信息'
  },
  {
    id: 1,
    name: '研判过程'
  },
  {
    id: 1,
    name: '管控信息'
  },
  {
    id: 1,
    name: '预警信息'
  },
])
const getTab = (index: number) => {
  ActiveIndex.value = index
}

//管控责任主体
const unitData = ref([] as any);
const timeLineData = ref([] as any);
const processData = ref([] as any);
//通过id获取信息
const getWXDetail = async (id: any) => {
  const zeren = await getDangerZeren(id)
  unitData.value = []
  if (zeren) {
    if (zeren.corporationOrgItemList) {
      zeren.corporationOrgItemList.forEach((item: any) => {
        unitData.value.push({
          unitName: '项目法人',
          personName: item.name,
          companyName: zeren.corporationOrgName
        })
      })
    }
    if (zeren.supervisingOrgItemList) {
      zeren.supervisingOrgItemList.forEach((item: any) => {
        unitData.value.push({
          unitName: '监理单位',
          personName: item.name,
          companyName: zeren.supervisingOrgName
        })
      })
    }
    if (zeren.constructionOrgNameMap) {
      for (const key in zeren.constructionOrgNameMap) {
        zeren.constructionItemMap[key].forEach((item: any) => {
          unitData.value.push({
            unitName: '施工单位',
            personName: item.name,
            companyName: zeren.constructionOrgNameMap[key]
          })
        })
      }
    }
    // if (zeren.patrolInfoSummaryVO) {
    //   zeren.patrolInfoSummaryVO.list.forEach((item:any) => {
    //     if (item.startMonth === Number(dayjs(new Date()).format('MM'))) {
    //       sicknessDataMonth.value.totalCount = item.count
    //       sicknessDataMonth.value.sicknessCount = item.sicknessCount
    //     }
    //   })
    // }
  }
  //研判
  timeLineData.value = []
  processData.value = []
  const yanpan = await getDangerYanpan(id)
  yanpan.forEach((item: any, index: number) => {
    timeLineData.value.push({
      time: (item.createTime).substring(0, 10),
      name: item.trueName,
      content: item.levelDesc
    })
    if (item.levelDesc === '重大风险') {
      timeLineData.value[index].bkColor = '#E34D59'
      processData.value.push({
        time: (item.createTime).substring(0, 10),
        status: 3
      })
    } else if (item.levelDesc === '较大风险') {
      timeLineData.value[index].bkColor = '#ED7B2F'
      processData.value.push({
        time: (item.createTime).substring(0, 10),
        status: 2
      })
    } else if (item.levelDesc === '一般风险') {
      timeLineData.value[index].bkColor = '#FFB010'
      processData.value.push({
        time: (item.createTime).substring(0, 10),
        status: 1
      })
    } else {
      processData.value.push({
        time: (item.createTime).substring(0, 10),
        status: 0
      })
    }
  })
  // console.log('yanpan', yanpan);
  // console.log('timeLineData', timeLineData.value);
  // console.log('processData', processData.value);
  //预警
  console.log('detailData', props.detailData);
  if (props.detailData?.riskPatrolWarn) {
    //获取预警信息的流程
    const yujing = await getDangerYujing(props.detailData.riskPatrolWarn.flowId)
    console.log(yujing);
  }
}
watch(
  () => props.id,
  () => {
    ActiveIndex.value = 0
    getWXDetail(props.id)
  },
  { immediate: true }
);


defineExpose({
  Dialog,
});
</script>
<style lang="scss" scoped>
.anquanBox {
  width: 969px;
  max-height: 680px;
  position: absolute;
  top: 106px;
  left: 476px;
  background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 76, 111, 0.8);
  border-radius: 40px 0px 32px 0px;
  border: 1px solid rgba(110, 181, 242, 0.57);
  padding: 10px;

  .line {
    width: 949px;
    height: 660px;
    background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(0, 54, 75, 0.81), rgba(21, 141, 207, 0.64);
    box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
    border-radius: 32px 0px 32px 0px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 15px;

    .header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-family: MicrosoftYaHeiSemibold;
      font-size: 18px;
      color: #FFFFFF;
      background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13A4EB 100%);
      padding-left: 16px;
      position: relative;

      .after {
        position: absolute;
        width: 25px;
        height: 25px;
        top: 7px;
        right: 0px;
        background: url('../assets/img/weilai/cha.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .biaoqian {
      display: flex;
      align-items: center;
      margin-top: 15px;

      .left {
        width: 98px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid #FFB00E;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #FFB00E;
        line-height: 32px;
        text-align: center;
        font-style: normal;
        margin-right: 15px;
      }

      .right {
        width: 85px;
        height: 32px;
        background: #F48D48;
        border-radius: 6px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 32px;
        text-align: center;
        font-style: normal;
      }
    }

    .text-content {
      width: 906px;
      height: 80px;
      background: rgba(10, 136, 206, 0.28);
      border-radius: 8px;
      border: 1px solid rgba(162, 205, 255, 0.31);
      margin-top: 20px;
      padding: 14px;
      display: flex;
      align-items: center;

      .logo {
        width: 56px;
        height: 52px;
        background: url('../assets/img/jiansheqi/anquan/位图@2x.png') no-repeat;
        background-size: 100% 100%;
        margin-right: 20px;
      }

      .text {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #87D5FF;
        line-height: 24px;
        text-align: left;
        font-style: normal;

        span {
          color: rgba(245, 170, 17, 1);
        }
      }
    }

    .tab {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 25px;

      .tab-item {
        width: 140px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin-right: 5px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #E6F7FF;
        background: url('../assets/img/jiansheqi/anquan/编组\ 41备份\ 3@2x.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .wxactive {
        background: url('../assets/img/jiansheqi/anquan/编组\ 32备份\ 2@2x.png') no-repeat;
        background-size: 100% 100%;
      }
    }

    .tab-main {
      width: 100%;
      margin-top: 20px;

      .flex-box {
        display: flex;
        align-items: top;
        margin-bottom: 16px;

        div {
          width: 120px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #87D5FF;
          text-align: left;
          font-style: normal;
        }

        span {
          display: block;
          padding-left: 10px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          text-align: left;
          font-style: normal;
        }
      }

      .zeren-box {
        width: 288px;
        height: 100px;
        background: url('../assets/img/jiansheqi/anquan/责任主体框@2x.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 10px;
        padding: 0 12px;

        .title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 16px;
          color: #01CDFF;
          line-height: 30px;
          text-align: left;
        }

        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 30px;
          text-align: left;
          white-space: nowrap;
          /* 不换行 */
          overflow: hidden;
          /* 隐藏超出部分 */
          text-overflow: ellipsis;
        }

        .personName {
          width: 48px;
          height: 22px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #FFB00E;
          line-height: 30px;
        }
      }

    }

    .tab-main-yanpan {
      width: 100%;
      margin-top: 20px;
      display: flex;
      align-items: top;

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 18px;

        .blue_line {
          width: 3px;
          height: 20px;
          background: #01CDFF;
          margin-right: 13px;
        }

        span {
          width: 64px;
          height: 21px;
          font-family: MicrosoftYaHeiSemibold;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 21px;
          text-align: left;
          font-style: normal;
        }
      }

      .grid {
        width: 570px;
        overflow: hidden;
        display: flex;

        .grid_col {
          display: flex;
          flex-direction: column;
          align-items: center;

          .grid_item {
            width: 129px;
            height: 56px;
            background: #01CDFF;
            opacity: 0.5;
            margin: 0 15px 15px 0;
          }

          span {
            display: block;
            width: 129px;
            margin: 0 15px 0px 0;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #87D5FF;
            line-height: 22px;
            text-align: center;
            font-style: normal;
          }
        }
      }

      .jilu {
        width: 250px;

        .grid_col {
          width: 250px;
          height: 80px;
          margin-top: 8px;

          .top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .yuan {
              width: 20px;
              height: 20px;
              background: rgba(1, 205, 255, 0.3);
              border-radius: 50%;
              position: relative;

              &::after {
                position: absolute;
                top: 6px;
                left: 6px;
                width: 8px;
                height: 8px;
                content: '';
                background: rgba(212, 227, 252, 1);
                border-radius: 50%;
              }
            }

            .time {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 16px;
              color: #E6F7FF;
              line-height: 22px;
            }

            .name {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 16px;
              color: #87D5FF;
              line-height: 22px;
            }
          }

          .bottom {
            width: 100%;
            display: flex;
            align-items: center;
            margin-top: 6px;

            .lines {
              width: 1px;
              height: 50px;
              border: 1px solid rgba(236, 242, 254, 0.3);
              margin-left: 9px;
            }

            .status {
              width: 85px;
              height: 32px;
              border-radius: 6px;
              text-align: center;
              line-height: 32px;
              font-size: 16px;
              color: #FFFFFF;
              margin-left: 25px;
            }
          }
        }
      }

    }

    .tab-main-guankong {
      width: 100%;
      margin-top: 20px;

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 100%;

        .blue_line {
          width: 3px;
          height: 20px;
          background: #01CDFF;
          margin-right: 13px;
        }

        span {
          // width: 64px;
          height: 21px;
          font-family: MicrosoftYaHeiSemibold;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 21px;
          text-align: left;
          font-style: normal;
        }
      }

      .content {
        width: 100%;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 24px;
        text-align: justify;
        font-style: normal;
        margin-bottom: 21px;
        padding-left: 16px;
      }

      .text_num {
        margin: 25px 57px 0px 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #E6F7FF;
        line-height: 22px;

        .num {
          font-family: PangMenZhengDao;
          font-size: 24px;
          color: #01CDFF;
          line-height: 27px;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
