import { defineStore } from "pinia";
import { ref, computed } from "vue";
// import { getUser } from '@/api/modular/user'

// 默认用户信息
const defaultUserInfo = {
  userId: "",
  username: "",
  nickName: "",
  phone: "",
  deptId: "",
  email: "",
  status: null,
  password: "",
  enabled: true,
  accountType: "",
  projectId: -1,
  authorities: null,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  roleNameList: [],
  dept: {},
};

export const useUserInfoStore = defineStore("userInfo", () => {
  // State - 使用 ref
  const _userInfo = ref({ ...defaultUserInfo });

  // Getters - 使用 computed
  const userInfo = computed(() => _userInfo.value);
  const isLoggedIn = computed(() => !!_userInfo.value.userId);
  const userName = computed(
    () => _userInfo.value.nickName || _userInfo.value.username
  );
  const userRoles = computed(() => _userInfo.value.roleNameList || []);

  // Actions
  const setUserInfo = (userData) => {
    _userInfo.value = userData;
  };

  const updateUserInfo = (partialInfo) => {
    _userInfo.value = { ..._userInfo.value, ...partialInfo };
  };

  const clearUserInfo = () => {
    _userInfo.value = { ...defaultUserInfo };
  };

  const getUserInfo = async () => {
    try {
      // const { data } = await getUser();
      // setUserInfo(data);
      // return data;
    } catch (error) {
      console.error("获取用户信息失败:", error);
      throw error;
    }
  };

  const hasPermission = (permission) => {
    return _userInfo.value.authorities?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return _userInfo.value.roleNameList?.includes(role) || false;
  };

  return {
    // State
    _userInfo,

    // Getters
    userInfo,
    isLoggedIn,
    userName,
    userRoles,

    // Actions
    setUserInfo,
    updateUserInfo,
    clearUserInfo,
    getUserInfo,
    hasPermission,
    hasRole,
  };
});
