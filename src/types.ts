import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

interface SliderVisualSlotProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export type SliderSize = "sm" | "md" | "lg";

export type SliderValueFormatter = (value: number) => string;
export type SliderVariant = "default" | "micro";

export type SliderTokenValue = string | number;

export interface SliderTokens {
  /** e.g. "36px" */
  trackHeight?: SliderTokenValue;
  /** e.g. "12px" */
  trackRadius?: SliderTokenValue;
  /** e.g. "32px" */
  thumbSize?: SliderTokenValue;

  trackBg?: SliderTokenValue;
  trackBorder?: SliderTokenValue;
  progressBg?: SliderTokenValue;
  thumbBg?: SliderTokenValue;
  thumbBorder?: SliderTokenValue;
  thumbShadow?: SliderTokenValue;

  labelBg?: SliderTokenValue;
  labelText?: SliderTokenValue;
  labelMuted?: SliderTokenValue;

  focusRing?: SliderTokenValue;

  /** Optional: used by some themes/demos */
  gridLine?: SliderTokenValue;
}

export interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  min: number;
  max: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  disabled?: boolean;
  size?: SliderSize;
  variant?: SliderVariant;
  children: ReactNode;
  /** Typed way to set CSS custom properties (tokens) on the root. */
  tokens?: SliderTokens;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface SliderTrackValueDisplayProps {
  className?: string;
  style?: CSSProperties;
}

export interface SliderTrackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Right-side value display (defaults to current numeric `value`).
   * - Pass `false` to hide.
   * - Pass a ReactNode for custom UI.
   */
  rightValue?: ReactNode | false;
  /**
   * Convenience formatter for the right-side value display.
   * Ignored when `rightValue` is explicitly provided (except `undefined`).
   */
  rightValueFormatter?: (value: number) => ReactNode;
  rightValueProps?: SliderTrackValueDisplayProps;
}

export interface SliderProgressProps extends SliderVisualSlotProps {
  /** Left label inside the progress area (defaults to "Radius"). */
  leftLabel?: ReactNode;
  leftLabelProps?: { className?: string; style?: CSSProperties };
}

export interface SliderThumbProps extends SliderVisualSlotProps {}

export interface SliderLabelProps extends SliderVisualSlotProps {
  label?: string;
  formatter?: SliderValueFormatter;
}
