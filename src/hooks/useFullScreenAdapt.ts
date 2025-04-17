import { ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash-es'

interface Options {
  designWidth: number
  designHeight: number
  autoScale?: boolean
}

export function useFullScreenAdapt(options: Options) {
  const { designWidth, designHeight, autoScale = true } = options
  const screenRef = ref<HTMLElement | null>(null)
  
  // 计算缩放比例
  const scaleW = ref<number>(1);
  const scaleH = ref<number>(1);
  const getScale = () => {
    if (!screenRef.value) return {widthRatio:1,heightRatio:1};
    
    const parent = screenRef.value.parentElement || document.documentElement
    const clientWidth = parent.clientWidth
    const clientHeight = parent.clientHeight
    console.log(clientWidth,clientHeight);
    
    // 计算宽度和高度的缩放比例
    const widthRatio = (Math.floor((clientWidth / designWidth)*1000000)/1000000)
    const heightRatio = (Math.floor((clientHeight / designHeight)*1000000)/1000000)
    // 选择能完全填满屏幕的缩放比例
    return {widthRatio, heightRatio};
  }
  
  // 更新样式
  const updateStyle = debounce(() => {
    scaleW.value = getScale().widthRatio
    scaleH.value = getScale().heightRatio
    if (!screenRef.value) return;
    
    const scaw = scaleW.value
    const scah = scaleH.value
    screenRef.value.style.transform = `scale(${scaw},${scah})`
    screenRef.value.style.width = `${designWidth}px`
    screenRef.value.style.height = `${designHeight}px`
    screenRef.value.style.left = '0'
    screenRef.value.style.top = '0'
    screenRef.value.style.transformOrigin = '0 0'
    // updateFontSize()
  },200)
  //控制字体
  // const updateFontSize = () => {
  //   const size = Math.max(scaleW.value,scaleH.value)
  //   document.documentElement.style.fontSize = `${14 * size}px`
  // }
  // 初始化适配
  const initAdapt = () => {
    updateStyle()
    if (autoScale) {
      window.addEventListener('resize', updateStyle)
    }
  }
  
  onMounted(() => {
    initAdapt()
  })
  
  onBeforeUnmount(() => {
    if (autoScale) {
      window.removeEventListener('resize', updateStyle)
    }
  })
  
  return {
    screenRef,
    scaleH,scaleW
  }
}