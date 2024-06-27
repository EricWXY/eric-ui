import { describe, it, test, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { withInstall } from "@eric-ui/utils";
import { each, get } from "lodash-es";
import type { PopconfirmProps } from "./types";
import { ErPopconfirm } from ".";

import Popconfirm from "./Popconfirm.vue";

const onConfirm = vi.fn();
const onCancel = vi.fn();

describe("Popconfirm/index.ts", () => {
  // 测试 withInstall 函数是否被正确应用
  it("should be exported with withInstall()", () => {
    expect(ErPopconfirm.install).toBeDefined();
  });

  // 测试 Popconfirm 组件是否被正确导出
  it("should be exported Popconfirm component", () => {
    expect(ErPopconfirm).toBe(Popconfirm);
  });

  // 可选：测试 withInstall 是否增强了 Popconfirm 组件的功能
  test("should enhance Popconfirm component", () => {
    const enhancedPopconfirm = withInstall(Popconfirm);
    expect(enhancedPopconfirm).toBe(ErPopconfirm);
    // 这里可以添加更多测试，确保 withInstall 增强了组件的特定功能
  });

  // 可选：如果你的 withInstall 函数有特定的行为或属性，确保它们被正确应用
  test("should apply specific enhancements", () => {
    const  enhancedPopconfirm  = withInstall(Popconfirm);
    // 例如，如果你的 withInstall 增加了一个特定的方法或属性
    expect(enhancedPopconfirm).toHaveProperty("install");
  });
});

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

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

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
  it("should renders slot content correctly", () => {
    const slotContent = "Slot Content";
    const wrapper = mount(Popconfirm, {
      props,
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });

  test("popconfirm emits", async () => {
    const wrapper = mount(() => (
      <div>
        <div id="outside"></div>
        <Popconfirm
          title="Test Title"
          hideIcon={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          <button id="trigger">trigger</button>
        </Popconfirm>
      </div>
    ));
    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();

    triggerArea.trigger("click");
    await vi.runAllTimers();

    // 弹出层是否出现
    expect(wrapper.find(".er-popconfirm").exists()).toBeTruthy();
    const confirmButton = wrapper.find(".er-popconfirm__confirm");
    expect(confirmButton.exists()).toBeTruthy();

    confirmButton.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-popconfirm").exists()).toBeFalsy();
    expect(onConfirm).toBeCalled();

    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-popconfirm").exists()).toBeTruthy();
    const cancelButton = wrapper.find(".er-popconfirm__cancel");
    expect(cancelButton.exists()).toBeTruthy();

    await vi.runAllTimers();
    cancelButton.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-popconfirm").exists()).toBeFalsy();
    expect(onCancel).toBeCalled();
  });
});
