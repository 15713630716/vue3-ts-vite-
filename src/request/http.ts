import axios from 'axios';
import axiosRetry from 'axios-retry';
import QS from 'qs';


const ERR_OK = 200;

axiosRetry(axios, { retry: 5 } as any);
axios.defaults.timeout = 8000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//配置接口地址
axios.defaults.baseURL = import.meta.env.VITE_APP_API;

//post 传参序列化，（添加请求拦截器）
axios.interceptors.request.use(
  (config): any => {

    if (config.method === 'post') {
      config.data = QS.stringify(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 返回判断状态（添加响应拦截器）
axios.interceptors.response.use(
  (res) => {
    // 处理响应数据
    // 缺少token,返回403
    if (res.data.success) {
      return Promise.resolve(res);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export function get(url: string, params?: any) {
  return axios
    .get(url, { params })
    .then((res) => {
      // console.log(res, 'res')
      let serverData = res.data;
      if (serverData.code === ERR_OK) {
        return serverData.data;
      } else {
        return {
          code: serverData.code,
          msg: serverData.message,
        };
      }
    })
    .catch((e) => {
      console.log('axios错误:', e);
    });
}

export function post(url: string, params?: any) {
  // console.log('params', params);
  return axios
    .post(url, params)
    .then((res) => {
      let serverData = res.data;
      if (serverData.code === ERR_OK) {
        return serverData.data;
      } else {
        return {
          code: serverData.code,
          msg: serverData.message,
        };
      }
    })
    .catch((e) => {
      console.log('axios错误:', e);
    });
}
export default {
  get,
  post,
};