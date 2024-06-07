import type { Plugin } from "vue";
import { describe, it, expect } from "vitest";
import {
  ErAlert,
  ErButton,
  ErButtonGroup,
  ErCollapse,
  ErCollapseItem,
  ErDropdown,
  ErDropdownItem,
  ErForm,
  ErFormItem,
  ErIcon,
  ErInput,
  ErLoading,
  ErLoadingDirective,
  ErLoadingService,
  ErMessage,
  ErMessageBox,
  ErNotification,
  ErOption,
  ErPopconfirm,
  ErSelect,
  ErSwitch,
  ErTooltip,
  ErUpload,
} from "./index";
import { map, get } from "lodash-es";

const components = [
  ErButton,
  ErButtonGroup,
  ErCollapse,
  ErCollapseItem,
  ErIcon,
  ErDropdown,
  ErDropdownItem,
  ErTooltip,
  ErMessage,
  ErInput,
  ErSwitch,
  ErSelect,
  ErOption,
  ErForm,
  ErFormItem,
  ErAlert,
  ErNotification,
  ErLoading,
  ErUpload,
  ErPopconfirm,
  ErMessageBox,
] as Plugin[];

describe("components/index.ts", () => {
  it.each(map(components, (c) => [get(c, "name") ?? "", c]))("%s should be exported", (_, component) => {
    expect(component).toBeDefined();
    expect(component.install).toBeDefined()
  });

  it('ErLoadingService and ErLoadingDirective should be exported',()=>{
    expect(ErLoadingService).toBeDefined()
    expect(ErLoadingDirective).toBeDefined()
  })
});
