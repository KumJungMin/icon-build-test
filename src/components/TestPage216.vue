<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const components: { name: string; component: any }[] = [];

// Dynamically import all .vue files in the ./components directory
const modules = import.meta.glob("./icons/SvgIcon*.vue");

for (const path in modules) {
  const nameMatch = path.match(/\/SvgIcon(\d+)\.vue$/);
  if (nameMatch) {
    const name = `SvgIcon${nameMatch[1]}`;
    components.push({
      name,
      component: defineAsyncComponent(modules[path] as any),
    });
  }
}
</script>

<template>
  <div>
    <component
      v-for="{ name, component } in components"
      :key="name"
      :is="component"
    />
  </div>
</template>
