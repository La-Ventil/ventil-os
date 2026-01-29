import type { Meta, StoryObj } from '@storybook/react-vite';
import QuickActionsMenu from '@repo/ui/quick-actions-menu';

const meta = {
  component: QuickActionsMenu
} satisfies Meta<typeof QuickActionsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuickActionsMenuStory: Story = {};
