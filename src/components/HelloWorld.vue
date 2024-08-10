<template>
  <div>
    <img v-for="i in 300" :key="i" :src="`/svg/icon${i}.svg`" alt="icon" />
  </div>
</template>

<script setup>
const getImageUrl = (i) => {
  console.log(import.meta);
  return new URL(`/svg/icon${i}.svg`, "http://localhost:5173").href;
};
</script>
