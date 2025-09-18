import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../packages/ui/src/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: "Click me",
  },
};

export const WithCustomProps: Story = {
  args: {
    label: "Submit",
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log("Button clicked from Storybook");
    },
  },
};
