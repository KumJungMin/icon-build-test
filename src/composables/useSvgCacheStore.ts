import { ref, computed, ComputedRef } from "vue";

export interface SvgCacheStore {
  loadSvg: (src: string) => Promise<string>;
  removeSvg: (src: string) => void;
  getSvgUsageCount: (src: string) => number;
  svgCache: ComputedRef<Record<string, string>>;
}

// 캐시스토어와 카운팅을 관리하는 컴포저블
export function useSvgCacheStore(): SvgCacheStore {
  const svgCache = ref<Record<string, string>>({});
  const iconUsageCount = ref<Record<string, number>>({});
  const cacheTimeouts = ref<Record<string, NodeJS.Timeout>>({});

  const CACHE_TIMEOUT = 300000; // 5분 (300,000ms)

  const loadSvg = async (src: string): Promise<string> => {
    if (svgCache.value[src]) {
      iconUsageCount.value[src] += 1;
      resetCacheTimer(src); // 기존 타이머 리셋
      return svgCache.value[src];
    } else {
      try {
        const response = await fetch(src);
        const svgText = await response.text();

        svgCache.value[src] = svgText;
        iconUsageCount.value[src] = 1;
        setCacheTimer(src); // 새 타이머 설정
        return svgText;
      } catch (error) {
        console.error("Error loading SVG:", error);
        throw error;
      }
    }
  };

  const removeSvg = (src: string) => {
    if (iconUsageCount.value[src]) {
      iconUsageCount.value[src] -= 1;
      if (iconUsageCount.value[src] === 0) {
        setCacheTimer(src); // 타이머를 설정하여 일정 시간이 지나면 캐시에서 제거
      }
    }
  };

  const setCacheTimer = (src: string) => {
    if (cacheTimeouts.value[src]) {
      clearTimeout(cacheTimeouts.value[src]);
    }
    cacheTimeouts.value[src] = setTimeout(() => {
      delete svgCache.value[src];
      delete iconUsageCount.value[src];
      delete cacheTimeouts.value[src];
      console.log(`SVG ${src} removed from cache after timeout.`);
    }, CACHE_TIMEOUT);
  };

  const resetCacheTimer = (src: string) => {
    if (cacheTimeouts.value[src]) {
      clearTimeout(cacheTimeouts.value[src]);
    }
    setCacheTimer(src);
  };

  const getSvgUsageCount = (src: string) => {
    return iconUsageCount.value[src] || 0;
  };

  return {
    loadSvg,
    removeSvg,
    getSvgUsageCount,
    svgCache: computed(() => svgCache.value),
  };
}
