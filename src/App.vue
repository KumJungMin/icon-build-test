<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { provide } from "vue";
import { useSvgCacheStore } from "./composables/useSvgCacheStore";

const svgCacheStore = useSvgCacheStore();

provide("svgCacheStore", svgCacheStore);

const components = [] as {
  name: string;
  component: ReturnType<typeof defineAsyncComponent>;
}[];

const modules = import.meta.glob("./components/TestPage1.vue");

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
