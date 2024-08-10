<template>
  <svg
    :class="svgClassName"
    :style="svgStyle"
    :width="svgSize"
    :height="svgSize"
    v-html="svgContent"
  />
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  name: "Icon",
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 20,
    },
    color: {
      type: String,
      default: "black",
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { name, size, color, style, className } = props;
    const svgContent = ref("");

    const DEFAULT_ICON_CONFIGS = {
      size: 20,
      color: "black",
      prefix: "i",
    };

    const svgStyle = computed(() => ({
      color: color || DEFAULT_ICON_CONFIGS.color,
      ...style,
    }));

    const svgSize = computed(() => size || DEFAULT_ICON_CONFIGS.size);

    const svgClassName = computed(() =>
      [
        className,
        `${DEFAULT_ICON_CONFIGS.prefix}-icon`,
        `${DEFAULT_ICON_CONFIGS.prefix}-icon-${name}`,
      ].join(" ")
    );

    const fetchSvgContent = async () => {
      const svgPath = `/svgs/${name}.svg`;
      const response = await fetch(svgPath);
      svgContent.value = await response.text();
    };

    onMounted(() => {
      fetchSvgContent();
    });

    return {
      svgClassName,
      svgStyle,
      svgSize,
      rest: { ...props },
      svgContent,
    };
  },
};
</script>
