import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core';

export const useStoreToken = defineStore('token', () => {
  const token = useStorage('token', '', sessionStorage);

  // 设置token值
  const setToken = (tokenParam: string) => {
    token.value = tokenParam;
  };
  // 清空
  const clearToken = () => {
    token.value = '';
  };

  return { token, setToken,clearToken };
});
export const ueStoreJson = defineStore('ueStore', () => {
  const ueStore = useStorage('ueStore', {} as any, sessionStorage);

  // 设置ueStore值
  const setUeStore = (tokenParam: any) => {
    ueStore.value = tokenParam;
  };
  // 清空ueStore
  const clearUeStore = () => {
    ueStore.value = {};
  };

  return { ueStore, setUeStore, clearUeStore };
});
export const useStoreWeather = defineStore('weather', () => {
  const weather = useStorage('weather', false as any, sessionStorage);

  // 设置ueStore值
  const setWeatherStore = (tokenParam: any) => {
    weather.value = tokenParam;
  };

  return { weather, setWeatherStore };
});
export const useStoreRouter = defineStore('routerUrl', () => {
  const routerUrl = useStorage('routerUrl', '' as any, sessionStorage);

  // 设置ueStore值
  const setRouterUrlStore = (tokenParam: any) => {
    routerUrl.value = tokenParam;
  };

  return { routerUrl, setRouterUrlStore };
});