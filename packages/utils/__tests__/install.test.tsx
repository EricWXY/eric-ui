import { describe, expect, it } from "vitest";
import { defineComponent, createApp } from "vue";
import { mount } from "@vue/test-utils";
import { withInstall } from "../install";

const AppComp = defineComponent({
  setup() {
    return () => <div>app</div>;
  },
});

const componentA = withInstall(
  defineComponent({
    name: "test",
    setup() {
      return () => <div>test</div>;
    },
  })
);

const componentB = withInstall(
  defineComponent({
    name: "test2",
    setup() {
      return () => <div>test2</div>;
    },
  })
);

describe("install", () => {
  it("withInstall should be worked", () => {
    const wapper = mount(() => <div id="app2"></div>);
    const app = createApp(AppComp);

    app.use(componentA).use(componentB).mount(wapper.element);

    expect(componentA.install).toBeDefined();
    expect(componentB.install).toBeDefined();
    expect(wapper.findComponent(componentA)).toBeTruthy();
    expect(wapper.findComponent(componentB)).toBeTruthy();
  });
});
