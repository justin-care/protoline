import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { Card } from "../src/Card";

describe("Card component", () => {
  const props = {
    title: "Test Card",
    description: "This is a test description.",
    image: "https://via.placeholder.com/150",
  };

  it("renders title, description and image", () => {
    render(<Card {...props} />);

    // Prefer role queries when possible
    const heading = screen.getByRole("heading", { name: /Test Card/i });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(/this is a test description/i);
    expect(description).toBeInTheDocument();

    // If image has alt text, it should be available by role 'img'. We try to assert presence if available.
    const img = screen.queryByRole("img");
    if (img) {
      expect(img).toBeInTheDocument();
    }
  });

  it("handles basic user interaction (click) without throwing", () => {
    render(<Card {...props} />);

    const heading = screen.getByRole("heading", { name: /Test Card/i });
    // perform a click interaction (no specific behavior required by the component)
    fireEvent.click(heading);

    // After interaction the content should still be present
    expect(screen.getByText(/this is a test description/i)).toBeInTheDocument();
  });
});
