import { get } from './http';

//获取树的接口
export function getZhiliangTree() {
  return get('/zdwp-api/v3/quality/evaluation/filling/tree?projectId=1813759284281929730&sectionId=1813759430390509569&_t=1745374566024');
}
//获取树节点详细信息
export function getZhiliangTreeDetil(par: any) {
  return get(`/zdwp-api/v3/quality/evaluation/filling/query?projectId=1805438631199453186&sectionId=1805514088733290497&wbsId=${par}&_t=1745891345199`);
}