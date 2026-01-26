<template>
  <div class="pop-box pointer-events-all">
    <el-dialog v-model="popShow" title="规则库" width="1100" top="80px">
      <div class="content">
        <el-scrollbar height="770px">
          <ImageView :src="tuzhi"></ImageView>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import ImageView from "./ImageView.vue";
import tuzhi from "../../assets/temperature/guizeku.jpg";

const emit = defineEmits(["update:value"]);
const popShow = ref(true);
watch(
  () => popShow.value,
  () => {
    if (!popShow.value) {
      emit("update:value", false);
    }
  }
);
</script>
<style lang="scss" scoped>
.pop-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :deep(.el-dialog) {
    background: linear-gradient(
        55deg,
        rgba(63, 118, 170, 0) 0%,
        rgba(63, 118, 170, 0.4) 100%
      ),
      rgba(15, 76, 111, 0.8);
    box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
    border-radius: 0px 32px 0px 32px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 15px;
  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
    display: block;
    width: 100%;
    height: 35px;
    line-height: 35px;
    background: linear-gradient(270deg, rgba(34, 102, 135, 0) 0%, #13a4eb 100%);
    padding-left: 10px;
    color: #fff;
  }
  :deep(.el-dialog__close) {
    color: #fff;
    font-size: 20px;
    margin-top: 14px;
  }

  .content {
    width: 100%;
    height: 750px;
    object-fit: cover;
    padding: 0 10px;
  }
}
</style>
