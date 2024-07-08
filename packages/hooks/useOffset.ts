import { type Ref, computed } from "vue";

interface useOffsetOptions {
  // id: string;
  offset: number;
  boxHeight: Ref<number>;
  getLastBottomOffset: () => number;
}

interface useOffsetResult {
  topOffset: Ref<number>;
  bottomOffset: Ref<number>;
}

export function useOffset(opts: useOffsetOptions): useOffsetResult {
  // 上一个实例最下面的坐标，第一个是0
  const lastBottomOffset = computed(() => opts.getLastBottomOffset());
  // 本元素应该的 top
  const topOffset = computed(() => opts.offset + lastBottomOffset.value);
  // 为下一个实例预留的底部 offset
  const bottomOffset = computed(() => topOffset.value + opts.boxHeight.value);

  return {
    topOffset,
    bottomOffset,
  };
}

export default useOffset;
