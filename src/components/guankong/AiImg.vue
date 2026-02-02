<template>
  <div class="video-box pointer-events-all" v-if="dialogTableVisible">
      <el-image-viewer
        v-if="dialogTableVisible"
        :url-list="srcList"
        :initial-index="0"
        teleported
        hide-on-click-modal
        @close="dialogTableVisible = false"
      />
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
}
</style>
