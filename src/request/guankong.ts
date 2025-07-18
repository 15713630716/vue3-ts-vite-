import { get, post } from './http';

//获取视频监控列表
export function getMvLists() {
  return get(`/zdwp-api/v3/construction/construction-monitor-association/page?projectId=1813759284281929730&sectionId=1813759430390509569&currentPage=1&pageSize=1000&_t=1750233926058`);
}

//获取环境监测信息
export function getHuanJingWarn() {
  return get(`/zdwp-api/v3/construction/construction-em-device/page?projectId=1813759284281929730&sectionId=1813759430390509569&currentPage=1&pageSize=9999&hasLastPushData=true&_t=1750234224295`);
}
//获取人员定位
export function getRenLine() {
  return get(`/zdwp-api/v3/construction/construction-hat/hatCount?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1750234325831`);
}
//获取人员考勤
export function getRenWork() {
  return post(`/zdwp-api/v3/construction/construction-attendance/queryAttendanceSummary`, {
    projectId: "1813759284281929730",
    sectionId: "1813759430390509569",
  });
}
//获取设备列表
export function getDeviceLists(params: any) {
  return get(`/zdwp-api/v3/Construction/mechanicalPage?projectId=1813759284281929730&sectionId=1813759430390509569&currentPage=1&pageSize=9999&_t=1750234619284`, params);
}
//获取普通设备
export function getOrdinaryDevice() {
  return get(`/zdwp-api/v3/Construction/getConstructionMechanicalTypeCount?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1750234619284`);
}
//获取设备投入
export function getInvestmentDevice() {
  return get(`/zdwp-api/v3/Construction/mechanicalData?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1750234619284`);
}
//获取设备详情
export function getInvestmentDetail(par: any) {
  return get(`/zdwp-api/v3/Construction/mechanicalDetail?projectId=1813759284281929730&_t=1750992608660`, par);
}
