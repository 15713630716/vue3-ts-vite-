<!--  -->
<template>
  <div class="eEquipment-positioning">
    <div>
      <div class="over-view">
        <div class="flex-box total-box">
          <img src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person-blue.png" alt="" />
          <div>
            <div>设备总数</div>
            <div class="risk1 risk">{{ pieData.total }}</div>
          </div>
        </div>
        <div class="line-box"></div>
        <div class="flex-box total-box">
          <img src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person-green.png" alt="" />
          <div>
            <div>在线数量</div>
            <div class="risk4 risk">{{ pieData.onLine }}</div>
          </div>
        </div>
        <div class="line-box"></div>
        <div class="flex-box total-box">
          <img src="https://dy-staticfiles.oss-cn-hangzhou.aliyuncs.com/zhjg/project_seawall_3.0/screen/pumpstation/person-yellow.png" alt="" />
          <div class="head-right">
            <div>离线数量</div>
            <div class="risk3 risk">{{ pieData.offline }}</div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 10px">
      <Table :data="tableData" :table-type="tableType" :current-page="currentPage">
        <el-table-column prop="licensePlate" label="车牌">
          <!-- <template #default="scope">
            <span @click="openPersonDetail(scope.row)" class="name-box">
              {{ scope.row.peopleName }}
            </span>
          </template> -->
        </el-table-column>
        <!-- <el-table-column prop="positionNo" label="定位编号" width="80"></el-table-column> -->
        <el-table-column prop="sectionName" label="标段"></el-table-column>
        <el-table-column prop="orgName" label="所属单位" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="registerTime" label="接入时间"></el-table-column> -->
        <el-table-column prop="carTypeName" label="车辆类型"></el-table-column>
        <el-table-column prop="carStatus" label="设备状态">
          <template #default="{ row }">
            <div class="online-status">
              <div v-if="row.carStatus === 1" class="icon online-icon"></div>
              <div v-else-if="row.carStatus === 2" class="icon un-online-icon"></div>
              <div v-else class="icon info-online-icon"></div>
              <div v-if="row.carStatus === 1" class="online-status-content">在线</div>
              <div v-else-if="row.carStatus === 2" class="online-status-content">离线</div>
              <div v-else class="online-status-content">未知</div>
            </div>
          </template>
        </el-table-column>
      </Table>
      <el-pagination
        :total="total"
        :background="background"
        layout="total, prev, pager, next"
        page-size="20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import ConstructionApi from '@/api/modular/Construction/construction.js'
import { useSectionStore } from '@/stores/section'
import Table from '@/components/Table/index.vue'

const sectionStore = useSectionStore()
const tableType = ref('carDetail')
const pieData = ref({})
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)

const getConstructionCarQuerySummary = () => {
  ConstructionApi.getConstructionCarQuerySummary({
    sectionId: sectionStore.currentSection?.id
  }).then((res) => {
    pieData.value = res.data
  })
}

const getData = () => {
  ConstructionApi.getConstructionCarPage({
    sectionId: sectionStore.currentSection?.id,
    currentPage: currentPage.value,
    pageSize: 20
  }).then((res) => {
    total.value = Number(res.data.total)
    tableData.value = res.data.list
  })
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getData()
}

onMounted(() => {
  getConstructionCarQuerySummary()
  getData()
})
watch(
  () => sectionStore.currentSection?.id,
  () => {
    getConstructionCarQuerySummary()
    getData()
  }
)
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.over-view {
  display: flex;
  flex: 1;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #e6f7ff;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
  margin: 40px 0;
  justify-content: space-between;
  .total-box {
    line-height: 30px;
    img {
      width: 70px;
      height: 70px;
    }
  }
}
.line-box {
  width: 1px;
  height: 50px;
  margin-top: 10px;
  background-image: linear-gradient(rgba(91, 178, 231, 0), rgba(76, 159, 222, 1), rgba(46, 122, 203, 0));
}
.risk {
  font-family: PangMenZhengDao;
  font-size: 24px;
  letter-spacing: 0;
  font-weight: 600;
}
.risk1 {
  color: #01cdff;
}
.risk2 {
  color: #fff;
}
.risk3 {
  color: #ffb00e;
}
.risk4 {
  color: #08e986;
}
.name-box {
  color: #01c5f7;
  cursor: pointer;
}
:deep(.el-pagination) {
  display: flex;
  margin-top: 10px;
  .btn-prev {
    margin-left: auto;
    background: transparent;
    color: #dce0e8;
    height: 30px;
    line-height: 30px;
  }
  .btn-next {
    background: transparent;
    color: #dce0e8;
    height: 30px;
    line-height: 30px;
  }
  .el-pager {
    li {
      height: 30px;
      line-height: 30px;
    }

    .number {
      background: transparent;
      color: #dce0e8;
      opacity: 0.7;
      border: 1px solid #0052d9;
      margin: 0 5px;
      border-radius: 5px;
      &.is-active {
        opacity: 1;
        background: #0052d9;
        border: 0;
      }
    }
    .active {
      opacity: 1;
      background: #0052d9;
      border: 0;
    }
    .btn-quicknext {
      background: transparent;
      color: #dce0e8;
    }
    .btn-quickprev {
      background: transparent;
      color: #dce0e8;
    }
  }
}
.online-status {
  display: flex;
  align-items: center;
  .icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .online-icon {
    background: #00a870;
  }
  .un-online-icon {
    background: #e34d59;
  }
  .info-online-icon {
    background: #ccc;
  }
  .online-status-content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    text-align: left;
    line-height: 22px;
    font-weight: 400;
  }
}
</style>
