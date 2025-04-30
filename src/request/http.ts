import axios from 'axios';
import axiosRetry from 'axios-retry';
// import QS from 'qs';
import { useStoreToken } from '@/store';
import { axiosToken } from '../request/getToken'


const ERR_OK = 200;
const storeToken = useStoreToken();
axiosRetry(axios, { retry: 5 } as any);
axios.defaults.timeout = 8000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
//配置接口地址
axios.defaults.baseURL = import.meta.env.VITE_APP_API;

//post 传参序列化，（添加请求拦截器）
axios.interceptors.request.use(
  (config): any => {
    config.headers['Tenant-Id'] = '1894712966457069569'
    config.headers['Project-Id'] = '1813759284281929730'
    config.headers['token'] = `Bearer ${storeToken.token}`
    // config.headers['token']=`Bearer eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJyb2wiOiJ1c2VyIiwidXNlcmluZm8iOnsidXNlcklkIjoxOTAyNTMxNTk4Njc4NTUyNTc4LCJ1c2VybmFtZSI6IjE4MzY3NjI1OTg3Iiwibmlja05hbWUiOiLljY7pmYbpn6wiLCJwaG9uZSI6bnVsbCwiZGVwdElkIjoxNDA5NDQyMjk1NDQ2NTc3MTUzLCJlbWFpbCI6bnVsbCwic3RhdHVzIjpudWxsLCJwYXNzd29yZCI6bnVsbCwiZW5hYmxlZCI6dHJ1ZSwiYWNjb3VudFR5cGUiOiJQUk9KRUNUX01BTkFHRVIiLCJwcm9qZWN0SWQiOjE4MTM3NTkyODQyODE5Mjk3MzAsInRlbmFudElkIjoiMTg5NDcxMjk2NjQ1NzA2OTU2OSIsImF2YXRhciI6bnVsbCwiYXV0aG9yaXRpZXMiOm51bGwsImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJhY2NvdW50Tm9uTG9ja2VkIjp0cnVlLCJjcmVkZW50aWFsc05vbkV4cGlyZWQiOnRydWV9LCJqdGkiOiIxOTAyNTMxNTk4Njc4NTUyNTc4IiwiaWF0IjoxNzQ1MzIwNjE1LCJzdWIiOiIxOTAyNTMxNTk4Njc4NTUyNTc4IiwiZXhwIjoxNzQ1OTI1NDE1fQ.H2s9nNowgHfXTvvSaGqFLzMd3-tsEWGu5IAf8qUyVJU`

    // if (config.method === 'post') {
    //   console.log(config.data);
    //   console.log(QS.stringify(config.data));
    //   config.data = QS.stringify(config.data);
    // }

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
    // const storeToken = useStoreToken();
    // console.log(res, 'res');
    // if (res.data.code == 510) {
    //   // 过期操作
    //   console.log('用户token过期,请重新');
    //   storeToken.setToken('');
    //   axiosToken()
    // }
    if (res.data.status == '200') {
      return Promise.resolve(res);
    }
    return res;
  },
  (error) => {
    if (error.status == 403) {
      // 过期操作
      // console.log('用户token过期,请重新');
      storeToken.setToken('');
      axiosToken()
    }
    return Promise.reject(error);
  }
);


export function get(url: string, params?: any) {
  return axios
    .get(url, { params })
    .then((res) => {
      let serverData = res.data;
      if (serverData.code === ERR_OK) {
        if (url.indexOf('hlss') !== -1) {
          return JSON.parse(serverData.msg).data.url
        } else {
          return serverData.data;
        }
      } else {
        return serverData
      }
    })
    .catch((e) => {
      console.log('axios错误:', e);
    });
}

export function post(url: string, params?: any) {
  return axios
    .post(url, params)
    .then((res) => {
      // console.log(res);
      let serverData = res.data;
      if (serverData.code === ERR_OK) {
        return serverData.data;
      } else {
        return serverData
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