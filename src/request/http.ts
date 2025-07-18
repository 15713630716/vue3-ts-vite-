import axios from 'axios';
import axiosRetry from 'axios-retry';
// import QS from 'qs';
import { useStoreToken } from '@/store';
import { axiosToken } from '../request/getToken'
import { getUe } from '@/utils/getUe';


const ERR_OK = 200;
const storeToken = useStoreToken();
axiosRetry(axios, { retry: 5 } as any);
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
//配置接口地址
axios.defaults.baseURL = import.meta.env.VITE_APP_API;

//post 传参序列化，（添加请求拦截器）
axios.interceptors.request.use(
  (config): any => {
    config.headers['Tenant-Id'] = '1894712966457069569'
    config.headers['Project-Id'] = '1813759284281929730'
    config.headers['token'] = `Bearer ${storeToken.token}`
    //config.headers['token'] = `Bearer eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJyb2wiOiJ1c2VyIiwidXNlcmluZm8iOnsidXNlcklkIjoxODAzNzEyNTEwMTYyOTU2Mjg5LCJ1c2VybmFtZSI6IjE4MzgwMTY4MjI5Iiwibmlja05hbWUiOiLmrKfpmLPkv4rkv4oiLCJwaG9uZSI6IjE4MzgwMTY4MjI5IiwiZGVwdElkIjoxNDA5NDQyMjk1NDQ2NTc3MTUzLCJkZXB0TmFtZSI6Iua1meaxn-ecgeawtOWIqeawtOeUteWLmOa1i-iuvuiuoemZouaciemZkOi0o-S7u-WFrOWPuCIsImVtYWlsIjoiIiwic3RhdHVzIjpudWxsLCJwYXNzd29yZCI6bnVsbCwiZW5hYmxlZCI6dHJ1ZSwiYWNjb3VudFR5cGUiOiJQUk9KRUNUX01BTkFHRVIiLCJwcm9qZWN0SWQiOjE4MTM3NTkyODQyODE5Mjk3MzAsInRlbmFudElkIjoiMTg5NDcxMjk2NjQ1NzA2OTU2OSIsImF2YXRhciI6IiIsImF1dGhvcml0aWVzIjpudWxsLCJhY2NvdW50Tm9uRXhwaXJlZCI6dHJ1ZSwiYWNjb3VudE5vbkxvY2tlZCI6dHJ1ZSwiY3JlZGVudGlhbHNOb25FeHBpcmVkIjp0cnVlfSwianRpIjoiMTgwMzcxMjUxMDE2Mjk1NjI4OSIsInRlbXBFbmNyeXB0S2V5IjoiZ3ZzNnhtZGpwSEdvRVlQbGhib1BJUT09IiwiaWF0IjoxNzQ5MTc3OTc5LCJzdWIiOiIxODAzNzEyNTEwMTYyOTU2Mjg5IiwiZXhwIjoxNzQ5NDM3MTc5fQ.dR6VCzP6hTzwfWjNU2JD5f01Z3zcx8l3UEj-XalQwp4`

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
      // 直接刷新当前页面（可能会从浏览器缓存加载）
      window.location.href = '#/index';
      window.location.reload();
      getUe({ type: 'qiehuan_cz' })
      getUe({ type: 'zhilianggo' })
      getUe({ type: 'anquanzhongxingo' })
      getUe({ type: 'guankonggo' })
      getUe({ type: 'luanshenggo' })
      getUe({ type: 'fangzhengo' })

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