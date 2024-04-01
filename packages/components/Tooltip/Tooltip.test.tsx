import { describe, test, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import Tooltip from "./Tooltip.vue";

vi.mock("@popperjs/core");

const onVisibleChange = vi.fn();

describe("Tooltip.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
    expect(onVisibleChange).toHaveBeenLastCalledWith(false);

    // 等待动画
    await vi.runAllTimers();

    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeTruthy();
    // 区域外点击关闭 tooltip
    wrapper.get("#outside").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".er-tooltip__popper").exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  });
});
