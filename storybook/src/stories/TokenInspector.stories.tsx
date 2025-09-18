import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { TokenInspector } from '../../../packages/ui/src/TokenInspector';

const meta: Meta<typeof TokenInspector> = {
  title: 'UI/TokenInspector',
  component: TokenInspector,
  parameters: {
    // Add Storybook-level parameters here if needed
  },
};

export default meta;

type Story = StoryObj<typeof TokenInspector>;

export const Colors: Story = {
    args: { category: "color" }
  };
  
  export const Spacing: Story = {
    args: { category: "spacing" }
  };
  
  export const Typography: Story = {
    args: { category: "typography" }
  };
  
  export const Shadows: Story = {
    args: { category: "shadow" }
  };

export const WithCustomProps: Story = {
  args: {
    category: 'spacing',
  },
};
