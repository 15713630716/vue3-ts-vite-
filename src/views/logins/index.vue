<template>
  <div class="login">
    <div class="left"></div>
    <div class="right">
      <div class="main pointer-events-all">
        <div class="title">用户登录</div>
        <div class="conation">
          <el-form
            ref="formRef"
            label-position="top"
            :model="form"
            label-width="50px"
            :rules="rules"
          >
            <el-form-item label="账号" prop="username">
              <el-input
                :prefix-icon="User"
                v-model="form.username"
                placeholder="请输入账号（如：手机号）"
              />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input
                type="password"
                :show-password="true"
                :prefix-icon="Lock"
                v-model="form.password"
                placeholder="请输入密码"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="checkCode">
              <div class="verification-box">
                <el-input v-model="form.checkCode" placeholder="验证码" />
                <img
                  class="verification-code"
                  :src="checkCodeData.img"
                  alt=""
                  @click="getCheckCode()"
                />
              </div>
            </el-form-item>
          </el-form>
          <div class="password">
            <el-checkbox v-model="checked" label="记住密码" size="default" />
          </div>
        </div>
        <div class="button" @click="login(formRef)">登录</div>
      </div>
      <div class="main emty" v-if="!emtyShow">
        <el-icon :size="30" class="is-loading">
          <Loading />
        </el-icon>
      </div>
      <div class="tips">版权所有：浙江省水利水电勘测设计院有限责任公司</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, reactive } from "vue";
import { Lock, User } from "@element-plus/icons-vue";
import { useTokenStore } from "@/stores/token";
import { useUserInfoStore } from "@/stores/userInfo";
import { encrypt } from "./Js/crypto";
import APILOGIN from "./Js/login";
import Cookies from "js-cookie";
import { getUe } from "@/utils/getUe";
import { axiosToken } from "@/request/getToken";

const emtyShow = ref(true);
const tokenStore = useTokenStore();
const userStore = useUserInfoStore();
const formRef = ref(null);
const rules = reactive({
  username: [{ required: true, message: "账号错误", trigger: "change" }],
  password: [{ required: true, message: "密码错误", trigger: "change" }],
  checkCode: [{ required: true, message: "验证码错误", trigger: "change" }],
});

const form = ref({
  username: "",
  password: "",
  checkCode: "",
});
const checked = ref(true);
const checkCodeData = ref({});
//获取验证码
const getCheckCode = () => {
  APILOGIN.getCheckCode().then(({ data }) => {
    checkCodeData.value = data || {};
  });
};
getCheckCode();

const login = (formEl) => {
  if (!formEl) return;

  formEl.validate(async (valid, fields) => {
    if (valid) {
      const { username, password, checkCode } = form.value;
      APILOGIN.login({
        username,
        password: encrypt(password),
        captcha: checkCode,
        uuid: checkCodeData.value.uuid,
        checkCaptcha: true,
        refresh: false,
        rememberMe: checked.value,
      })
        .then((res) => {
          handleLoginSuccess(res);
        })
        .catch(({ data }) => {
          getCheckCode();
          const msg = data?.msg;
          if (/验证码+/g.test(msg)) {
            setFieldError("checkCode", "验证码错误");
          } else if (/用户名密码+/g.test(msg)) {
            setFieldError("username", "账号/密码错误");
          }
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 手动设置字段错误状态
const setFieldError = (fieldName, errorMessage) => {
  if (!formRef.value) return;

  formRef.value.validateField(fieldName, (valid) => {
    if (valid) {
      // 如果验证通过，手动设置错误
      const field = formRef.value.fields[fieldName];
      if (field) {
        field.validateMessage = errorMessage;
        field.validateState = "error";
      }
    }
  });
};

const handleLoginSuccess = async (res) => {
  //
  if (checked.value) {
    //存储凭证30天
    Cookies.set("userName", form.value.username, {
      expires: 30,
    });
    Cookies.set("password", form.value.password, {
      expires: 30,
    });
  } else {
    // 删除凭证
    Cookies.remove("userName");
    Cookies.remove("password");
  }

  // 处理成功响应
  if (res.data.token) {
    emtyShow.value = false;
    await axiosToken(); //获取token
    getUe({ type: "loginSuccessful" });
    tokenStore.setToken(res.data.token);
    userStore.setUserInfo(res.data.user);
  }
};

onMounted(() => {
  const userName = Cookies.get("userName") ? Cookies.get("userName") : "";
  const password = Cookies.get("password") ? Cookies.get("password") : "";
  if (userName && password) {
    form.value.username = userName;
    form.value.password = password;
    // 将是否记住密码置为true
    checked.value = true;
  } else {
    form.value.username = "";
    form.value.password = "";
  }
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .emty {
    background-color: #17233d;
    opacity: 0.8;
    z-index: 999999999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left {
    width: 37.5%;
    height: 100%;
    background: url("@/assets/login/left-bg.png") no-repeat;
    background-size: 100% 100%;
  }

  .right {
    width: 62.5%;
    height: 100%;
    background: url("@/assets/login/right-bg.png") no-repeat;
    background-size: 100% 100%;

    .main {
      width: 430px;
      height: 540px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e9eff2;
      box-shadow: 0 10px 50px 0 rgba(198, 217, 236, 0.25);
      border-radius: 12px;
      position: absolute;
      top: 20%;
      right: 20.1%;

      .title {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        color: #17233d;
        letter-spacing: 1px;
        font-weight: 600;
        text-align: center;
        margin: 56px 0;
      }

      .conation {
        width: 335px;
        margin: 0px auto;
        position: relative;

        .label {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #3c3c3c;
          letter-spacing: 0.67px;
          font-weight: 400;

          img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
        }

        :deep(.el-input__wrapper) {
          box-shadow: none !important;
          background-color: transparent !important;
          padding: 0;
          border-bottom: 1px solid #c7cbd5;
          border-radius: 0;
          font-size: 18px;
        }
        :deep(.el-form-item__label) {
          font-size: 18px;
        }

        .password {
          position: absolute;
          right: 0;
        }
      }
      .verification-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .el-input {
          height: 24px;
          width: 170px;
          margin-bottom: 0;
          position: relative;
          :deep(.el-input__wrapper) {
            padding-left: 27px;
          }
          &::before {
            display: block;
            content: "";
            width: 21px;
            height: 21px;
            background: url("../../assets//img//yan.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 0px;
            top: 0px;
          }
        }
        .verification-code {
          width: 130px;
          height: 44px;
        }
      }

      .button {
        width: 354px;
        height: 66px;
        background: url("@/assets/login/button-bg.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0%;
        left: 36px;
        text-align: center;
        font-family: AlibabaPuHuiTi_2_65_Medium;
        font-size: 22px;
        color: #ffffff;
        letter-spacing: 2px;
        font-weight: 500;
        line-height: 47px;
        cursor: pointer;
      }

      .password {
        font-size: 16px;
      }
    }

    .tips {
      position: absolute;
      bottom: 4%;
      right: 21.3%;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #17233d;
      letter-spacing: 0.67px;
      font-weight: 400;
    }
  }
}
</style>
