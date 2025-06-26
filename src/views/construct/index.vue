<template>
  <div class="index">
    <div class="nav">
      <div class="item pointer-events-all" v-for="(item, index) in navs" :key="item.name"
        :class="item.active == true ? 'active' : ''" @click="getNav1(index)">
        <img :src="item.img" alt="">
        <div class="title">{{ item.name }}</div>
        <div class="active-nav" v-if="item.active && navItems[index - 1]">
          <div class="nav-item pointer-events-all" :class="navItem.active == true ? 'nav-item-active' : ''"
            v-for="(navItem, itemIndex) in navItems[index - 1]" :key="navItem.id"
            @click.stop="getNav2(itemIndex, index)">
            {{ navItem.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-box" v-if="luanshengBoxShow">
      <div class="luansheng">
        <div class="luansheng-box">
          <div class="add pointer-events-all" v-if="luanshengItem.id == 4 || luanshengItem.id == 3"
            @click="getDialogDetails(luanshengItem.id)">
            详情
          </div>
          <div class="header-box">
            <img class="img" src="../../assets/img/jiansheqi/jindu-logo.png" alt="">
            <div class="text">{{ luanshengItem.name }}</div>
          </div>
          <div class="echart-box">
            <div class="item-echart">
              <div class="top none">
                <el-progress color="#07BEFF" :width="90" type="circle" :percentage="90">
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
                <el-progress color="#E9CA7A" :width="90" type="circle" :percentage="10">
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
                <el-progress color="#1DDEA8" :width="90" type="circle" :percentage="0">
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
            <div class="link-box pointer-events-all" @click="getBimLink()">
              <img style="width: 100%; height: 100%;cursor: pointer;" :src="luanshengItem.img" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fangzhen-box" v-if="fangzhenBoxShow">
      <div class="wenkong pointer-events-all" v-if="wenkongBox">
        <div class="item" :class="wenkongShow == true ? 'wenkong-active' : ''" @click="getWenKong(1)">典型坝段1</div>
        <div class="item" :class="wenkongShow == false ? 'wenkong-active' : ''" @click="getWenKong(2)">典型坝段2</div>
      </div>
      <div class="tian-qi pointer-events-all" v-if="tianqiBox">
        <div class="item" :class="tianqiShow == 1 ? 'wenkong-active' : ''" @click="getTianQi(1)"><img
            src="../../assets/weather/qing.png" alt="">晴天</div>
        <div class="item" :class="tianqiShow == 2 ? 'wenkong-active' : ''" @click="getTianQi(2)"><img
            src="../../assets/weather/yin.png" alt="">多云</div>
        <div class="item" :class="tianqiShow == 3 ? 'wenkong-active' : ''" @click="getTianQi(3)"><img
            src="../../assets/weather/yu.png" alt="">雨天</div>
        <div class="item" :class="tianqiShow == 4 ? 'wenkong-active' : ''" @click="getTianQi(4)"><img
            src="../../assets/weather/xue.png" alt="">雪天</div>
      </div>
      <div class="yingli" v-if="yingliBox">
        <div class="yingli-top"></div>
        <div class="yingli-right">
          <div class="yingli-line">
            <div class="header-box">
              <img class="img" src="../../assets/img/jiansheqi/yingli-title.png" alt="">
              <div class="text">应力有限元</div>
            </div>
            <div class="content-yingli  pointer-events-all" v-show="true">
              <div class="text">
                <el-scrollbar height="180px">
                  <div class="scrollbar-demo-item">
                    应力是一种内力，本质上是原子间作用力。当物体发生变形时，原子间距离会偏离平衡位置（如下图所示，偏离平衡位置意味着原子间距离不再是d），从而导致原子间相互排斥或吸引，这是产生应力的根本原因。同时，只有当“偏离距离”非常小时，排斥力（或吸引力）与“偏离距离”才能看作是线性的，这就是Hooke's
                    law必须在小变形下才成立的原因。
                  </div>
                </el-scrollbar>
              </div>
              <div class="yingli-echart pointer-events-all">
                <el-scrollbar height="590px">
                  <div class="echart-item">
                    <div class="header">
                      <div class="icon"></div>
                      <div class="text1">xxx图表</div>
                      <div class="line"></div>
                    </div>
                    <div class="echart-main" id="echart1"></div>
                  </div>
                  <div class="echart-item">
                    <div class="header">
                      <div class="icon"></div>
                      <div class="text1">xxx图表</div>
                      <div class="line"></div>
                    </div>
                    <div class="echart-main" id="echart2"></div>
                  </div>
                  <div class="echart-item">
                    <div class="header">
                      <div class="icon"></div>
                      <div class="text1">xxx图表</div>
                      <div class="line"></div>
                    </div>
                    <div class="echart-main" id="echart3"></div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <div class="emty" v-show="false">
              <img src="../../assets//img/jiansheqi/anquan/emty.png" alt="">
              <div class="text">暂无数据</div>
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
              <el-scrollbar height="720px">
                <el-tree ref="treeRef" :highlight-current="true" :expand-on-click-node="false" :data="dataTree"
                  :current-node-key="currentNodeKey" node-key="id" default-expand-all :filter-node-method="filterNode"
                  @node-click="handleNodeClick">
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <!-- <i>Assessed判断不等于这个，等于这个的全是已验评的</i> -->
                      <i class="on" v-if="data.evaluationStatus != 'Assessed'"></i>
                      <i class="off" v-else></i>
                      <span class="node">{{ node.name }}</span>
                      <span class="data">{{ data.name }}</span>
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
            <div class="value">{{ treeDetil.evaluationDate }}</div>
          </div>
          <div class="item">
            <div class="label">评定等级</div>
            <div class="value dengji dengji1" v-if="treeDetil.evaluationResult == '合格'">
              合格
            </div>
            <div class="value dengji dengji2" v-if="treeDetil.evaluationResult == '不合格'">
              不合格
            </div>
            <div class="value dengji dengji3" v-if="treeDetil.evaluationResult == '优良'">
              优良
            </div>
          </div>
          <div class="item files">
            <div class="label">附件</div>
            <div class="value" v-if="treeDetil.attachment && treeDetil?.file?.length != 0">
              <div class="item-file pointer-events-all" v-for="item in treeDetil.file">
                <div @click="getDowlond(item.ossPath)" class="file-name">{{ item.fileName }}</div>
              </div>
            </div>
            <div class="value" v-else>暂无</div>
          </div>
          <div class="item imgs">
            <div class="label">现场照片</div>
            <div class="value pointer-events-all" v-if="treeDetil.video && treeDetil?.img?.length != 0">
              <el-image class="img" v-for="itemImg in treeDetil.img" style="width: 88px; height: 88px"
                :src="itemImg.ossPath" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                :preview-src-list="[itemImg.ossPath]" :initial-index="0" fit="cover" />
            </div>
            <div class="value" v-else>暂无</div>
          </div>
        </div>
      </div>
    </div>
    <div class="anquan-box" v-if="anquanActive">
      <div class="anquan-line">
        <div class="header-box">
          <img class="img" src="../../assets/img/jiansheqi/anquan/title.png" alt="">
          <div class="text">危险源列表</div>
        </div>
        <div class="content-anquan" v-if="wxLists.length">
          <div class="top">
            <div class="left">
              <div class="left-top">重大危险源</div>
              <div class="left-bottom">{{ wxNumMajor }}</div>
            </div>
            <div class="center"></div>
            <div class="right">
              <div class="right-top">一般危险源</div>
              <div class="right-bottom">{{ wxNumGeneral }}</div>
            </div>
          </div>
          <div class="lists-main">
            <div class="list-item pointer-events-all" :class="wxActiveIndex == index ? 'wxactive' : ''"
              v-for="(item, index) in wxLists" @click="getListItem(index, item)">
              <div class="logo"></div>
              <div class="text">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="emty" v-else>
          <img src="../../assets//img/jiansheqi/anquan/emty.png" alt="">
          <div class="text">无危险源预警</div>
        </div>
      </div>
    </div>
    <div class="guankong-box" v-if="guankongActive">
      <div class="guankong-line">
        <!-- <div class="header-box">
          <img class="img" src="../../assets/img/jiansheqi/anquan/title.png" alt="">
          <div class="text">现场管控</div>
        </div> -->
        <div class="content-guankong">
          <div class="top">
            <div class="tab pointer-events-all" v-for="(item, index) in guankongTabs"
              :class="index == indexTab ? 'tabActive' : ''" @click="getGuankongTab(index)">{{ item.name }}</div>
          </div>
          <div class="lists-main">
            <Overview v-if="indexTab == '0'"></Overview>
            <MvPop v-if="indexTab == '1'"></MvPop>
            <Environment v-if="indexTab == '2'"></Environment>
            <People v-if="indexTab == 3"></People>
            <Machinery v-if="indexTab == 4"></Machinery>
          </div>
        </div>
      </div>
    </div>
    <div class="tuceng pointer-events-all" v-if="guankongActive">
      <div class="title">图层控制</div>
      <div class="item" v-for="item in tuceng" :key="item.id">
        <div class="text">{{ item.name }}</div>
        <div class="switch">
          <el-switch size="small" v-model="item.value" @change="tuCengSwitch(item)" />
        </div>
      </div>
    </div>
    <div class="tuceng pointer-events-all" v-if="anquanActive">
      <div class="title">图例</div>
      <div class="item">
        <div class="color" style="background-color: #e55759;"></div>
        <div class="text">重大风险</div>
      </div>
      <div class="item">
        <div class="color" style="background-color: #de7f3a;"></div>
        <div class="text">较大风险</div>
      </div>
      <div class="item">
        <div class="color" style="background-color: #e1bf27;"></div>
        <div class="text">一般风险</div>
      </div>
      <div class="item">
        <div class="color" style="background-color: #25dcf1;"></div>
        <div class="text">低风险</div>
      </div>
    </div>
    <AnquanPop v-if="wxActiveIndex != -1" :detailData="wxDetail" :id="anquanIdPop" ref="dialogRef"></AnquanPop>
    <div class="bim-pop" v-if="dialogBimVisible">
      <div class="line">
        <div class="header pointer-events-all">
          {{ luanshengItem.name }}
          <div class="after" @click="dialogBimVisible = false"></div>
        </div>
        <div class="content-pop pointer-events-all">
          <iframe style="width: 100%;height: 95%;" :src="luanshengItem.url" frameborder="0"></iframe>
        </div>
      </div>
    </div>
    <!-- <div class="bim-pop" v-if="dialogBa">
      <div class="line">
        <div class="header pointer-events-all">
          混凝土重力拱坝进度详情
          <div class="after" @click="dialogBa = false"></div>
        </div>
        <div class="content-pop pointer-events-all">
          <iframe style="width: 100%;height: 95%;"
            src="https://seawall.zdwp.net/bim/#/progressSimulation?Azimuth=0&Ploar=-20&zoomStep=1&vaultID=98c318f9-c6a5-4d86-b690-6eab84f4f69e&featureID=8514a92a-7a27-4e3e-8bcc-41df29beef26"
            frameborder="0"></iframe>
        </div>
      </div>
    </div> -->
    <div class="bimDetail-box pointer-events-all" v-show="dialogBim">
      <el-dialog v-model="dialogBim" title="发电引水隧洞" width="1600" top="7vh">
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
                    src="../../assets/luansheng/tab-title.png" alt="">仪器安装进度</div>
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
            <img style="width: 100%;margin-top: 5px;" src="../../assets//luansheng/111.png" alt="">
          </div>
          <div class="tab-content" v-show="activeName == '2'">
            <div class="tab-item">
              <div class="top">
                <div class="title"><img style="width: 16px;height: 16px;margin-right: 10px;"
                    src="../../assets/luansheng/tab-title.png" alt="">地质超前预报(粗探)</div>
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
                    src="../../assets/luansheng/tab-title.png" alt="">地质超前预报(精探)</div>
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
                    src="../../assets/luansheng/tab-title.png" alt="">施工地质</div>
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
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import img1 from '@/assets/img/jiansheqi/nav1.png'
import img2 from '@/assets/img/jiansheqi/nav2.png'
import img3 from '@/assets/img/jiansheqi/nav3.png'
import img4 from '@/assets/img/jiansheqi/nav4.png'
import img5 from '@/assets/guankong/guankongzhongxin.png'
import daoliudong from '@/assets/luansheng/daoliudong.png'
import gongba from '@/assets/luansheng/gongba.png'
import guanlifang from '@/assets/luansheng/guanlifang.png'
import fadaindong from '@/assets/luansheng/fadiandong.png'
import zhengti from '@/assets/luansheng/zhengti.png'
import { Search } from '@element-plus/icons-vue'
import { getZhiliangTree, getZhiliangTreeDetil, getZhiliangTreeDetilFile, getProgress, getDangerLists, getDangerDetail } from '@/request/construct'
import AnquanPop from '@/components/AnquanPop.vue'
import { getUe } from '@/utils/getUe';
import * as echarts from 'echarts';
import { ueStoreJson } from '@/store';
import Overview from '@/components/guankong/Overview.vue'
import MvPop from '@/components/guankong/MvPop.vue'
import Environment from '@/components/guankong/Environment.vue'
import Machinery from '@/components/guankong/Machinery.vue'
import People from '@/components/guankong/People.vue'
import { ElMessage, type TreeInstance } from 'element-plus'

const storeUe = ueStoreJson();


const tuceng = ref([
  {
    name: '拱坝模型',
    value: '',
    id: 'gbmx'
  },
  {
    name: '视频监控',
    value: '',
    id: 'spjk'
  },
  {
    name: '人员',
    value: '',
    id: 'ry'
  },
  {
    name: '机械设备',
    value: '',
    id: 'jxsb'
  },
  {
    name: '环境监测',
    value: '',
    id: 'hjjc'
  },
  {
    name: '车辆定位',
    value: '',
    id: 'cldw'
  },
])
//图层开关
const tuCengSwitch = (item: any) => {
  // console.log('val', item);
  //判断图层传递消息
  getUe({ type: 'tuceng', name: item.id, id: `${item.value}` })
}

const navs = ref([
  {
    name: '管控中心',
    img: img5,
    active: false,
  },
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
      id: '1',
      img: zhengti,
      url: 'https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LDk4YzMxOGY5LWM2YTUtNGQ4Ni1iNjkwLTZlYWI4NGY0ZjY5ZSwxNjcyOTVmZS1iZGZkLTRkY2YtYTE3Yi00ZTBmYTk1NjQ3OWE='
    }, {
      name: '导流洞',
      active: false,
      id: '2',
      img: daoliudong,
      url: 'https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LDk4YzMxOGY5LWM2YTUtNGQ4Ni1iNjkwLTZlYWI4NGY0ZjY5ZSxlNGNiMmYwYy05M2E2LTRkMTItOGQ5NC1iOWJiY2JhNmU4M2Q='
    }, {
      name: '混凝土重力拱坝',
      active: false,
      id: '3',
      img: gongba,
      url: 'https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LDk4YzMxOGY5LWM2YTUtNGQ4Ni1iNjkwLTZlYWI4NGY0ZjY5ZSwzZjhiYjY3ZC04OTFiLTQ2MWEtYmQ4Mi01ZTNhMmEyN2FlODk='
    }, {
      name: '发电引水隧洞',
      active: false,
      id: '4',
      img: fadaindong,
      url: 'https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LDk4YzMxOGY5LWM2YTUtNGQ4Ni1iNjkwLTZlYWI4NGY0ZjY5ZSwxMjZlMDQ1Ny0xZGE5LTRiNzEtODAxMC0wYzM4NDEyMzE3NTM='
    }, {
      name: '管理房',
      active: false,
      id: '5',
      img: guanlifang,
      url: 'https://rspt.zdwp.net:9990/#/sceneDetail?linkToken=ZjhkNDJiYjgtMjIzMC00MzNmLTk5ZjUtZDNlOWY0MzAxN2M5LDk4YzMxOGY5LWM2YTUtNGQ4Ni1iNjkwLTZlYWI4NGY0ZjY5ZSw0ZWYxMzI5My03MTU0LTRmZGQtYWU0Ny1kODEwNTc2OGE0ZjM='
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
    }, {
      name: '气象仿真',
      active: false,
      id: '4'
    },
  ]
])
const zhiliangActive = ref<boolean>(false)
const anquanActive = ref<boolean>(false)
const guankongActive = ref<boolean>(false)
const getNav1 = (indexs: number) => {
  navs.value.map((item: any, index: number) => {
    if (indexs == index) {
      item.active = true
      if (indexs < 3 && indexs > 0) {
        getNav2(0, indexs)
      } else {
        luanshengBoxShow.value = false
        fangzhenBoxShow.value = false
        getUe({ type: 'luanshenggo' })
        getUe({ type: 'fangzhengo' })
      }

      if (indexs == 3) {
        dataTree.value?.map((item: any) => {
          // getUe({ type: 'zhiliangdata', id: item.id, status: 'false' })
          getUe({ type: 'zhiliangdata', id: item.id, status: item.evaluationStatus == 'Assessed' ? 'true' : 'false' })
        })
        getUe({ type: 'zhiliang' })
        zhiliangActive.value = true
      } else {
        getUe({ type: 'zhilianggo' })
        zhiliangActive.value = false
      }
      if (indexs == 4) {
        anquanActive.value = true
        getUe({ type: 'anquanzhongxin' })
      } else {
        anquanActive.value = false
        getUe({ type: 'anquanzhongxingo' })
      }
      if (indexs == 0) {
        guankongActive.value = true
        getUe({ type: 'guankong' })
      } else {
        guankongActive.value = false
        getUe({ type: 'guankonggo' })
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
  navItems.value[index - 1].map((item: any, itemIndex: number) => {
    if (indexs == itemIndex) {
      item.active = true
    } else {
      item.active = false
    }
  })
  if (index == 1) {
    //孪生中心
    luanshengBoxShow.value = true
    getLuansheng(navItems.value[index - 1][indexs])
    // console.log('item', `luansheng${navItems.value[index][indexs].id}`);
    getUe({ type: `luansheng${navItems.value[index - 1][indexs].id}` })
    getUe({ type: 'luansheng' })
  } else {
    luanshengBoxShow.value = false
    getUe({ type: 'luanshenggo' })
  }
  if (index == 2) {
    //仿真中心
    fangzhenBoxShow.value = true
    getFangzhen(navItems.value[index - 1][indexs])
    getUe({ type: 'fangzhen' })

  } else {
    fangzhenBoxShow.value = false
    getUe({ type: 'fangzhengo' })
  }
}
// 获取孪生中心的信息
const getLuansheng = (item: any) => {
  luanshengItem.value = item
  // 发请求，调接口获取数据，接口还没写

}
//跳转去bim链接弹窗
const dialogBimVisible = ref(false)
const getBimLink = () => {
  dialogBimVisible.value = true
}
//获取进度列表
const getJindu = async () => {
  const res = await getProgress()
  console.log('进度列表', res);
}
//孪生中心详情弹窗展示
const dialogBim = ref(false)//发电引水弹窗
// const dialogBa = ref(false)//大坝弹窗
const getDialogDetails = (id: any) => {
  if (id == '4') {
    dialogBim.value = true
    handleClick(1)
  }
  if (id == '3') {
    getUe({ type: 'url', url: 'https://seawall.zdwp.net/bim/#/progressSimulation?Azimuth=0&Ploar=-20&zoomStep=1&vaultID=98c318f9-c6a5-4d86-b690-6eab84f4f69e&featureID=8514a92a-7a27-4e3e-8bcc-41df29beef26' })
  }
}
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




// 获取仿真中心的信息
const wenkongBox = ref<boolean>(false)
const yingliBox = ref<boolean>(false)
const tianqiBox = ref<boolean>(false)
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
    getUe({ type: 'shigongmoni' })
  } else {

  }
  if (item.id == 4) {
    //天气
    tianqiBox.value = true
    getTianQi(1)
  } else {
    tianqiBox.value = false
  }

}
//温控
const wenkongShow = ref<boolean>()
const getWenKong = (num: number) => {
  if (num == 1) {
    wenkongShow.value = true
    getUe({ type: 'shigongmoni' })
  } else {
    wenkongShow.value = false
  }
}
//天气
const tianqiShow = ref<number>(0)
const getTianQi = (num: number) => {
  tianqiShow.value = num
  getUe({ type: 'tianqi', id: num - 1 })
}
//应力
const yingliShow = ref<string>()
const getYingLi = async (num: string) => {
  yingliShow.value = num
  //画图表
  await nextTick();
  const chartDom1 = document.getElementById('echart1');
  const chartDom2 = document.getElementById('echart2');
  const chartDom3 = document.getElementById('echart3');
  const myChart1 = echarts.init(chartDom1);
  const myChart2 = echarts.init(chartDom2);
  const myChart3 = echarts.init(chartDom3);
  let option;

  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Microsoft YaHei'
      },
      data: ['实际值1', '实际值2', '参考值1', '参考值2']
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#FFFFFF', // 设置刻度标签字体颜色
        fontSize: 12,
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      boundaryGap: false,
      data: ['2025.03', '2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#FFFFFF', // 设置刻度标签字体颜色
        fontSize: 12,
        formatter: '{value}'
      },
      nameTextStyle: {
        color: '#FFFFFF', // 设置坐标轴名称字体颜色
        fontSize: 16,
        padding: [0, 0, 10, 0]
      },
    },
    series: [
      {
        name: '实际值1',
        type: 'line',
        stack: 'Total',
        data: [12, 13, 10, 13, 9, 23, 21]
      },
      {
        name: '实际值2',
        type: 'line',
        stack: 'Total',
        data: [22, 18, 19, 23, 29, 33, 31]
      },
      {
        name: '参考值1',
        type: 'line',
        stack: 'Total',
        data: [15, 23, 20, 15, 19, 33, 41]
      },
      {
        name: '参考值2',
        type: 'line',
        stack: 'Total',
        data: [32, 33, 30, 33, 39, 33, 32]
      }
    ]
  };
  myChart1.setOption(option);
  myChart2.setOption(option);
  myChart3.setOption(option);
}



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
  return data.label.includes(value)
}
//质量树总体
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
  dataTree.value = res
  // console.log('dataTree', dataTree.value);
}
//树节点弹窗
const treePopShow = ref(false)
const treePopName = ref('')
const currentNodeKey = ref('')
const handleNodeClick = (data: Tree) => {
  currentNodeKey.value = data.id
  getUe({ type: 'zhiliang', id: data.id })
  if (data.evaluationStatus != "Assessed") {
    ElMessage.warning({ message: `${data.name} 未验评`, duration: 1500 });
  } else {
    treePopShow.value = true
    treePopName.value = data.name
    getZhiliangTreeDeti(data.id)
  }
}
// 接收信息触发点击树放弹窗
watch(
  () => storeUe.ueStore,
  () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore.type == 'zhiliang') {
        dataTree.value.map((item: any) => {
          if (item.id == storeUe.ueStore.id) {
            currentNodeKey.value = item.id
            if (item.evaluationStatus != "Assessed") {
              ElMessage.warning({ message: `${item.name} 未验评`, duration: 1500 });
            } else {
              treePopName.value = item.name
              getZhiliangTreeDeti(item.id)
            }
          }
        })
      }
    }
  }
);
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
  //attachment
  if (res.attachment) {
    const file = await getZhiliangTreeDetilFile(res.attachment)
    treeDetil.value['file'] = file
  }
  if (res.video) {
    const img = await getZhiliangTreeDetilFile(res.video)
    treeDetil.value['img'] = img
  }
  // console.log('res', treeDetil.value);
}
//下载附件
const getDowlond = (urls: any) => {
  getUe({ type: 'url', url: urls })
}



