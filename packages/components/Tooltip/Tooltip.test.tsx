import { describe, test,it, expect, vi, beforeEach } from "vitest";
import { withInstall } from "@eric-ui/utils";
import { mount } from "@vue/test-utils";
import { ErTooltip } from ".";

import Tooltip from "./Tooltip.vue";

vi.mock("@popperjs/core");

const onVisibleChange = vi.fn();

describe("Tooltip/index.ts", () => {
  // 测试 withInstall 函数是否被正确应用
  it("should be exported with withInstall()", () => {
    expect(ErTooltip.install).toBeDefined();
  });

  // 测试 Tooltip 组件是否被正确导出
  it("should be exported Tooltip component", () => {
    expect(ErTooltip).toBe(Tooltip);
  });

  // 可选：测试 withInstall 是否增强了 Tooltip 组件的功能
  test("should enhance Tooltip component", () => {
    const enhancedTooltip = withInstall(Tooltip);
    expect(enhancedTooltip).toBe(ErTooltip);
    // 这里可以添加更多测试，确保 withInstall 增强了组件的特定功能
  });

  // 可选：如果你的 withInstall 函数有特定的行为或属性，确保它们被正确应用
  test("should apply specific enhancements", () => {
    const enhancedTooltip = withInstall(Tooltip);
    // 例如，如果你的 withInstall 增加了一个特定的方法或属性
    expect(enhancedTooltip).toHaveProperty("install");
  });
});

describe("Tooltip.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks()
  });
  test("basic tooltip", async () => {
    const wrapper = mount(
      () => (
        <div>
          <div id="outside"></div>
          <Tooltip
            content="hello tooltip"
            trigger="click"
            {...{ onVisibleChange }}
          >
            <button id="trigger">trigger</button>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      }
    );
    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();

    // 弹出层是否出现
    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    expect(wrapper.get(".er-tooltip__popper").text()).toBe("hello tooltip");
    expect(onVisibleChange).toHaveBeenCalledWith(true);

    // 再次点击
    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenCalledTimes(2);

    // 等待动画
    await vi.runAllTimers();

    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    // 区域外点击关闭 tooltip
    wrapper.get("#outside").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenCalledTimes(4);

    // 注销流程
    wrapper.unmount();
  });

  test("tooltip with hover trigger", async () => {
    // ... 省略其他设置
    const wrapper = mount(Tooltip, {
      props: { trigger: "hover", content: "test" },
    });
    // 测试悬停显示
    wrapper.find(".er-tooltip__trigger").trigger("mouseenter");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    // 测试悬外隐藏
    wrapper.find(".er-tooltip").trigger("mouseleave");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
  });

  // 右键菜单触发的测试
  test("tooltip with contextmenu trigger", async () => {
    // ... 省略其他设置
    const wrapper = mount(Tooltip, {
      props: { trigger: "contextmenu", content: "test" },
    });
    // 测试右键菜单显示
    wrapper.find(".er-tooltip__trigger").trigger("contextmenu");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    // 测试右键菜单隐藏（可以模拟点击外部区域）
  });

  // 手动模式的测试
  test("tooltip with manual trigger", async () => {
    // ... 省略其他设置
    const wrapper = mount(Tooltip, {
      props: { manual: true, content: "test" },
    });
    // 测试手动触发显示和隐藏
    wrapper.vm.show(); // 假设 show 方法可以通过某种方式访问
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    wrapper.vm.hide();
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
  });

  // 禁用状态的测试
  test("disabled tooltip", async () => {
    // ... 省略其他设置
    const wrapper = mount(Tooltip, {
      props: { disabled: true, content: "test" },
    });
    // 测试禁用状态下点击不会触发显示
    wrapper.find(".er-tooltip__trigger").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
  });

  // 虚拟触发节点的测试
  test("tooltip with virtual trigger node", async () => {
    // ... 省略其他设置
    const virtualRef = document.createElement("div");
    const wrapper = mount(Tooltip, {
      props: { virtualRef, virtualTriggering: true },
    });
    // 测试虚拟节点的事件触发
    virtualRef.dispatchEvent(new Event("mouseenter"));
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
  });
});
