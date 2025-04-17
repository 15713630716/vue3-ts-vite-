<template>
  <div class="container">
    <FullScreenAdapter :width="1920" :height="1080">
      <router-view />
    </FullScreenAdapter>
  </div>
</template>
<script setup lang="ts">
import FullScreenAdapter from '@/components/FullScreenAdapter.vue'


</script>
<style scoped lang="scss">
.container{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

</style>
