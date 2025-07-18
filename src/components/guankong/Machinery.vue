<!--  -->
<template>
  <div class="machinery-content">
    <div class="header flex-box pointer-events-all">
      <div :class="['header-child', active === 1 ? 'header-child-active' : '']" @click="changeActive(1)">
        <div class="header-total">{{ total }}</div>
        <div class="header-name">机械总投入</div>
      </div>
      <div :class="['header-child', active === 2 ? 'header-child-active' : '']" @click="changeActive(2)">
        <div class="header-total" style="color: #FFE194 ;">{{ dayTotal }}</div>
        <div class="header-name">当日投入</div>
      </div>
      <div :class="['header-child', active === 3 ? 'header-child-active' : '']" @click="changeActive(3)">
        <div class="header-total" style="color: #20FFC1 ;">{{ monthTotal }}</div>
        <div class="header-name">月度投入</div>
      </div>
    </div>
    <div class="guankong-header">设备列表</div>
    <div class="change-list">
      <div class="thead">
        <div class="index">序号</div>
        <div class="section">设备</div>
        <div class="name">类型</div>
        <div class="date">进场时间</div>
        <div class="status">状态</div>
      </div>
      <vue3ScrollSeamless :key="active" :data-list="tableData" style="height: 520px; overflow: hidden"
        :class-option="scrollDefaultOption">
        <div class="pointer-events-all cursor-pointer" v-for="(item, index) in tableData" :key="index"
          :class="['change-cell', index % 2 !== 0 ? 'change-cell-odd' : '']" @click="getDetail(item)">
          <div class="index">
            <div class="index-box">{{ index + 1 }}</div>
          </div>
          <div class="section">
            <el-tooltip class="box-item" effect="dark" :content="item.deviceName" placement="top">
              <div class="text-style">
                {{ item.deviceName }}
              </div>
            </el-tooltip>
          </div>
          <div class="name">{{ item.mechanicalTypeName }}</div>
          <div class="date">
            <el-tooltip class="box-item" effect="dark" :content="item.entryTime" placement="top">
              <div class="text-style">
                {{ item.entryTime?.slice(0, 10) }}
              </div>
            </el-tooltip>
          </div>
          <div class="status">
            <img v-if="item.deviceStatus === 1" src="../../assets/guankong/lixian.png" alt="">
            <img v-if="item.deviceStatus === 2" src="../../assets/guankong/zaixian.png" alt="">
            {{ item.deviceStatus === 1 ? '退场' : '在场' }}
          </div>
        </div>
      </vue3ScrollSeamless>
      <!-- <machineryDetailDialog ref="machineryDetail"></machineryDetailDialog> -->
    </div>
    <div class="pop" v-if="detailPopShow">
      <div class="header-pop pointer-events-all">
        {{ detailData.deviceName }}
        <div class="after" @click="detailPopShow = false"></div>
      </div>
      <div class="content-pop">
        <div class="item">
          <div class="label">设备类型</div>
          <div class="value">{{ detailData.deviceTypeName }}</div>
        </div>
        <div class="item">
          <div class="label">标段工区</div>
          <div class="value">{{ detailData.sectionName }}{{ detailData.workAreaName }}</div>
        </div>
        <div class="item">
          <div class="label">操作人员</div>
          <div class="value">{{ detailData.operation }}</div>
        </div>
        <div class="item">
          <div class="label">所属单位</div>
          <div class="value">{{ detailData.orgName }}</div>
        </div>
        <div class="item">
          <div class="label">进场时间</div>
          <div class="value">{{ detailData.entryTime }}</div>
        </div>
        <div class="item">
          <div class="label">照片</div>
          <div class="value pointer-events-all">
            <el-image class="img" style="width: 88px; height: 88px" :src="img1" :zoom-rate="1.2" :max-scale="7"
              :hide-on-click-modal="true" :min-scale="0.2" :preview-src-list="[img1]" :initial-index="0" fit="cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import img1 from '../../assets/machinery-img.png'
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import { getOrdinaryDevice, getDeviceLists, getInvestmentDevice, getInvestmentDetail } from '@/request/guankong'


const total = ref(0)
const dayTotal = ref(0)
const monthTotal = ref(0)
const active = ref(1)
const perData = ref([] as any)

