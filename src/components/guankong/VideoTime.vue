<template>
    <div class="h-44" ref="wrap">
        <div class="absolute inset-0" ref="container"></div>
    </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { VideoTime } from './video'
import dayjs from 'dayjs'
import { onMounted, ref, watch } from 'vue'

interface IProps {
    // 当前播放的时间
    currentTime?: number
    // 视频时间片段
    timeChunks?: number[][]
    isSpliter?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    currentTime: () => +dayjs().format('x'),
    timeChunks: () => [],
    isSpliter: true
})

const emit = defineEmits(['change', 'selected'])
const container = ref()
const wrap = ref()

let videoTime: any = ref()
onMounted(() => {
    videoTime.value = new VideoTime(container.value)
    videoTime.value?.setCurrentTime(props.currentTime)
    videoTime.value.on('change', ({ index, date, seekValue }: any) => {
        emit('change', {
            index,
            date: Math.round(date),
            seekValue
        })
    })
    videoTime.value.on('selected', (e: any) => {
        emit('selected', e)
    })
})

useResizeObserver(wrap, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    videoTime.value?.resize({ width, height })
})

watch(
    () => props.currentTime,
    () => videoTime.value?.setCurrentTime(props.currentTime)
)
watch(
    () => props.isSpliter,
    () => videoTime.value?.startSureCut(props.isSpliter)
)
watch(
    () => props.timeChunks,
    () => videoTime.value?.drawTimeChunk(props.timeChunks),
    { deep: true }
)

defineExpose({ videoTime })
</script>
<style lang="scss" scoped>
.h-44 {
    height: 44px;
    width: 100%;
    cursor: pointer;
}
</style>
