import { get, post } from "./http";

//获取坝段
export function getBadaun() {
  return get(
    "/zdwp-api/v3/sys/dict/data/tree/dam_section_list?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024"
  );
}
//获取高程
export function getGaocheng(par: any) {
  return get(
    `/zdwp-api/v3/schedule/dam/position/list/elevation?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//获取仓位列表
export function getCang(par: any) {
  return get(
    `/zdwp-api/v3/schedule/dam/position/list?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//统计坝段/仓数
export function getTotal(par: any) {
  return get(
    `/zdwp-api/v3/schedule/dam/pour/statistics/section/position?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//统计坝段/仓数，按年
export function getTotalYear(par: any) {
  return get(
    `/zdwp-api/v3/schedule/dam/pour/statistics/pour/year?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//浇筑详情
export function getTotalDetail(par: any) {
  return get(
    `/zdwp-api/v3/schedule/dam/plan/list?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//报警信息
export function getWarnStats(par: any) {
  return get(
    `/zdwp-api/v3/construction/construction-temp-screen/warnStats?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//报警信息统计
export function getWarnTotal(par: any) {
  return get(
    `/zdwp-api/v3/construction/construction-temp-warn/stats?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//报警信息列表
export function getWarnLists() {
  return get(
    `/zdwp-api/v3/construction/construction-temp-screen/warnList?projectId=1813759284281929730&_t=1745374566024`
  );
}
//对应仓报警信息
export function getWarnCang(par: any) {
  return get(
    `/zdwp-api/v3/construction/construction-temp-screen/damWarn?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
//对应仓的折线图
export function getCangEchart(par: any) {
  return get(
    `/zdwp-api/v3/construction/construction-temp-data/rangeData?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024`,
    par
  );
}