//安全中心
// 监听anquanActive重置安全中心内容
watch(
  () => anquanActive.value,
  () => {
    if (!anquanActive.value) {
      wxActiveIndex.value = -1//高亮危险源恢复默认
    }
  }
);
const wxLists = ref([] as any)//危险源列表
const wxNumGeneral = ref<number>(0)//一般危险源
const wxNumMajor = ref<number>(0)//重大危险源
const getWeixian = async () => {
  const res = await getDangerLists()
  wxLists.value = res.list
  let General = 0
  let Major = 0
  wxLists.value.map((item: any) => {
    if (item.levelDesc == '重大危险源') {
      Major = Major + 1
    }
    if (item.levelDesc == '一般危险源') {
      General = General + 1
    }
  })
  wxNumGeneral.value = General
  wxNumMajor.value = Major
}
//点击危险源高亮，获取详情
const wxActiveIndex = ref<number>(-1)
const anquanIdPop = ref()
//接收ue传递展示弹窗
watch(
  () => storeUe.ueStore,
  () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore?.type == 'weixianyuan') {
        setTimeout(() => {
          getListItem(storeUe.ueStore.index, { item: storeUe.ueStore.id })
        }, 2500);
      }
    }
  }
);
const getListItem = (index: number, item: any) => {
  wxActiveIndex.value = index
  anquanIdPop.value = item.id
  getWXDetail(item.id)
}
const wxDetail = ref({} as any)
const dialogRef = ref<any>(null);
const getWXDetail = async (id: any) => {
  const wx = await getDangerDetail(id)
  dialogRef.value.Dialog = true;//打开弹窗
  wxDetail.value = wx
  // console.log('wx', wx);
}


