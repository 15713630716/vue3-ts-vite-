<template>
  <div class="login">
    <div class="left">
      <div class="content">
        <div class="title-l">
          <div class="text">数字孪生</div>
          <div class="logo"></div>
        </div>
        <div class="title-c"></div>
        <div class="title-r">
          <div class="text">让万物互联</div>
          <div class="text">让未来可见</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">北岙水库数字孪生应用</div>
      <div class="main  pointer-events-all">
        <div class="user">用户登录</div>
        <div class="conation">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" size="large">
            <el-form-item label="" prop="user">
              <el-input size="large" placeholder="账号" v-model="ruleForm.user" :prefix-icon="User" />
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input size="large" type="password" placeholder="密码" v-model="ruleForm.password" show-password
                :prefix-icon="Lock" />
            </el-form-item>
          </el-form>
        </div>
        <div class="password">
          <el-checkbox v-model="isRemenber" label="记住密码" size="large" />
        </div>
        <el-button type="primary" size="large" @click="login(ruleFormRef)"
          class="button pointer-events-all">登录</el-button>
      </div>
      <div class="tips">版权所有：浙江省水利水电勘测设计院有限责任公司</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';


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
const login = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (ruleForm.user == 'admin' && ruleForm.password == '123456') {
        router.push({ path: '/index' });
      } else {
        ElMessage.warning({ message: '账号或密码错，请重试', duration: 1500 });
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

onMounted(() => {

})




</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: url('@/assets/bg.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;

  .left {
    width: 65.5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .content {
      width: 663px;
      height: 250px;
      display: flex;

      .title-l {
        width: 50%;
        height: 130px;
        padding: 1px 30px;

        .text {
          font-family: AlibabaPuHuiTi_2_85_Bold;
          font-size: 59px;
          color: #FFFFFF;
          letter-spacing: 8px;
          text-align: center;
        }

        .logo {
          width: 100%;
          height: 65px;
          background: url('@/assets/biaoyu.png') no-repeat;
          background-position: center;
          background-size: 230% 100%;
          background-position-x: -10px;
        }
      }

      .title-c {
        height: 120px;
        width: 1px;
        margin-top: 10px;
        background-color: rgba(255, 255, 255, 0.31);
      }

      .title-r {
        width: 50%;
        height: 130px;
        padding: 1px 30px;

        .text {
          font-family: AlibabaPuHuiTi_2_45_Light;
          font-size: 46px;
          color: #D7E9F9;
          letter-spacing: 8px;
          text-align: center;
          font-style: normal;
          font-weight: 200;
          margin-bottom: 13px;
        }
      }
    }
  }

  .right {
    width: 34.5%;
    height: 100%;
    background: url('@/assets/bg_l.png') no-repeat;
    background-position: center;
    background-size: 100% 100%;
    position: relative;

    .title {
      width: 75%;
      height: 6%;
      max-width: 550px;
      // background: url('@/assets/title.png') no-repeat;
      // background-position: center;
      // background-size: 100% 100%;
      margin: 17% auto 13%;
      font-size: 42px;
      font-weight: 600;
      color: #24324c;
      text-align: center;
      letter-spacing: 5px;

    }

    .main {
      width: 55%;
      max-width: 360px;
      margin: 25% auto 0px;

      .user {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #17233D;
        line-height: 63px;
        letter-spacing: 1px;
        text-align: left;
        font-style: normal;
      }

      .password {
        padding-left: 3px;
      }

      .button {
        width: 100%;
        margin-top: 50px;
      }
    }

    .tips {
      position: absolute;
      bottom: 36px;
      width: 100%;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #17233D;
      line-height: 22px;
      text-align: center;
    }
  }
}

:deep(.el-button) {
  background-color: #006BC9;
}
</style>
