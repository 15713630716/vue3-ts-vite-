<template>
  <div class="nav">
    <div class="center pointer-events-all">
      <div class="home"></div>
      <div class="nav-two"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>


</script>
<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 102px;
  background: url('../assets/img/home/底部装饰@2x.png') no-repeat;
  background-position-y: 11px;
  background-size: 100%;
  position: fixed;
  bottom: 0;

  .center {
    width: 460px;
    height: 102px;
    background: url('../assets/img/home/底部半圆@2x.png') no-repeat;
    background-size: 100%;
    margin: 0 auto;
  }
}
</style>