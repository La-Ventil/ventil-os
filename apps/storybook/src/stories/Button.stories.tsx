import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button as ButtonComponent } from "@repo/ui/button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: ButtonComponent,
  argTypes: {
    variant: {
      options: ["text", "contained", "outlined"],
      control: { type: "radio" },
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "radio" },
    },
    color: {
      options: ["primary", "secondary", "success", "error"],
      control: { type: "radio" },
    },
  },
  render: function Render(args) {
    return <ButtonComponent {...args}>Hello</ButtonComponent>;
  },
} satisfies Meta<typeof ButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Button: Story = {
  args: {
    color: "primary",
    variant: "contained",
    size: "large",
  },
};
