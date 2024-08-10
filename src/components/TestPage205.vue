<template>
  <div>
    <img v-for="i in 300" :key="i" :src="`/svg/icon${i}.svg`" alt="icon" />
  </div>
</template>
