import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const ueStoreJson = defineStore("ueStore", () => {
  const ueStore = useStorage("ueStore", {}, sessionStorage);

  // 设置ueStore值
  const setUeStore = (tokenParam) => {
    ueStore.value = tokenParam;
  };
  // 清空ueStore
  const clearUeStore = () => {
    ueStore.value = {};
  };

  return { ueStore, setUeStore, clearUeStore };
});
