import { get, post } from './http';

//获取树的接口
export function getZhiliangTree() {
  return get('/zdwp-api/v3/quality/evaluation/filling/tree?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024');
}
//获取树节点详细信息
export function getZhiliangTreeDetil(par: any) {
  return get(`/zdwp-api/v3/quality/evaluation/filling/query?projectId=1805438631199453186&sectionId=1813759430390509569&wbsId=${par}&_t=1745891345199`);
}


//获取危险源详情
export function getDangerDetail(id: any) {
  return get(`/zdwp-api/v3/safe/safe-risk-source/detailWithSummary/${id}?projectId=1813759284281929730&_t=1745890199939`);
}
//获取危险源列表
export function getDangerLists() {
  return get(`/zdwp-api/v3/safe/safe-risk-source/page?projectId=1813759284281929730&sectionId=1813759430390509569&isCurrent=1&_t=1745890199939`);
}
//获取危险源详情责任主体
export function getDangerZeren(id: any) {
  return get(`/zdwp-api/v3/safe/safe-risk-source/detailWithSummary/${id}?projectId=1813759284281929730&_t=1745890199939`);
}
//获取危险源详情研判过程
export function getDangerYanpan(id: any) {
  return get(`/zdwp-api/v3/safe/safe-risk-source/changeList/${id}?projectId=1813759284281929730&_t=1745890199939`);
}
//获取危险源详情预警信息流程
export function getDangerYujing(id: any) {
  return get(`/zdwp-api/v3/workflow/processInstance/detail/${id}`);
}
//获取进度
export function getProgress() {
  return post(`/zdwp-api/v3/schedule/plan/job/page`, {
    currentPage: 1,
    pageSize: 9999,
    planId: "1831145611508363265",
    planName: "进度计划",
    projectId: "1813759284281929730",
    sectionId: "1813759430390509569",
  });
}
