<template>
  <div class="pop-box pointer-events-all">
    <el-dialog v-model="popShow" title="案例分析" width="1500" top="80px">
      <div class="content">
        <!-- <iframe :src="pdfUrl" frameborder="0"></iframe> -->
        <img
          style="width: 100%; height: 100%"
          src="../../assets/temperature/pdf.png"
          alt=""
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

// 方法1：直接使用 import
const pdfUrl = ref("" as any);

onMounted(async () => {
  // try {
  //   // 使用 import.meta.glob 动态导入
  //   const pdfModule = await import("../../assets/temperature/pdf.pdf");
  //   pdfUrl.value = pdfModule.default || pdfModule;
  // } catch (error) {
  //   console.error("PDF加载失败:", error);
  // }
});

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
  }

  :deep(.el-dialog__title) {
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
    height: 815px;
    object-fit: cover;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
