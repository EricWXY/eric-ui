import { each, isFunction, cloneDeep, assign } from "lodash-es";
import type { MaybeRef, VNode, Slots } from "vue";
import { isRef, computed, watchEffect } from "vue";

const _dfs = (nodes: VNode[], cb: (node: VNode) => void) =>
  each(nodes, (node) => {
    isFunction(cb) && cb(node);
    node.children && _dfs(node.children as VNode[], cb);
  });

export function useDisabledStyle(slots: Slots, disabled: MaybeRef<boolean>) {
  const _disabled = computed(() =>
    isRef(disabled) ? disabled.value : disabled
  );
  const nodePropsMap = new Map();

  watchEffect(() => {
    if (!!_disabled.value) {
      _dfs(slots?.default?.() ?? [], (node) => {
        if (!node?.props) return;

        nodePropsMap.set(node, cloneDeep(node.props));
        node.props = assign(node?.props, {
          style: {
            cursor: "not-allowed",
            color: "var(--er-text-color-placeholder)",
          },
        });
      });
      return;
    }
    _dfs(slots?.default?.() ?? [], (node) => {
      if (!nodePropsMap.has(node)) return;
      node.props = nodePropsMap.get(node);
    });
  });
}

export default useDisabledStyle;
