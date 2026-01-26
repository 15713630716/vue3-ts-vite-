import request from "./request";

const Request = request.request(import.meta.env.VITE_APP_BASE_API);
const RequestWithCache = request.request(import.meta.env.VITE_APP_BASE_API, {
  usingCache: true,
});
const RequestMain = request.requestMain(import.meta.env.VITE_APP_BASE_API, {
  useMainTenant: true,
});
const RequestNoTenantId = request.request(import.meta.env.VITE_APP_BASE_API, {
  hasTenantId: false,
});

// 获取标段
export const getContractSection = () => {
  return Request.get("/business/section/permission");
};
// 获取租户
export const getTenantList = () => {
  return RequestNoTenantId.get("/auth/tenantList");
};
// 刷新token
export const selectProject = (id, wxCode) => {
  return Request.get(`/auth/select?id=${id}&wxCode=${wxCode}`);
};
//获取巡察单位
export const orgTreeProject = (parentId) => {
  const params = { parentId };
  return Request.get("/sys/dept/project", { params });
};
//开始巡查表单提交
export function saveData(data) {
  return Request.post("/safe/safe-risk-patrol-info/save", data);
}
