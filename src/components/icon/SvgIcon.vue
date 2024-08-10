<template>
  <div v-if="props.name">
    <GenIcon2
      v-if="Array.isArray(props.color) || Array.isArray(props.hoverColor)"
      :name="props.name"
      :src="`${BASE_PATH}${props.name}.svg`"
      :width="props.width"
      :height="props.height"
      :color="props.color"
      :hover-color="props.hoverColor"
      :stroke-width="props.strokeWidth"
    />
    <GenIcon
      v-else
      :name="props.name"
      :src="`${BASE_PATH}${props.name}.svg`"
      :width="props.width"
      :height="props.height"
      :color="props.color"
      :hover-color="props.hoverColor"
      :stroke-width="props.strokeWidth"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import GenIcon from "./GenIcon.vue";
import GenIcon2 from "./GenIcon2.vue";

const BASE_PATH = "/svg/";

type ColorType = string[] | string;

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  color: {
    type: Array as PropType<ColorType>,
  },
  hoverColor: {
    type: Array as PropType<ColorType>,
  },
  strokeWidth: {
    type: String,
  },
});
</script>
