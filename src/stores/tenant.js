import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useTenantStore = defineStore("tenant", () => {
  const tenantId = useStorage("tenant", "", sessionStorage);

  // 设置tenantId值
  const setTenantId = (tokenParam) => {
    tenantId.value = tokenParam;
  };
  // 清空
  const clearTenantId = () => {
    tenantId.value = "";
  };

  return { tenantId, setTenantId, clearTenantId };
});
