import { describe, it, test, expect, vi, beforeEach } from "vitest";
import { withInstall } from "@eric-ui/utils";
import { mount } from "@vue/test-utils";
import { ErDropdown, ErDropdownItem } from ".";
import type { DropdownItemProps } from "./types";

import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";

vi.mock("@popperjs/core");

describe("Dropdown/index.ts", () => {
  // 测试 withInstall 函数是否被正确应用
  it("should be exported with withInstall()", () => {
    expect(ErDropdown.install).toBeDefined();
    expect(ErDropdownItem.install).toBeDefined();
  });

  // 测试 Dropdown 组件是否被正确导出
  it("should be exported Dropdown component", () => {
    expect(ErDropdown).toBe(Dropdown);
    expect(ErDropdownItem).toBe(DropdownItem);
  });

  // 可选：测试 withInstall 是否增强了 Tooltip 组件的功能
  test("should enhance Dropdown component", () => {
    const enhancedDropdown = withInstall(Dropdown);
    expect(enhancedDropdown).toBe(ErDropdown);
    // 这里可以添加更多测试，确保 withInstall 增强了组件的特定功能
  });

  // 可选：如果你的 withInstall 函数有特定的行为或属性，确保它们被正确应用
  test("should apply specific enhancements", () => {
    const enhancedDropdown = withInstall(Dropdown);
    // 例如，如果你的 withInstall 增加了一个特定的方法或属性
    expect(enhancedDropdown).toHaveProperty("install");
  });
});

describe("Dropdown.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  it("should render slots correctly", () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1", command: "item1" },
      { label: "Item 2", command: "item2" },
    ];

    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
      },
      slots: {
        default: () => <button id="trigger">Default slot content</button>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });

    expect(wrapper.text()).toContain("Default slot content");
    expect(wrapper.find(".er-dropdown").exists()).toBeTruthy();
  });

  it("should emit command event when item is clicked", async () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1", disabled: true },
      { label: "Item 2", command: "item2", divided: true },
    ];
    const onCommand = vi.fn();
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        onCommand,
      },
      slots: {
        default: () => <button id="trigger">Default slot content</button>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });

    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();

    triggerArea.trigger("click");
    await vi.runAllTimers();

    expect(wrapper.find(".er-dropdown__menu").exists()).toBeTruthy();
    await wrapper.findAll("li").at(0)?.trigger("click");
    expect(onCommand).toBeCalledTimes(0); // disabled

    await wrapper.findAll("li").at(2)?.trigger("click");
    expect(onCommand).toBeCalled();
    expect(onCommand).toBeCalledWith("item2");
  });

  it("should toggle visibility when split btn is clicked", async () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1" },
      { label: "Item 2", command: "item2" },
    ];
    const onClick = vi.fn();
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        splitButton: true,
        items: items,
        onClick,
      },
      slots: {
        default: () => <div id="trigger">Default slot content</div>,
      },
    });

    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();
    triggerArea.trigger("click");
    await vi.runAllTimers();

    expect(wrapper.find(".er-dropdown__menu").exists()).toBeFalsy();
    expect(onClick).toBeCalled();
  });


});
