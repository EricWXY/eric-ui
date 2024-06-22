import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Popconfirm from "./Popconfirm.vue";
import type { PopconfirmProps } from "./types";
import { each, get } from "lodash-es";

// 测试组件是否能够接收所有 props
describe("Popconfirm.vue", () => {
  const props = {
    title: "Test Title",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonType: "primary",
    cancelButtonType: "info",
    icon: "check-circle",
    iconColor: "green",
    hideIcon: false,
    hideAfter: 500,
    width: 200,
  } as PopconfirmProps;

  it("should accept all props", () => {
    const wrapper = mount(Popconfirm, {
      props,
    });

    // 检查 props 是否被正确设置
    each(Object.keys(props), (key) => {
      expect(get(wrapper.props(), key)).toBe(get(props, key));
    });
  });

  // 测试插槽内容
  it("renders slot content correctly", () => {
    const slotContent = "Slot Content";
    const wrapper = mount(Popconfirm, {
      props,
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });
});
