<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const components: { name: string; component: any }[] = [];

// Dynamically import all .vue files in the ./components directory
const modules = import.meta.glob("./components/TestPage*.vue");

for (const path in modules) {
  const nameMatch = path.match(/\/TestPage(\d+)\.vue$/);
  if (nameMatch) {
    const name = `TestPage${nameMatch[1]}`;
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
