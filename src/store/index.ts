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