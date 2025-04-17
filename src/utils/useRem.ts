import { watch, type Ref } from 'vue'

export function useRem(scale: Ref<number>) {
  const setRem = () => {
    const html = document.documentElement
    html.style.fontSize = `${14 * scale.value}px` // 基准14px
  }
  
  watch(scale, setRem, { immediate: true })
}