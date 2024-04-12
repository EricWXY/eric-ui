import {
  shallowRef,
  unref,
  ref,
  computed,
  type Ref,
  watch,
  onBeforeUnmount,
} from "vue";
import { fromPairs, keys, map } from "lodash-es";
import { createPopper } from "@popperjs/core";
import type {
  Instance,
  Modifier,
  Options,
  State,
  VirtualElement,
} from "@popperjs/core";

type ElementType = HTMLElement | void;
type ReferenceElement = ElementType | VirtualElement;

type PartialOptions = Partial<Options>;

export function usePopper(
  referenceElementRef: Ref<ReferenceElement>,
  popperElementRef: Ref<ElementType>,
  opts: Ref<PartialOptions> | PartialOptions = {} as PartialOptions
) {
  const options = computed<Options>(() => {
    const { onFirstUpdate, placement, strategy, modifiers } = unref(opts);

    return {
      onFirstUpdate,
      placement: placement ?? "bottom",
      strategy: strategy ?? "absolute",
      modifiers: [
        ...(modifiers ?? []),
        stateUpdater,
        { name: "applyStyles", enabled: true },
      ],
    };
  });
  const instanceRef = shallowRef<Instance>();
  const states = ref<Pick<State, "styles" | "attributes">>({
    styles: {
      popper: {
        position: unref(options).strategy,
        left: "0",
        top: "0",
      },
      arrow: {
        position: "absolute",
      },
    },
    attributes: {},
  });

  const stateUpdater = {
    name: "updateState",
    enabled: true,
    phase: "write",
    fn: ({ state }) => {
      const derivedState = deriveState(state);
      Object.assign(states.value, derivedState);
    },
    requires: ["computeStyles"],
  } as Modifier<"updateState", any>;

  const destroy = () => {
    if (!instanceRef.value) return;
    instanceRef.value.destroy();
    instanceRef.value = void 0;
  };

  watch(
    options,
    (newOpts) => {
      const instance = unref(instanceRef);
      if (instance) {
        instance.setOptions(newOpts);
      }
    },
    { deep: true }
  );

  watch(
    [referenceElementRef, popperElementRef],
    ([referenceElement, popperElement]) => {
      destroy();
      if (!referenceElement || !popperElement) return;
      instanceRef.value = createPopper(
        referenceElement,
        popperElement,
        unref(options)
      );
    }
  );

  onBeforeUnmount(() => {
    destroy();
  });

  return {
    state: computed(() => ({ ...(unref(instanceRef)?.state ?? {}) })),
    styles: computed(() => unref(states).styles),
    attrs: computed(() => unref(states).attributes),
    update: () => unref(instanceRef)?.update(),
    forceUpdate: () => unref(instanceRef)?.forceUpdate(),
    instanceRef: computed(() => unref(instanceRef)),
  };
}

function deriveState(state: State) {
  const elements = keys(state.elements) as Array<keyof State["elements"]>;

  const styles = fromPairs(
    map(elements, (element) => [element, state.styles[element]])
  );
  const attributes = fromPairs(
    map(elements, (element) => [element, state.attributes[element]])
  );

  return {
    styles,
    attributes,
  };
}
