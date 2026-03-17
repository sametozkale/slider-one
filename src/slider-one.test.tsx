import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Slider,
  SliderLabel,
  SliderProgress,
  SliderThumb,
  SliderTrack,
} from "./index";

describe("Slider One", () => {
  it("renders an accessible slider with the initial value", () => {
    render(
      <Slider min={0} max={60} defaultValue={30} aria-label="Radius">
        <SliderTrack>
          <SliderLabel label="Radius" />
          <SliderProgress />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    );

    const slider = screen.getByRole("slider", { name: "Radius" });

    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "60");
    expect(slider).toHaveValue("30");
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("supports customization via tokens and text props", () => {
    const { container } = render(
      <Slider
        min={0}
        max={60}
        defaultValue={12}
        aria-label="Custom"
        tokens={{ trackBg: "transparent", trackRadius: "20px" }}
      >
        <SliderTrack rightValueFormatter={(v) => `${v} / 60`}>
          <SliderLabel label="Custom" />
          <SliderProgress leftLabel="Amount" />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    );

    const root = container.querySelector(".so-root") as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.style.getPropertyValue("--so-track-bg")).toBe("transparent");
    expect(root!.style.getPropertyValue("--so-track-radius")).toBe("20px");

    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("12 / 60")).toBeInTheDocument();
  });

  it("normalizes values to the nearest step and emits changes", () => {
    const handleValueChange = vi.fn();

    render(
      <Slider
        min={0}
        max={100}
        step={5}
        defaultValue={20}
        aria-label="Opacity"
        onValueChange={handleValueChange}
      >
        <SliderTrack>
          <SliderLabel label="Opacity" />
          <SliderProgress />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    );

    const slider = screen.getByRole("slider", { name: "Opacity" });

    fireEvent.change(slider, { target: { value: "63" } });

    expect(handleValueChange).toHaveBeenCalledWith(65);
    expect(screen.getByText("65")).toBeInTheDocument();
  });

  it("commits the current value on blur", () => {
    const handleValueCommit = vi.fn();

    render(
      <Slider
        min={10}
        max={90}
        defaultValue={40}
        aria-label="Blur"
        onValueCommit={handleValueCommit}
      >
        <SliderTrack>
          <SliderLabel label="Blur" />
          <SliderProgress />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    );

    const slider = screen.getByRole("slider", { name: "Blur" });

    fireEvent.change(slider, { target: { value: "72" } });
    fireEvent.blur(slider);

    expect(handleValueCommit).toHaveBeenCalledWith(72);
  });
});
