import { ref, computed } from "vue";
import { Base64 } from "js-base64";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", () => {
  // state
  const authKey = ref("seawall_token_3.0");
  const droneKey = ref("drone_token");
  const _token = ref("");
  const _xAccessToken = ref("");
  const _drone = ref("");

  // getters
  const token = computed(() => {
    return _token.value ? _token.value : localStorage.getItem(authKey.value);
  });

  const droneToken = computed(() => {
    return _drone.value ? _drone.value : localStorage.getItem(droneKey.value);
  });

  const xAccessToken = computed(() => _xAccessToken.value);

  // actions
  function setToken(v) {
    if (v) {
      _token.value = v;
      localStorage.setItem(authKey.value, v);
    } else {
      const localStorageToken = localStorage.getItem(authKey.value);
      _token.value = localStorageToken;
    }
  }

  function setAccessToken(v) {
    _xAccessToken.value = v;
  }

  function clearToken() {
    _token.value = "";
    localStorage.setItem(authKey.value, "");
  }

  function getTokenInfo() {
    const match = _token.value.match(/(?<=\.)[^\.]+(?=\.)/);
    return match ? Base64.decode(match[0]) : "";
  }

  function setDroneToken(v) {
    _drone.value = v;
    localStorage.setItem(droneKey.value, v);
  }

  return {
    // state
    authKey,
    droneKey,
    _token,
    _xAccessToken,
    _drone,

    // getters
    token,
    droneToken,
    xAccessToken,

    // actions
    setToken,
    setAccessToken,
    clearToken,
    getTokenInfo,
    setDroneToken,
  };
});
