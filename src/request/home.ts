import { get, post } from './http';

//投资
export function getInvest() {
  return get('/zdwp-api/v3/screenFinance/financeInvestStatistics?projectId=1813759284281929730&_t=1745374566024');
}
// 产值
export function getChanzhi() {
  return get('/zdwp-api/v3/screenFinance/financeOutputStatisticsV2?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024');
}
// 合同额
export function getHetonge() {
  return get('/zdwp-api/v3/screenFinance/contractPayStatisticsV2?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024');
}
// 进度控制，完成情况
export function getProgress(par: any) {
  return post('/zdwp-api/v3/schedule/plan/job/page', par);
}
// 视频获取
export function getMv(code: string) {
  return get(`/zdwp-api/v3/construction/construction-monitor-association/hkMonitorPreview/1813759284281929730/${code}/hlss`, {
    projectId: '1813759284281929730',
  });
}
// 质量控制
export function getZhiLiang() {
  return get('/zdwp-api/v3/quality/statisticsWbsType?projectId=1813759284281929730&sectionId=1813759430390509569&isProcess=false&_t=1745374566024');
}
// 安全控制
export function getAnQuan() {
  return post('/zdwp-api/v3/safe/safe-patrol-sickness/querySicknessSummary', {
    sectionId: '1813759430390509569',
    projectId: '1813759284281929730'
  });
}