import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3";
import { ErButton, ErButtonGroup } from "eric-ui";

type Story = StoryObj<typeof ErButton>;

export default {
  title: "Example/Button",
  component: ErButton,
  subcomponents: { ButtonGroup: ErButtonGroup },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    useThrottle: {
      control: "boolean",
    },
    throttleDuration: {
      control: "number",
    },
    autofocus: {
      control: "boolean",
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" },
    },
    loadingIcon: {
      control: { type: "text" },
    },
  },
  args: { onClick: fn() },
} as Meta<typeof ErButton>;

const container = (val: string) => `
<div style="margin:10px">
  ${val}
</div>
`;

export const Default: Story = {
  args: {
    type: "primary",
  },
  render: (args) => ({
    components: { ErButton },
    setup() {
      return { args };
    },
    template: container(`<er-button v-bind="args">Button</er-button>`),
  }),
};

export const Group: StoryObj<any> = {
  argTypes: {
    groupType: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    groupSize: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    groupDisabled: {
      control: "boolean",
    },
  },
  args: {
    round: true,
  },
  render: (args: any) => ({
    components: { ErButton, ErButtonGroup },
    setup() {
      return { args };
    },
    template: container(`
       <er-button-group :type="args.groupType" :size="args.groupSize" :disabled="args.groupDisabled">
         <er-button v-bind="args">Button1</er-button>
         <er-button v-bind="args">Button2</er-button>
       </er-button-group>
    `),
  }),
};
