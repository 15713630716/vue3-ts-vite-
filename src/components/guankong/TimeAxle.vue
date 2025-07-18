<template>
  <div class="time-progress-container">
    <div ref="progressBar" class="progress-bar" @click="handleBarClick" @mousemove="handleMouseMove"
      @mouseleave="hoverTime = null">
      <!-- 刻度线 -->
      <div v-for="hour in 24" :key="hour" class="tick" :style="{ left: `${((hour - 1) / 24) * 100}%` }">
        <span class="tick-label">{{ formatHour(hour - 1) }}</span>
      </div>

      <!-- 进度条背景 -->
      <div class="progress-background"></div>

      <!-- 进度条填充 -->
      <div class="progress-fill" v-for="item in dataTimes"
        :style="{ width: `${(item.valueTime / 86400) * 100}%`, left: `${(item.startTime / 86400) * 100}%` }">
      </div>

      <!-- 滑块 -->
      <div class="slider-thumb" :style="{ left: `${(currentTime / 86400) * 100}%` }" @mousedown="startDrag"></div>

      <!-- 悬浮提示 -->
      <div v-if="hoverTime !== null" class="hover-tooltip" :style="{ left: `${(hoverTime / 86400) * 100}%` }">
        {{ formatTime(hoverTime) }}
      </div>

      <!-- 当前时间提示 -->
      <div class="current-time-tooltip" :style="{ left: `${(currentTime / 86400) * 100}%` }">
        {{ formatTime(currentTime) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  }, // 当前时间（秒数，0-86399）
  dataTimes: {
    type: Array,
    default: function () {
      return [];
    },
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const progressBar = ref<HTMLElement | null>(null)
const currentTime = ref(props.modelValue)
const dataTimes = ref(props.dataTimes as any)
// const startTimePro = ref(props.startTime)
// const valueTimePro = ref(props.valueTime)
const hoverTime = ref<number | null>(null)
const isDragging = ref(false)

// 格式化小时显示 (00:00)
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

// 格式化完整时间 (00:00:00)
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 处理鼠标移动（悬浮效果）
const handleMouseMove = (e: MouseEvent) => {
  if (!progressBar.value || isDragging.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const mousePosition = e.clientX - rect.left
  const percentage = Math.min(1, Math.max(0, mousePosition / rect.width))
  hoverTime.value = Math.round(percentage * 86400)
}

// 处理进度条点击
const handleBarClick = (e: MouseEvent) => {
  if (!progressBar.value || isDragging.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const clickPosition = e.clientX - rect.left
  const percentage = clickPosition / rect.width
  const newTime = Math.min(86399, Math.max(0, Math.round(percentage * 86400)))

  currentTime.value = newTime
  // console.log('当前秒数', newTime);
  emit('update:modelValue', newTime)
}

// 开始拖动
const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 处理拖动
const handleDrag = (e: MouseEvent) => {
  if (!progressBar.value || !isDragging.value) return

  const rect = progressBar.value.getBoundingClientRect()
  let dragPosition = e.clientX - rect.left
  dragPosition = Math.max(0, Math.min(rect.width, dragPosition))
  const percentage = dragPosition / rect.width
  const newTime = Math.round(percentage * 86400)

  currentTime.value = newTime
  emit('update:modelValue', newTime)
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  if (!isDragging.value) {
    currentTime.value = newVal
  }
})
// 监听props变化
watch(() => props.dataTimes, () => {
  dataTimes.value = props.dataTimes
}, { immediate: true })

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.time-progress-container {
  width: 100%;
  padding: 37px 25px;
  position: relative;
  opacity: 0.9;
}

.progress-bar {
  position: relative;
  height: 37px;
  cursor: pointer;
}

.tick {
  position: absolute;
  top: 0px;
  width: 1px;
  height: 10px;
  background-color: #f3f3f3;
  transform: translateX(-50%);
  z-index: 9999;
}

.tick-label {
  position: absolute;
  top: 12px;
  left: 50%;
  font-size: 12px;
  color: #f3f3f3;
  pointer-events: none;
}

.progress-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(4, 80, 120, 0.40);
  border: 1px solid rgba(108, 204, 255, 0.47);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #f6975c;
}

.slider-thumb {
  position: absolute;
  top: -5px;
  width: 10px;
  height: 16px;
  background-color: #fff;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  transform: translateX(-50%);
  cursor: grab;
  z-index: 2;
}

.slider-thumb:active {
  cursor: grabbing;
}

/* 悬浮提示样式 */
.hover-tooltip {
  position: absolute;
  top: -30px;
  left: 0;
  transform: translateX(-50%);
  background: rgba(4, 80, 120, 0.40);
  border: 1px solid rgba(108, 204, 255, 0.47);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}

/* 当前时间提示样式 */
.current-time-tooltip {
  position: absolute;
  top: -30px;
  left: 0;
  transform: translateX(-50%);
  background-color: #4a90e2;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
</style>