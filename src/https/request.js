import { ElMessage } from "element-plus";
import axios from "axios";
import qs from "qs";
import { useTokenStore } from "@/stores/token";

/**
 * 普通请求
 * @param baseUrl 请求地址
 * @param isWarn 是否显示错误提示
 * @param isToken 是否增加token
 * @param usingCache 是否使用缓存
 */

function request(
  baseUrlIn,
  {
    isWarn = true,
    isToken = true,
    contentType = "application/json",
    usingCache = false,
    needNullStr = false,
  } = {}
) {
  let baseUrl = baseUrlIn;
  if (!baseUrl) {
    // 如果没有传自定义baseUrl 则走默认
    baseUrl = import.meta.env.VITE_APP_BASE_API;
  }
  const service = axios.create({
    baseURL: baseUrl,
    timeout: 50000, // request timeout
    headers: {
      "Content-Type": contentType,
    },
  });
  interceptors(service, { isWarn, isToken, usingCache, needNullStr });

  return service;
}
function requestForDownLoad(baseUrlIn, { isWarn = true, isToken = true } = {}) {
  let baseUrl = baseUrlIn;
  if (!baseUrl) {
    // 如果没有传自定义baseUrl 则走默认
    baseUrl = import.meta.env.VITE_APP_BASE_API;
  }
  const service = axios.create({
    baseURL: baseUrl,
    // timeout: 50000, // request timeout
    responseType: "blob",
  });
  interceptors(service, { isWarn, isToken });

  return service;
}
function requestNoProjectId(
  baseUrlIn,
  {
    isWarn = true,
    isToken = true,
    contentType = "application/json",
    usingCache = false,
  } = {}
) {
  let baseUrl = baseUrlIn;
  if (!baseUrl) {
    // 如果没有传自定义baseUrl 则走默认
    baseUrl = import.meta.env.VITE_APP_BASE_API;
  }
  const service = axios.create({
    baseURL: baseUrl,
    timeout: 50000, // request timeout
    headers: {
      "Content-Type": "application/json",
    },
  });
  interceptors(service, { isWarn, isToken, usingCache, hasProject: false });

  return service;
}

function requestNoSectionId(
  baseUrlIn,
  { isWarn = true, isToken = true, usingCache = false } = {}
) {
  let baseUrl = baseUrlIn;
  if (!baseUrl) {
    // 如果没有传自定义baseUrl 则走默认
    baseUrl = import.meta.env.VITE_APP_BASE_API;
  }
  const service = axios.create({
    baseURL: baseUrl,
    timeout: 50000, // request timeout
    headers: {
      "Content-Type": "application/json",
    },
  });
  interceptors(service, {
    isWarn,
    isToken,
    usingCache,
    hasProject: true,
    hasSection: false,
  });

  return service;
}

function requestOriginTenant(
  baseUrlIn,
  { isWarn = true, isToken = true, usingCache = false } = {}
) {
  let baseUrl = baseUrlIn;
  if (!baseUrl) {
    // 如果没有传自定义baseUrl 则走默认
    baseUrl = import.meta.env.VITE_APP_BASE_API;
  }
  const service = axios.create({
    baseURL: baseUrl,
    timeout: 50000, // request timeout
    headers: {
      "Content-Type": "application/json",
    },
  });
  interceptors(service, {
    isWarn,
    isToken,
    usingCache,
    hasProject: false,
    hasSection: false,
    hasTenantId: false,
  });

  return service;
}

function requestMain(
  baseUrlIn,
  {
    isWarn = true,
    isToken = true,
    isTenant = true,
    contentType = "application/json",
    usingCache = false,
    useMainTenant = false,
  } = {}
) {
  baseUrlIn = baseUrlIn || import.meta.env.VITE_APP_BASE_API;

  return {
    get(url, params, opts = {}) {
      interceptors(null, {
        isWarn,
        isToken,
        isTenant,
        usingCache,
        useMainTenant,
      });
      const data = { ...params?.params };
      for (const key of Object.keys(data)) {
        if (typeof data[key] === "undefined" || data[key] === null) {
          delete data[key];
        }
      }
      return httpRequest({
        ...defaultOptions,
        ...opts,
        data,
        method: "get",
        url: `${baseUrlIn}${url}`,
      });
    },
    post(url, data) {
      interceptors(null, {
        isWarn,
        isToken,
        isTenant,
        usingCache,
        useMainTenant,
      });
      return httpRequest({
        ...defaultOptions,
        data,
        method: "post",
        url: `${baseUrlIn}${url}`,
      });
    },
  };
}

/**
 * 拦截器
 * @param service
 * @param isWarn
 * @param isToken
 */
