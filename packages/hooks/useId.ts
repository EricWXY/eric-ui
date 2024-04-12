import { type Ref, computed } from "vue";

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
};
const namespace = "er";

export function useId(): Ref<string> {
  const idRef = computed(
    () =>
      `${namespace}-id-${
        defaultIdInjection.prefix
      }-${defaultIdInjection.current++}`
  );

  return idRef;
}

export default useId;
