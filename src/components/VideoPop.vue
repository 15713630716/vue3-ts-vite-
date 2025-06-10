<template>
  <div class="video-box pointer-events-all" v-show="dialogTableVisible">
    <el-dialog v-model="dialogTableVisible" :title="mvName" width="1000">
      <video ref="videoPlayers" class="video-content" controls autoplay muted playsinline webkit-playsinline
        x5-video-player-fullscreen="true" x5-playsinline></video>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onUnmounted, nextTick, watch } from 'vue';
import type Hls from 'hls.js';
// import { getMv } from '@/request/home'
import { ueStoreJson } from '@/store';

const storeUe = ueStoreJson();
const props = defineProps({
  mvs: {
    type: Array,
    default: function () {
      return [];
    }
  }
});

const videoPlayers = ref();
const hlsInstance = ref<Hls | null>(null);
const error = ref<string>('');

//mv
// const mvs = ref([] as any)
// const getMvs = async () => {
//   const res1 = await getMv('adcea4b72f8f4de2a3f8c6c42d7bd67e')//施工进场道闸
//   const res2 = await getMv('85186de42f6b40fcade625be8de952d0')//下游临时贝雷桥
//   const res3 = await getMv('bb69dd176f924ac5a8129769a20e159c')//办公区停车场1
//   const res4 = await getMv('b5db6df92aff49bf9956a95d2a6bdf23')//左岸全球机
//   const res5 = await getMv('157ae8e2aef94ffb9d278abe99dcf513')//右岸全球机
//   mvs.value = [
//     {
//       name: '施工进场道闸',
//       url: res1
//     },
//     {
//       name: '下游临时贝雷桥',
//       url: res2
//     },
//     {
//       name: '办公区停车场1',
//       url: res3
//     },
//     {
//       name: '左岸全球机',
//       url: res4
//     },
//     {
//       name: '右岸全球机',
//       url: res5
//     },
//   ]
// }
// onMounted(async () => {
//   await getMvs()
// });

onUnmounted(() => {
  hlsInstance.value?.destroy();
});

const mvName = ref('')
// const data = ref({} as any)
// ue.interface.getUeJs = (res: any) => {
//   data.value = JSON.parse(res)
//   if (data.value.type == 'jiankong') {
//     setTimeout(() => {
//       playVideo(props.mvs[data.value.id - 1])
//     }, 2100);
//   }
// }
watch(
  () => storeUe.ueStore,
  () => {
    if (storeUe.ueStore) {
      if (storeUe.ueStore?.type == 'jiankong') {
        setTimeout(() => {
          playVideo(props.mvs[storeUe.ueStore?.id - 1])
        }, 2100);
      }
    }
  }
);

const playVideo = async (item: any) => {
  mvName.value = item.name
  dialogTableVisible.value = true
  await nextTick(); // 等待对话框开始渲染
  if (!videoPlayers.value) return;
  // 其他浏览器使用 hls.js
  import('hls.js').then(({ default: Hls }) => {
    if (Hls.isSupported()) {
      hlsInstance.value = new Hls({
        enableWorker: false, // 解决部分浏览器 Worker 限制
      });

      hlsInstance.value.loadSource(item.url);
      hlsInstance.value.attachMedia(videoPlayers.value!);

      hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayers.value?.play().catch((e: any) => {
          console.log('自动播放被阻止:', e);
        });
      });

      hlsInstance.value.on(Hls.Events.ERROR, (_, data) => {
        console.log(data);
      });
    } else if (videoPlayers.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoPlayers.value.src = item.url;
      videoPlayers.value.addEventListener('loadedmetadata', () => {
        videoPlayers.value?.play();
      });
    } else {
      error.value = '当前浏览器不支持HLS播放';
    }
  });
}

const dialogTableVisible = ref(false)
</script>
<style lang="scss" scoped>
.video-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :deep(.el-dialog) {
    background: linear-gradient(55deg, rgba(63, 118, 170, 0) 0%, rgba(63, 118, 170, 0.4) 100%), rgba(15, 76, 111, 0.8);
    box-shadow: inset 0px 1px 53px 0px rgba(88, 178, 255, 0.5);
    border-radius: 32px 0px 32px 0px;
    border: 1px solid rgba(166, 219, 249, 0.75);
    padding: 15px;

  }

  :deep(.el-dialog__title) {
    padding-left: 10px;
    color: #fff;
  }

  .video-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>