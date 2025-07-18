<template>
  <div class="login">
    <div class="left"></div>
    <div class="right">
      <div class="main pointer-events-all">
        <div class="title">用户登录</div>
        <div class="conation">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" size="large">
            <el-form-item label="" prop="user">
              <div class="label"><img src="../../assets/login/user.png" alt="">用户名</div>
              <el-input size="large" placeholder="请输入账号" v-model="ruleForm.user" />
            </el-form-item>
            <el-form-item label="" prop="password">
              <div class="label"><img src="../../assets/login/pass.png" alt="">密码</div>
              <el-input size="large" type="password" placeholder="请输入密码" v-model="ruleForm.password"
                :show-password="true" />
            </el-form-item>
          </el-form>
          <div class="password">
            <el-checkbox v-model="isRemenber" label="记住密码" size="default" />
          </div>
        </div>
        <div class="button" @click="login(ruleFormRef)">登录</div>
      </div>
      <div class="tips">版权所有：浙江省水利水电勘测设计院有限责任公司</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getUe } from '@/utils/getUe';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { axiosToken } from '@/request/getToken'



const ruleFormRef = ref();
const ruleForm = reactive({
  user: '',
  password: ''
});
const isRemenber = ref()//是否记住密码
const rules = reactive({
  user: [{ required: true, message: '账号不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
});

const router = useRouter();
const login = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      if (ruleForm.user == 'admin' && ruleForm.password == 'Zdwp@123') {
        axiosToken()//获取token
        // 登录成功后 判断是否选择了勾选密码
        if (isRemenber.value) {
          //存储凭证30天
          Cookies.set('userName', 'pingzheng', {
            expires: 30
          })
        } else {
          // 删除凭证
          Cookies.remove('userName')
        }
        router.push({ path: '/index' });
        getUe({ type: 'loginSuccessful' })
      } else {
        ElMessage.warning({ message: '账号或密码错，请重试', duration: 1500 });
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

onMounted(() => {
  const userName = Cookies.get('userName') ? Cookies.get('userName') : '';
  if (userName == 'pingzheng') {
    ruleForm.user = 'admin'
    ruleForm.password = 'Zdwp@123'
    // 将是否记住密码置为true
    isRemenber.value = true;
  } else {
    ruleForm.user = ''
    ruleForm.password = '';
  }
})

</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .left {
    width: 37.5%;
    height: 100%;
    background: url('@/assets/login/left-bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .right {
    width: 62.5%;
    height: 100%;
    background: url('@/assets/login/right-bg.png') no-repeat;
    background-size: 100% 100%;

    .main {
      width: 430px;
      height: 540px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E9EFF2;
      box-shadow: 0 10px 50px 0 rgba(198, 217, 236, 0.25);
      border-radius: 12px;
      position: absolute;
      top: 23%;
      right: 20.1%;

      .title {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        color: #17233D;
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
          color: #3C3C3C;
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
          border-bottom: 1px solid #C7CBD5;
          border-radius: 0;
          font-size: 16px;
        }

        .password {
          position: absolute;
          right: 0;
        }
      }

      .button {
        width: 354px;
        height: 66px;
        background: url('@/assets/login/button-bg.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 4%;
        left: 36px;
        text-align: center;
        font-family: AlibabaPuHuiTi_2_65_Medium;
        font-size: 22px;
        color: #FFFFFF;
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
      color: #17233D;
      letter-spacing: 0.67px;
      font-weight: 400;
    }
  }
}
</style>