const scrollDefaultOption = {
  step: 0.5, // 数值越大速度滚动越快
  limitMoveNum: 13, // 开始无缝滚动的数据量
  hoverStop: true, // 是否开启鼠标悬停stop
  direction: 1, // 0向下 1向上 2向左 3向右
  openWatch: true, // 开启数据实时监控刷新dom
  singleHeight: 50, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
  waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
}

const tableData = ref([] as any)

onMounted(() => {
  getConstructionMechanicalTypeCount()
  getMechanicalData()
  getMechanicalPage()
})


const changeActive = (item: any) => {
  active.value = item
  getMechanicalPage()
}

const contrast = (arr: any) => {
  let maxCount = 0
  arr.forEach((item: any) => {
    if (item.count > maxCount) {
      maxCount = item.count
    }
  })
  arr.forEach((item: any) => {
    item.progress = Math.round((item.count / maxCount) * 100)
  })
}

const getConstructionMechanicalTypeCount = async () => {
  const res = await getOrdinaryDevice()
  perData.value = res
  contrast(perData.value)
}

const getMechanicalData = async () => {
  const res = await getInvestmentDevice()
  total.value = res.total
  dayTotal.value = res.totalByDay
  monthTotal.value = res.totalByMonth
}

const getMechanicalPage = async () => {
  const params = {} as any
  if (active.value === 2) {
    params['dayTime'] = 1
  } else if (active.value === 3) {
    params['monthTime'] = 1
  }
  const res = await getDeviceLists(params)
  tableData.value = res
}

//点击详情
const detailPopShow = ref(false)
const detailData = ref({} as any)
const getDetail = async (item: any) => {
  const par = {
    deviceId: item.deviceId,
    peopleId: item.peopleId
  }
  const res = await getInvestmentDetail(par)
  detailPopShow.value = true
  console.log(res);
  detailData.value = res
}

</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
}

.machinery-content {
  width: 100%;
  position: relative;
}

.pop {
  width: 410px;
  min-height: 346px;
  position: absolute;
  top: 250px;
  left: -470px;
  background: url('../../assets/img/weilai/pop-bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 21px 24px;

  .header-pop {
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
    min-height: 270px;
    padding: 9px;
    margin-top: 10px;

    .item {
      width: 100%;
      display: flex;
      align-items: top;
      font-size: 16px;
      color: #FFFFFF;
      margin-bottom: 10px;

      .label {
        width: 64px;
        margin-right: 24px;
        color: rgba(135, 213, 255, 1);
        white-space: nowrap;
      }
    }
  }
}

.header {
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 25px;

  .header-child {
    width: 110px;
    height: 130px;
    background: url('@/assets/guankong/jixie.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    text-align: center;
    padding-top: 28px;

    .header-total {
      font-family: PangMenZhengDao;
      color: #fff;
      text-shadow: 0 0 20px #6fb9f5;
      font-size: 32px;
      margin-bottom: 10px;
    }

    .header-name {
      color: #fff;
      font-size: 16px;
    }
  }

  .header-child-active {
    background: url('@/assets/guankong/jixie-active.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

.change-list {
  width: 100%;

  .thead {
    display: flex;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    font-family: 'Microsoft Yahei';
    font-weight: normal;
    line-height: 40px;
    color: rgb(135, 213, 255);
    margin-bottom: 15px;
  }

  .change-cell {
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    font-family: 'Microsoft Yahei';
    font-weight: normal;
    line-height: 35px;
    margin-bottom: 8px;
    width: 100%;
    height: 35px;
    background: rgba(4, 80, 120, 0.45);
    border: 0.6px solid rgba(108, 204, 255, 0.47);
    border-radius: 4px;
    color: #fff;

    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .index {
      position: relative;
      text-align: center;
      font-size: 12px;

      &::after {
        content: '';
        position: absolute;
        left: 8px;
        top: 6px;
        width: 22px;
        height: 22px;
        background-repeat: no-repeat;
        background: url('@/assets/guankong/xuhao.png');
        background-size: 100% 100%;
      }
    }

    .status {
      display: flex;
      align-items: center;

      img {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
  }

  .index {
    width: 40px;
  }

  .section {
    width: 110px;
  }

  .name {
    width: 70px;
  }

  .date {
    width: 100px;
  }

  .status {
    width: 58px;
  }

}
</style>
