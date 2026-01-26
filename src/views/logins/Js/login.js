import { encrypt } from "./crypto";
import request from "@/https/request";

const Request = request.request(import.meta.env.VITE_APP_BASE_API);
const RequestNoToken = request.request(import.meta.env.VITE_APP_TENANT_API, {
  isToken: false,
});
const RequestNoWarn = request.request(import.meta.env.VITE_APP_BASE_API, {
  isWarn: false,
});
const RequestMain = request.requestOriginTenant(
  import.meta.env.VITE_APP_TENANT_API,
  { isWarn: false }
);

export default {
  login(data) {
    return RequestNoToken.post("/auth/login", data);
  },
  doubleFactorLogin(data) {
    return RequestNoToken.post("/auth/doubleFactor/login", data);
  },
  login4cmp(data) {
    return RequestNoToken.post("/auth/login-cmp", data);
  },
  getCheckCode(params) {
    return RequestMain.get("/auth/captcha", { params });
  },
  getUser() {
    return RequestMain.get("/auth/userinfo");
  },
  selectProject(id) {
    return Request.get(`/auth/select?id=${id}`);
  },
  // 发送手机验证码
  sendSmsCodeV2(data) {
    // const params = { phone: encrypt(phone) }
    return RequestMain.post(`/auth/sendSmsCode`, data);
  },
  getAuthLogin(params) {
    return RequestMain.get(`/basic/sysTenant/authorByTicket`, { params });
  },
  sendSmsCode(phone) {
    const params = { phone: encrypt(phone) };
    return Request.get(`/auth/sendSmsCode`, { params });
  },
  sendSmsCodeNotEncrypt(phone) {
    return Request.get(`/auth/sendSmsCode`, { params: { phone } });
  },
  // 手机验证码登陆
  smsLogin(data) {
    return Request.post("/auth/smsLogin", data);
  },
  // 修改密码
  resetPasswdBySms(data) {
    return Request.post("/auth/resetPasswdBySms", data);
  },
  // 根据获取token
  getTokenByTicket(params) {
    // 智慧建管平台
    if (params && params.ticketPlatform === "zhjg") {
      return RequestNoToken.get("/auth/zhjg/checkTicket", { params });
    }
    return RequestNoToken.get("/auth/zdwp/checkLogin", { params });
  },
  // 校验token
  checkToken() {
    return RequestMain.get("/auth/check/token");
  },
  getYMToken(data) {
    return Request.post("/auth/jl/getYMToken", data);
  },
  // 透明工程免登录跳转
  getAuthorByTicket(params) {
    return Request.get("/transparent-project/authorByTicket", { params });
  },
};
