<template>
  <div 
    class="full-screen-adapter" 
    ref="screenRef"
    :style="{
      '--scalew': scaleW,
      '--scaleh': scaleH,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useFullScreenAdapt } from '@/hooks/useFullScreenAdapt'

interface Props {
  width?: number
  height?: number
  autoScale?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 1920,
  height: 1080,
  autoScale: true
})

const { screenRef, scaleW,scaleH } = useFullScreenAdapt({
  designWidth: props.width,
  designHeight: props.height,
  autoScale: props.autoScale
})

defineExpose({
  scaleW,scaleH
})
</script>

<style scoped lang="scss">
.full-screen-adapter {
  position: absolute;
  left: 0px;
  top: 0px;
  transform: scale(var(--scalew,--scalew ));
  transform-origin: 0 0;
  width: v-bind('props.width + "px"');
  height: v-bind('props.height + "px"');
  // transition: transform 0.3s ease;
  // will-change: transform;
  overflow: hidden;
}
</style>