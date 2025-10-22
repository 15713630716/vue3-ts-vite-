<template>
  <div
    ref="containerRef"
    class="drag-zoom-image"
    @wheel="handleWheel"
    @mousedown="startDrag"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <div class="image-wrapper" :style="transformStyle">
      <img
        ref="imageRef"
        :src="src"
        :alt="alt"
        @load="handleLoad"
        @error="handleError"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">加载中...</div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state">加载失败</div>

    <!-- 拖拽提示 -->
    <!-- <div v-if="showDragHint && scale > 1" class="drag-hint">可拖拽移动</div> -->
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from "vue";

// Props
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "图片",
  },
  minScale: {
    type: Number,
    default: 0.1,
  },
  maxScale: {
    type: Number,
    default: 5,
  },
  scaleStep: {
    type: Number,
    default: 0.1,
  },
  initialScale: {
    type: Number,
    default: 1,
  },
  showDragHint: {
    type: Boolean,
    default: true,
  },
  enableDrag: {
    type: Boolean,
    default: true,
  },
});

// Refs
const containerRef = ref();
const imageRef = ref();
const scale = ref(4); //放大的初始大小
const translateX = ref(-20); //初始位置x
const translateY = ref(-150); //初始位置y
const loading = ref(true);
const error = ref(false);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

// 计算属性
const transformStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: "center center",
  cursor: getCursorStyle(),
}));

// 获取光标样式
const getCursorStyle = () => {
  if (isDragging.value) return "grabbing";
  if (scale.value > 1 && props.enableDrag) return "grab";
  return "default";
};

// 处理滚轮事件 - 始终以中心点缩放
const handleWheel = (event) => {
  event.preventDefault();

  // 计算新的缩放比例
  const delta = -Math.sign(event.deltaY) * props.scaleStep;
  const newScale = Math.max(
    props.minScale,
    Math.min(props.maxScale, scale.value + delta)
  );

  // 如果缩放比例改变，重置位置到中心
  if (newScale !== scale.value) {
    scale.value = newScale;
    // 缩放时重置位置到中心点
    translateX.value = 0;
    translateY.value = 0;
  }
};

// 开始拖拽
const startDrag = (event) => {
  if (!props.enableDrag || scale.value <= 1) return;

  isDragging.value = true;
  dragStart.value = {
    x: event.clientX - translateX.value,
    y: event.clientY - translateY.value,
  };

  // 添加全局事件监听
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 处理拖拽
const handleDrag = (event) => {
  if (!isDragging.value) return;

  translateX.value = event.clientX - dragStart.value.x;
  translateY.value = event.clientY - dragStart.value.y;
};

// 停止拖拽
const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
  }

  // 移除全局事件监听
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// 图片加载完成
const handleLoad = () => {
  loading.value = false;
  error.value = false;
};

// 图片加载失败
const handleError = () => {
  loading.value = false;
  error.value = true;
};

// 重置缩放和位置
const resetZoom = () => {
  scale.value = props.initialScale;
  translateX.value = 0;
  translateY.value = 0;
};

// 设置缩放比例
const setScale = (newScale) => {
  const validatedScale = Math.max(
    props.minScale,
    Math.min(props.maxScale, newScale)
  );
  scale.value = validatedScale;
  // 设置缩放时重置位置到中心
  translateX.value = 0;
  translateY.value = 0;
};

// 设置位置
const setPosition = (x, y) => {
  translateX.value = x;
  translateY.value = y;
};

// 获取当前状态
const getState = () => ({
  scale: scale.value,
  position: { x: translateX.value, y: translateY.value },
  isDragging: isDragging.value,
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  stopDrag();
});

// 暴露方法给父组件
defineExpose({
  resetZoom,
  setScale,
  setPosition,
  getScale: () => scale.value,
  getPosition: () => ({ x: translateX.value, y: translateY.value }),
  getState,
});
</script>

<style scoped>
.drag-zoom-image {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f5f7fa;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease-out;
  max-width: 100%;
  max-height: 100%;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  user-select: none;
  -webkit-user-drag: none;
  display: block;
  object-fit: contain;
}

.loading-state,
.error-state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  color: #606266;
  font-size: 14px;
}

.drag-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.drag-hint:hover {
  opacity: 1;
}
</style>