// 管控中心
const guankongTabs = ref([
  {
    name: '工地总览',
    id: '1'
  },
  {
    name: '视频监控',
    id: '2'
  },
  {
    name: '环境监测',
    id: '3'
  },
  {
    name: '人员信息',
    id: '4'
  },
  {
    name: '机械设备',
    id: '5'
  },
])
const indexTab = ref('') as any
// 监听guankongActive重置安全中心内容
watch(
  () => guankongActive.value,
  () => {
    if (guankongActive.value) {
      //管控中心弹窗
      getGuankongTab(0)
    }
    // 管控中心图层标签展示
    if (guankongActive.value) {
      getUe({ type: 'tuceng', name: 'Alltags', id: 'true' })
    } else {
      getUe({ type: 'tuceng', name: 'Alltags', id: 'false' })
    }
  }
);
const getGuankongTab = (index: any) => {
  indexTab.value = index
}

onMounted(() => {
  getNav1(0)
  getTreeDatas()//获取树
  getJindu()//获取进度
  getWeixian()//获取危险源列表
})

// 暴露方法给父组件
defineExpose({
  getNav1,
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

          // &::after {
          //   content: '';
          //   width: 12px;
          //   height: 12px;
          //   background: url('../../assets/img/jiansheqi/add.png') no-repeat;
          //   background-size: 100%;
          //   position: absolute;
          //   top: 6px;
          //   left: -19px;
          // }
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

  .bim-pop {
    width: 1069px;
    height: 680px;
    position: absolute;
    top: 106px;
    left: 426px;
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 76, 111, 0.8);
    border-radius: 40px 0px 32px 0px;
    border: 1px solid rgba(110, 181, 242, 0.57);
    padding: 10px;

    .line {
      width: 1049px;
      height: 660px;
      background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(0, 54, 75, 0.81), rgba(21, 141, 207, 0.64);
      box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
      border-radius: 32px 0px 32px 0px;
      border: 1px solid rgba(166, 219, 249, 0.75);
      padding: 15px;
      overflow: hidden;

    }

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
        background: url('../../assets/img/weilai/cha.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .content-pop {
      width: 100%;
      height: 100%;
      padding: 9px;
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

    .tian-qi {
      width: 500px;
      height: 35px;
      left: 715px;
      position: absolute;
      bottom: 60px;
      background: url('../../assets/img/jiansheqi/wenkong-bg.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 35px;
        text-align: center;
        font-size: 16px;
        color: #FFFFFF;
        cursor: pointer;

        img {
          width: 30px;
          margin-right: 8px;
          height: 30px;
        }
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

          .content-yingli {
            width: 100%;

            .text {
              width: 370px;
              background: rgba(11, 45, 66, 0.24);
              border-radius: 8px;
              border: 1px solid rgba(60, 186, 247, 0.44);
              margin: 20px auto;

              .scrollbar-demo-item {
                width: 100%;
                padding: 10px 14px;
                font-family: MicrosoftYaHei;
                font-size: 16px;
                color: #FFFFFF;
                line-height: 28px;
                text-align: justify;
                font-style: normal;
              }
            }

            .yingli-echart {
              width: 370px;
              margin: 0 auto;

              .echart-item {
                width: 100%;
                height: 240px;
                margin-bottom: 13px;

                .header {
                  width: 100%;
                  height: 20px;
                  display: flex;
                  align-items: center;

                  .icon {
                    width: 20px;
                    height: 20px;
                    // margin-left: 24px;
                    margin-right: 9px;
                    background: url('../../assets/img/jiansheqi/bim-logo.png') no-repeat;
                    background-size: 100%;
                  }

                  .text1 {
                    font-family: DingTalk, DingTalk;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 19px;
                    text-align: center;
                    font-style: italic;
                  }

                  .line {
                    width: 274px;
                    height: 6px;
                    margin-left: 7px;
                    background: url('../../assets/img/jiansheqi/bim-xian.png') no-repeat;
                    background-size: 100% 100%;
                  }
                }

                .echart-main {
                  width: 100%;
                  margin-top: 10px;
                  height: 210px;
                }
              }
            }
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
            right: 0px;
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
              margin-right: 40px;

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

            :deep(.el-tree) {
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
                width: 17px;
                height: 17px;
                display: inline-block;
                background: url('../../assets/img/jiansheqi/ren-lan.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 8px;
              }

              .off {
                width: 17px;
                height: 17px;
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
      min-height: 346px;
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
        min-height: 270px;
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

        .files {
          align-items: start;

          .value {
            padding-top: 11px;

            .item-file {
              margin-bottom: 5px;
              cursor: pointer;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;

              &::after {
                content: ' ';
                position: absolute;
                right: 0px;
                top: 4px;
                width: 16px;
                height: 16px;
                background: url('@/assets/img/jiansheqi/dowlond.svg') no-repeat;
                background-size: 100% 100%;
              }

              &:hover {
                color: #6cc3f1;
              }
            }
          }
        }

        .imgs {
          align-items: start;

          .value {
            padding-top: 11px;
            width: 200px;

            .img {
              margin: 0 5px 5px 0;
            }
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
      background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.95);
      box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
      border-radius: 12px;
      border: 1px solid #3CBAF7;

      .content-anquan {
        width: 100%;

        .top {
          width: 100%;
          height: 101px;
          padding: 0 15px;
          margin: 9 0 16px;
          display: flex;
          align-items: center;

          .left {
            width: 126px;

            .left-top {
              width: 100%;
              height: 50px;
              background: url('../../assets/img/jiansheqi/anquan/top-bg.png') no-repeat;
              background-size: 100% 100%;
              line-height: 50px;
              text-align: center;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
            }

            .left-bottom {
              width: 100%;
              text-align: center;
              font-family: PangMenZhengDao;
              font-size: 24px;
              color: #FF736E;
              line-height: 24px;
            }
          }

          .center {
            width: 101px;
            height: 101px;
            background: url('../../assets/img/jiansheqi/anquan/logo.png') no-repeat;
            background-size: 100% 100%;
          }

          .right {
            width: 126px;

            .right-top {
              width: 100%;
              height: 50px;
              background: url('../../assets/img/jiansheqi/anquan/top-bg.png') no-repeat;
              background-size: 100% 100%;
              line-height: 50px;
              text-align: center;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
            }

            .right-bottom {
              width: 100%;
              text-align: center;
              font-family: PangMenZhengDao;
              font-size: 24px;
              color: #FF736E;
              line-height: 24px;
            }
          }
        }

        .lists-main {
          width: 100%;
          padding: 0 11px;

          .list-item {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            background: rgba(11, 45, 66, 0.25);
            border-radius: 2px;
            margin-top: 12px;
            padding: 0 10px;
            cursor: pointer;

            .logo {
              width: 24px;
              height: 24px;
              background: url('../../assets/img/jiansheqi/anquan/text-logo.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 10px;
            }

            .text {
              width: calc(100% - 34px);
              white-space: nowrap;
              /* 不换行 */
              overflow: hidden;
              /* 隐藏超出部分 */
              text-overflow: ellipsis;
              font-family: MicrosoftYaHei;
              font-size: 16px;
              color: #FFFFFF;
            }
          }

          .wxactive {
            box-shadow: inset 0px 0px 10px 0px #03A2F9, inset 0px 0px 22px 0px #05B4FF;
            border: 1px solid #6CCCFF;
          }
        }
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

  .guankong-box {
    position: absolute;
    top: 19px;
    right: 19px;
    width: 410px;
    height: 871px;
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 88, 111, 0.39);
    border-radius: 14px;
    border: 1px solid rgba(110, 181, 242, 0.57);

    .guankong-line {
      width: 400px;
      height: 860px;
      margin: 5px auto;
      background: linear-gradient(311deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(3, 60, 93, 0.48), rgba(14, 141, 208, 0.95);
      box-shadow: inset 0px 0px 19px 0px rgba(88, 207, 255, 0.72);
      border-radius: 12px;
      border: 1px solid #3CBAF7;

      .content-guankong {
        width: 100%;
        height: 790px;

        .top {
          width: 100%;
          height: 32px;
          padding: 0 10px;
          margin: 15px 0 16px;
          display: flex;
          align-items: center;
          // justify-content: space-around;
          justify-content: space-between;


          .tab {
            width: 86px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            text-align: center;
            cursor: pointer;
            background: url('../../assets/guankong/construction_bg.png') no-repeat;
            background-size: 100% 100%;
            font-size: 16px;
          }

          .tabActive {
            background: url('../../assets/guankong/construction_bg_active.png') no-repeat;
            background-size: 100% 100%;
          }

        }

        .lists-main {
          width: 100%;
          height: 100%;
          padding: 0 11px;
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

      .color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

    }
  }

}

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
        background: url('../../assets/luansheng/tab.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin-right: 10px;
      }

      .tab-active {
        background: url('../../assets/luansheng/tab-active.png') no-repeat;
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
            background: url('../../assets/luansheng/dizhi.png') no-repeat;
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