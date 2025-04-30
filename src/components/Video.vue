<template>
  <div class="video-box">
    <video ref="videoPlayer" class="video-content" controls autoplay muted playsinline webkit-playsinline
      x5-video-player-fullscreen="true" x5-playsinline></video>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type Hls from 'hls.js';

const props = defineProps({
  src: {
    type: String,
    default: ''
  }
});

const videoPlayer = ref<HTMLVideoElement | null>(null);
const hlsInstance = ref<Hls | null>(null);
const error = ref<string>('');

onMounted(() => {
  if (!videoPlayer.value) return;

  // // 处理 Safari 原生支持
  // if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
  //   videoPlayer.value.src = props.src;
  //   return;
  // }

  // 其他浏览器使用 hls.js
  import('hls.js').then(({ default: Hls }) => {
    if (Hls.isSupported()) {
      hlsInstance.value = new Hls({
        enableWorker: false, // 解决部分浏览器 Worker 限制
      });

      hlsInstance.value.loadSource(props.src);
      hlsInstance.value.attachMedia(videoPlayer.value!);

      hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayer.value?.play().catch((e) => {
          console.log('自动播放被阻止:', e);
        });
      });

      hlsInstance.value.on(Hls.Events.ERROR, (_, data) => {
        console.log(data);
      });
    } else if (videoPlayer.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoPlayer.value.src = props.src;
      videoPlayer.value.addEventListener('loadedmetadata', () => {
        videoPlayer.value?.play();
      });
    } else {
      error.value = '当前浏览器不支持HLS播放';
    }
  });
});

onUnmounted(() => {
  hlsInstance.value?.destroy();
});

</script>
<style lang="scss" scoped>
.video-box {
  width: 100%;
  height: 100%;

  .video-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>