<template>
  <div>
    <Icon v-for="i in 300" :key="i" :name="`icon${i}`" />
  </div>
</template>

<script setup lang="ts">
import Icon from "./icon/SvgIcon.vue";
</script>
