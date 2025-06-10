<template>
  <div class="container pointer-events-none">
    <FullScreenAdapter :width="1920" :height="1080">
      <router-view />
    </FullScreenAdapter>
  </div>
</template>
<script setup lang="ts">
import FullScreenAdapter from '@/components/FullScreenAdapter.vue'
import { ueStoreJson } from '@/store';

const storeUe = ueStoreJson();
//接收ue传来的值并保存起来
ue.interface.getUeJs = (res: any) => {
  let datas = JSON.parse(res)
  storeUe.setUeStore(datas)
}
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
