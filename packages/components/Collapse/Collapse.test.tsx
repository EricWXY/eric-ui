import { beforeAll, describe, expect, test, vi } from "vitest";
import { DOMWrapper, mount, type VueWrapper } from "@vue/test-utils";
import transitionEvents from "./transitionEvents";

import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";

const onChange = vi.fn();

let wrapper: VueWrapper,
  headers: DOMWrapper<Element>[],
  contents: DOMWrapper<Element>[];

let firstHeader: DOMWrapper<Element>,
  secondHeader: DOMWrapper<Element>,
  disabledHeader: DOMWrapper<Element>,
  firstContent: DOMWrapper<Element>,
  secondContent: DOMWrapper<Element>,
  disabledContent: DOMWrapper<Element>;

describe("Collapse.vue", () => {
  beforeAll(() => {
    wrapper = mount(
      () => (
        <Collapse modelValue={["a"]} {...{ onChange }}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ["ErIcon"],
        },
        attachTo: document.body, // 最新版本 jsdom 更新缓存 bug
      }
    );

    headers = wrapper.findAll(".er-collapse-item__header");
    contents = wrapper.findAll(".er-collapse-item__wapper");

    firstHeader = headers[0];
    secondHeader = headers[1];
    disabledHeader = headers[2];

    firstContent = contents[0];
    secondContent = contents[1];
    disabledContent = contents[2];
  });

  test("测试基础结构以及对应文本", () => {
    // lenght
    expect(headers.length).toBe(3);
    expect(contents.length).toBe(3);

    // title
    expect(firstHeader.text()).toBe("title a");

    // content
    expect(firstHeader.classes()).toContain("is-active");
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondHeader.classes()).not.toContain("is-active");
    expect(secondContent.isVisible()).toBeFalsy();
    expect(firstContent.text()).toBe("content a");
    expect(secondContent.text()).toBe("content b");
  });

  test("点击标题展开/关闭内容", async () => {
    // events
    await firstHeader.trigger("click");
    expect(firstContent.isVisible()).toBeFalsy();
    await secondHeader.trigger("click");
    expect(secondHeader.classes()).toContain("is-active");
    expect(secondHeader.isVisible()).toBeTruthy();
    expect(firstHeader.classes()).not.toContain("is-active");
    expect(firstContent.isVisible()).toBeFalsy();
  });

  test("发送正确的事件", () => {
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onChange).toHaveBeenLastCalledWith(["b"]);
  });

  test("disabled 内容", async () => {
    // disabled
    expect(disabledHeader.classes()).toContain("is-disabled");
    onChange.mockClear();
    await disabledHeader.trigger("click");
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(onChange).not.toHaveBeenCalled();
  });

  test("modelValue 变更", async () => {
    wrapper.setValue(["b"], "modelValue");
    await wrapper.vm.$nextTick();
    expect(secondHeader.classes()).toContain("is-active");
    expect(firstHeader.classes()).not.toContain("is-active");
  });

  test("手风琴模式", async () => {
    wrapper = mount(
      () => (
        <Collapse accordion modelValue={["a"]} {...{ onChange }}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ["ErIcon"],
        },
        attachTo: document.body,
      }
    );

    headers = wrapper.findAll(".er-collapse-item__header");
    contents = wrapper.findAll(".er-collapse-item__wapper");

    firstHeader = headers[0];
    secondHeader = headers[1];

    firstContent = contents[0];
    secondContent = contents[1];
    await firstHeader.trigger("click");
    await secondHeader.trigger("click");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(["b"]);
    expect(firstHeader.classes()).not.toContain("is-active");
    expect(secondHeader.classes()).toContain("is-active");
  });

  test("手风琴模式 错误处理", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(
      () => (
        <Collapse accordion modelValue={["a", "b"]} {...{ onChange }}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ["ErIcon"],
        },
      }
    );
    expect(warn.mock.calls).toMatchInlineSnapshot(
      `
        [
          [
            [ErUIError: [ErCollapse] accordion mode should only have one active item],
          ],
        ]
      `
    );
  });
});

describe("Collapse/transitionEvents.ts", () => {
  const wrapper = mount(() => <div></div>);
  test("beforeEnter", () => {
    transitionEvents.beforeEnter(wrapper.element);
    expect(wrapper.element.style.height).toBe("0px");
    expect(wrapper.element.style.overflow).toBe("hidden");
  });
  test("enter", () => {
    transitionEvents.enter(wrapper.element);
    expect(wrapper.element.style.height).toBe(
      `${wrapper.element.scrollHeight}px`
    );
  });
  test("afterEnter", () => {
    transitionEvents.afterEnter(wrapper.element);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.element.style.overflow).toBe("");
  });
  test("beforeLeave", () => {
    transitionEvents.beforeLeave(wrapper.element);
    expect(wrapper.element.style.height).toBe(
      `${wrapper.element.scrollHeight}px`
    );
    expect(wrapper.element.style.overflow).toBe("hidden");
  });
  test("leave", () => {
    transitionEvents.leave(wrapper.element);
    expect(wrapper.element.style.height).toBe("0px");
  });
  test("afterLeave", () => {
    transitionEvents.afterLeave(wrapper.element);
    expect(wrapper.element.style.height).toBe("");
    expect(wrapper.element.style.overflow).toBe("");
  });
});
