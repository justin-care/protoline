import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../../packages/ui/src/Card";

export default {
  title: "Components/Card",
  component: Card,
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Card title",
    description: "This is a description of the card.",
    image: "https://picsum.photos/seed/story/100/100",
  },
};

export const WithCustomProps: Story = {
  args: {
    title: "Custom Title",
    description: "A different description for the card with custom props.",
    image: "https://picsum.photos/seed/story/100/100",
  },
};
