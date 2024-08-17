<template>
  <div
    ref="svgContainer"
    :style="{ cursor: 'pointer', display: 'inline-block' }"
  ></div>
</template>

<script setup lang="ts">
import type { SvgCacheStore } from "../../composables/useSvgCacheStore";
import { ref, onMounted, onUnmounted, inject, watch } from "vue";

// 컴포넌트의 props 정의
const props = defineProps<{
  name?: string;
  src: string;
  width?: string;
  height?: string;
  color?: string[] | string;
  hoverColor?: string[] | string;
  strokeWidth?: string;
}>();

// SVG 캐시 스토어를 인젝션
const svgCacheStore = inject<SvgCacheStore>("svgCacheStore");

if (!svgCacheStore) {
  throw new Error("SVG Cache Store is not provided!");
}

const svgContainer = ref<HTMLElement | null>(null);
let svgElement: SVGElement | null = null;
let observer: IntersectionObserver | null = null;

// 색상에 따른 클래스명을 저장할 Map과 카운터
const colorClassMap = new Map<string, string>();
let colorClassCounter = 1;

const getColor = (index: number, defaultColor: string) => {
  return Array.isArray(props.color)
    ? props.color[index] || defaultColor
    : props.color || defaultColor;
};

const getHoverColor = (index: number, defaultColor: string) => {
  return Array.isArray(props.hoverColor)
    ? props.hoverColor[index] || getColor(index, defaultColor)
    : props.hoverColor || getColor(index, defaultColor);
};

const loadAndInsertSvg = async () => {
  const svgContent = await svgCacheStore.loadSvg(props.src);
  insertSvgIntoDom(svgContent);
};

const insertSvgIntoDom = (svgText: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  svgElement = doc.querySelector("svg");

  if (svgElement) {
    updateSvgAttributes();

    if (svgContainer.value) {
      svgContainer.value.innerHTML = ""; // 기존 SVG 제거
      svgContainer.value.appendChild(svgElement); // 새로운 SVG 삽입
    }
  }
};

const updateSvgAttributes = () => {
  if (svgElement) {
    const iconName = props.name || props.src.replace(/\.svg$/, "");
    const iconClassName = `i-${iconName}`;

    svgElement.setAttribute("width", props.width || "24");
    svgElement.setAttribute("height", props.height || "24");
    svgElement.style.display = "block";
    svgElement.classList.add(iconClassName);

    const paths = svgElement.querySelectorAll("[stroke], [fill]");
    addSvgPathClass(paths); // 색상에 따른 클래스명 지정

    let styleElement = svgElement.querySelector("style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      svgElement.insertBefore(styleElement, svgElement.firstChild);
    }

    // 색상에 따른 스타일 동적으로 생성
    const styleContent = Array.from(colorClassMap.entries())
      .map(
        ([_, className], index) => `
        svg.${iconClassName} .${className} { 
          stroke: ${
            index < props.color?.length!
              ? getColor(index, "currentColor")
              : "none"
          }; 
          fill: ${
            index < props.color?.length!
              ? getColor(index, "currentColor")
              : "none"
          }; 
        }
        svg.${iconClassName}:hover .${className} { 
          stroke: ${
            index < props.hoverColor?.length!
              ? getHoverColor(index, "currentColor")
              : getColor(index, "currentColor")
          }; 
          fill: ${
            index < props.hoverColor?.length!
              ? getHoverColor(index, "currentColor")
              : getColor(index, "currentColor")
          }; 
        }
      `
      )
      .join("\n");

    styleElement.textContent = styleContent;
  }
};

const addSvgPathClass = (paths: NodeListOf<Element>) => {
  paths.forEach((path) => {
    if (path.hasAttribute("stroke") && path.getAttribute("stroke") !== "none") {
      const strokeColor = path.getAttribute("stroke");
      applyColorClass(path, strokeColor);
    }

    if (path.hasAttribute("fill") && path.getAttribute("fill") !== "none") {
      const fillColor = path.getAttribute("fill");
      applyColorClass(path, fillColor);
    }
  });
};

const applyColorClass = (path: Element, color: string | null) => {
  if (color) {
    if (!colorClassMap.has(color)) {
      const className = `svg-color-${colorClassCounter++}`;
      colorClassMap.set(color, className);
    }
    const className = colorClassMap.get(color);
    path.classList.add(className!);
  }
};

// IntersectionObserver를 사용하여 Lazy Loading 구현
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      loadAndInsertSvg();
      observer?.disconnect(); // 한 번 로드한 후에는 더 이상 관찰하지 않음
    }
  });

  if (svgContainer.value) {
    observer.observe(svgContainer.value);
  }
});

onUnmounted(() => {
  svgCacheStore.removeSvg(props.src);
  observer?.disconnect();
});

// props 변화 감지 및 SVG 속성 업데이트
watch(
  () => [props.width, props.height, props.color, props.strokeWidth],
  () => {
    updateSvgAttributes();
  },
  { immediate: true, flush: "post" }
);
</script>
