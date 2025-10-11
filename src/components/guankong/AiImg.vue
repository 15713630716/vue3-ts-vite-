<template>
  <div class="video-box pointer-events-all" v-if="dialogTableVisible">
    <div class="img-content">
      <el-image-viewer
        v-if="dialogTableVisible"
        :url-list="srcList"
        :initial-index="0"
        teleported
        hide-on-click-modal
        @close="dialogTableVisible = false"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import img1 from "@/assets/guankong/ai/1-1.jpg";
import img2 from "@/assets/guankong/ai/2-2.jpg";
import img3 from "@/assets/guankong/ai/3-3.jpg";

const props = defineProps({
  aiImgShow: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:aiImgShow"]);

const dialogTableVisible = ref(false);
watch(
  () => props.aiImgShow,
  () => {
    if (props.aiImgShow) {
      dialogTableVisible.value = props.aiImgShow;
    }
  }
);
watch(
  () => dialogTableVisible.value,
  () => {
    if (!dialogTableVisible.value) {
      emit("update:aiImgShow", false);
    }
  }
);

const srcList = [img1, img2, img3];
</script>
<style lang="scss" scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.video-box {
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
    border-radius: 32px 0px 32px 0px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 15px;
  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
  }

  .img-content {
    width: 1000px;
    height: 700px;
    object-fit: cover;
  }
}
</style>