function interceptors(
  service,
  {
    isWarn = true,
    isToken = true,
    usingCache,
    hasProject = true,
    needNullStr = false,
    hasSection = true,
    hasTenantId = true,
  } = {}
) {
  service.interceptors.request.use(
    (request) => {
      if (request.method === "get") {
        request.paramsSerializer = function (params) {
          return qs.stringify(params, { arrayFormat: "repeat" });
        };
      }
      const data = request.data;
      if (data && data.params) {
        request.data = null;
        request.params = data.params;
      }
      const projectId = "1870026786274852865";
      const sectionId = null;
      const tenantId = "1870005112743178242";
      request.headers["project-id"] = projectId;
      request.headers["Zhjg-Request-By"] = "seawall-zhjg-w1w";
      request.headers["Tenant-Id"] = hasTenantId ? tenantId || "-1" : "-1";
      if (
        projectId !== "undefined" &&
        projectId !== "0" &&
        !!projectId &&
        hasProject
      ) {
        if (request.method === "get" || request.method === "delete") {
          request.params = {
            projectId: request.params?.projectId || projectId || "",
            sectionId,
            ...(request.params || {}),
          };
          if (!usingCache) {
            request.params._t = Number(new Date());
          }
        }
        if (request.method === "post" || request.method === "put") {
          request.data = {
            projectId: request.data?.projectId || projectId || "",
            sectionId,
            ...(request.data || {}),
          };
        }
      }
      // 标段为空的时候单独过滤下 不然在某些版本下会报错
      if (request.params && !request.params["sectionId"]) {
        delete request.params["sectionId"];
      }
      if (request.data && !request.data["sectionId"]) {
        delete request.data["sectionId"];
      }
      for (const item in request.params || {}) {
        if (
          typeof request.params[item] === "undefined" ||
          (typeof request.params[item] === "string" &&
            !request.params[item] &&
            request.method !== "post" &&
            !needNullStr)
        ) {
          delete request.params[item];
        }
      }
      try {
        for (const k in request.data || {}) {
          if (typeof request.data[k] === "string") {
            request.data[k] = request.data[k].trim(); // 去空格
            if (!request.data[k] && !needNullStr) {
              delete request.data[k];
            }
          }
        }
      } catch (e) {
        ElMessage({
          showClose: true,
          message: "系统正在更新中，请稍候。这可能需要几分钟。",
          grouping: true,
          type: "error",
        });
      }
      if (isToken) {
        const tokenStore = useTokenStore();
        const token = tokenStore.token;
        const accessToken = tokenStore.xAccessToken || "";
        if (token) {
          request.headers = {
            token: token,
            accept: "application/json",
            "X-Access-Token": accessToken,
            ...request.headers,
          };
        }
      } else {
        request.headers["project-id"] = "";
        request.headers["Tenant-Id"] = "-1";
      }
      return request;
    },
    () => {}
  );

  service.interceptors.response.use(
    (response) => {
      if (response.status >= 200 && response.status <= 204) {
        if (response.data.code === 403) {
          toLogin(response.data, isWarn);
          return Promise.reject(response);
        }
        if (
          response.data.code === 500 ||
          response.data.code === 400 ||
          response.data.code > 500
        ) {
          // isWarn &&
          //   ElMessage({
          //     showClose: true,
          //     message:
          //       (response.data?.sysMsg || "").replace("运行时异常:", "") ||
          //       response.data?.msg,
          //     grouping: true,
          //     type: "warning",
          //   });
          return Promise.reject(response);
        }
        return response.request.responseType === "blob"
          ? response
          : response.data;
      } else {
        if (response.status === 403) {
          toLogin(response.data, isWarn);
        }
        console.log(
          "🚀 ~ file: request.js:170 ~ interceptors ~ response:",
          response
        );

        return Promise.reject(response);
      }
    },
    (error) => {
      const res = error.response;
      if (res?.status === 403 || res?.status === 401) {
        toLogin(res.data, isWarn);
        return Promise.reject(error);
      }
      if (isWarn) {
        // const msg = res?.status === 400 ? res.data?.title : res.data?.message
        ElMessage({
          showClose: true,
          message: "系统正在更新中，请稍候。这可能需要几分钟。",
          grouping: true,
          type: "error",
        });
      }
      return Promise.reject(error);
    }
  );
}

function toLogin(data, isWarn = true) {
  ElMessage({
    showClose: true,
    message: data.message || data.msg || "登陆失效，请重新登陆",
    grouping: true,
    type: "error",
  });

  if (router.currentRoute.value.path !== "/login") {
    const tokenStore = useTokenStore();
    tokenStore.clearToken();
  }
}

export default {
  request,
  requestNoProjectId,
  requestForDownLoad,
  requestOriginTenant,
  interceptors,
  requestNoSectionId,
  requestMain,
};
