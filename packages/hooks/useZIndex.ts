import { computed, ref } from "vue";

const zIndex = ref(0);
export default function useZIndex(initialValue = 2000) {
  const _initialValue = ref(initialValue);
  const currentZindex = computed(() => zIndex.value + _initialValue.value);

  const nextZIndex = () => {
    zIndex.value++;
    return currentZindex.value;
  };

  return {
    initialValue: _initialValue,
    currentZindex,
    nextZIndex,
  };
}
