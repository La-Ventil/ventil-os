import type { Meta, StoryObj } from "@storybook/react-vite";

import BottomNavigationComponent from "@repo/ui/bottom-navigation";

const meta = {
  component: BottomNavigationComponent,
} satisfies Meta<typeof BottomNavigationComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomNavigation: Story = {};
