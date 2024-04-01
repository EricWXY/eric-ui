import { computed, ref } from 'vue'

export default function useZIndex (initialValue = 2000) {
  const zIndex = ref(0)
  const _initialValue = ref(initialValue)
  const currentZindex = computed(() => zIndex.value + _initialValue.value)

  const nextZIndex = () => {
    zIndex.value++
    return currentZindex.value
  }

  return {
    initialValue: _initialValue,
    currentZindex,
    nextZIndex
  }
}
