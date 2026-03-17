"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import type {
  SliderLabelProps,
  SliderProgressProps,
  SliderProps,
  SliderSize,
  SliderTokens,
  SliderVariant,
  SliderThumbProps,
  SliderTrackProps,
} from "./types";

type SliderCSSProperties = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

interface SizeConfig {
  trackHeight: number;
  thumbSize: number;
  labelReserve: number;
}

interface SliderContextValue {
  inputId: string;
  min: number;
  max: number;
  step: number;
  value: number;
  percent: number;
  disabled: boolean;
  size: SliderSize;
  variant: SliderVariant;
  sizeConfig: SizeConfig;
  reduceMotion: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isDragging: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  setValue: (nextValue: number) => void;
  commitValue: () => void;
  setFocused: (focused: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setDragging: (dragging: boolean) => void;
}

const SliderContext = createContext<SliderContextValue | null>(null);

const SIZE_CONFIG: Record<SliderSize, SizeConfig> = {
  sm: {
    trackHeight: 52,
    thumbSize: 22,
    labelReserve: 54,
  },
  md: {
    trackHeight: 60,
    thumbSize: 28,
    labelReserve: 62,
  },
  lg: {
    trackHeight: 72,
    thumbSize: 34,
    labelReserve: 72,
  },
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function tokensToCSSVars(tokens?: SliderTokens): SliderCSSProperties {
  if (!tokens) return {};

  const vars: SliderCSSProperties = {};

  if (tokens.trackHeight != null) vars["--so-track-height"] = tokens.trackHeight;
  if (tokens.trackRadius != null) vars["--so-track-radius"] = tokens.trackRadius;
  if (tokens.thumbSize != null) vars["--so-thumb-size"] = tokens.thumbSize;

  if (tokens.trackBg != null) vars["--so-track-bg"] = tokens.trackBg;
  if (tokens.trackBorder != null) vars["--so-track-border"] = tokens.trackBorder;
  if (tokens.progressBg != null) vars["--so-progress-bg"] = tokens.progressBg;
  if (tokens.thumbBg != null) vars["--so-thumb-bg"] = tokens.thumbBg;
  if (tokens.thumbBorder != null) vars["--so-thumb-border"] = tokens.thumbBorder;
  if (tokens.thumbShadow != null) vars["--so-thumb-shadow"] = tokens.thumbShadow;

  if (tokens.labelBg != null) vars["--so-label-bg"] = tokens.labelBg;
  if (tokens.labelText != null) vars["--so-label-text"] = tokens.labelText;
  if (tokens.labelMuted != null) vars["--so-label-muted"] = tokens.labelMuted;

  if (tokens.focusRing != null) vars["--so-focus-ring"] = tokens.focusRing;
  if (tokens.gridLine != null) vars["--so-grid-line"] = tokens.gridLine;

  return vars;
}

function getPrecision(step: number) {
  const [, decimals = ""] = step.toString().split(".");
  return decimals.length;
}

function normalizeValue(value: number, min: number, max: number, step: number) {
  if (max <= min) return min;
  const safeStep = step > 0 ? step : 1;
  const rounded = min + Math.round((value - min) / safeStep) * safeStep;
  const precision = getPrecision(safeStep);
  return clamp(Number(rounded.toFixed(precision)), min, max);
}

function getPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function useSliderContext(componentName: string) {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside <Slider>.`);
  }

  return context;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  disabled = false,
  size = "md",
  variant = "default",
  className,
  children,
  style,
  tokens,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}: SliderProps) {
  const inputId = useId();
  const reduceMotion = Boolean(useReducedMotion());
  const safeStep = step > 0 ? step : 1;
  const sizeConfig = SIZE_CONFIG[size];
  const initialValue = normalizeValue(defaultValue ?? min, min, max, safeStep);
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState(initialValue);
  const [isFocused, setFocused] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isDragging, setDragging] = useState(false);

  const resolvedValue = normalizeValue(
    isControlled ? value : internalValue,
    min,
    max,
    safeStep
  );
  const valueRef = useRef(resolvedValue);

  valueRef.current = resolvedValue;

  const setValue = useCallback(
    (nextValue: number) => {
      const normalized = normalizeValue(nextValue, min, max, safeStep);

      if (!isControlled) {
        setInternalValue(normalized);
      }

      onValueChange?.(normalized);
    },
    [isControlled, max, min, onValueChange, safeStep]
  );

  const commitValue = useCallback(() => {
    onValueCommit?.(valueRef.current);
  }, [onValueCommit]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerEnd = () => {
      setDragging(false);
      onValueCommit?.(valueRef.current);
    };

    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [isDragging, onValueCommit]);

  const percent = getPercent(resolvedValue, min, max);
  const trackHeight =
    size === "sm" ? "28px" : size === "lg" ? "44px" : "36px";
  const trackRadius =
    size === "sm" ? "10px" : size === "lg" ? "16px" : "12px";
  const thumbSize =
    size === "sm" ? "22px" : size === "lg" ? "38px" : "32px";
  const rootStyle: SliderCSSProperties = {
    paddingTop: "0px",
    "--so-track-height": trackHeight,
    "--so-track-radius": trackRadius,
    "--so-thumb-size": thumbSize,
    "--so-track-bg": "#f2f2f2",
    "--so-track-border": "#f2f2f2",
    "--so-progress-bg": "#ffffff",
    "--so-thumb-bg": "#ffffff",
    "--so-thumb-border": "#ffffff",
    "--so-thumb-shadow": "none",
    "--so-label-bg": "rgba(23, 24, 26, 0.96)",
    "--so-label-text": "#ffffff",
    "--so-label-muted": "rgba(255, 255, 255, 0.68)",
    "--so-focus-ring": "rgba(23, 24, 26, 0.1)",
    ...tokensToCSSVars(tokens),
    ...style,
  };
  if (variant === "micro") {
    rootStyle["--so-track-height"] = "52px";
    rootStyle["--so-track-radius"] = "14px";
    rootStyle["--so-track-bg"] = "#f4f4f4";
    rootStyle["--so-track-border"] = "#f1f1f1";
    rootStyle["--so-progress-bg"] = "transparent";
    rootStyle["--so-thumb-bg"] = "#a7a7a7";
    rootStyle["--so-thumb-border"] = "transparent";
    rootStyle["--so-label-bg"] = "transparent";
    rootStyle["--so-label-text"] = "#7a7a7a";
    rootStyle["--so-label-muted"] = "#9c9c9c";
    rootStyle["--so-focus-ring"] = "rgba(23, 24, 26, 0.08)";
  }

  const contextValue = useMemo<SliderContextValue>(
    () => ({
      inputId,
      min,
      max,
      step: safeStep,
      value: resolvedValue,
      percent,
      disabled,
      size,
      variant,
      sizeConfig,
      reduceMotion,
      isFocused,
      isHovered,
      isDragging,
      ariaLabel,
      ariaLabelledby,
      setValue,
      commitValue,
      setFocused,
      setHovered,
      setDragging,
    }),
    [
      ariaLabel,
      ariaLabelledby,
      commitValue,
      disabled,
      inputId,
      isDragging,
      isFocused,
      isHovered,
      max,
      min,
      percent,
      reduceMotion,
      resolvedValue,
      safeStep,
      setValue,
      size,
      sizeConfig,
      variant,
    ]
  );

  return (
    <SliderContext.Provider value={contextValue}>
      <div
        className={cn(
          "so-root relative block w-full min-w-[220px] touch-none select-none",
          disabled && "opacity-70",
          className
        )}
        style={rootStyle}
        data-size={size}
        data-disabled={disabled ? "" : undefined}
        {...rest}
      >
        {children}
      </div>
    </SliderContext.Provider>
  );
}

export function SliderTrack({
  className,
  children,
  rightValue,
  rightValueFormatter,
  rightValueProps,
  ...rest
}: SliderTrackProps) {
  const {
    inputId,
    min,
    max,
    step,
    value,
    disabled,
    sizeConfig,
    isFocused,
    isHovered,
    isDragging,
    ariaLabel,
    ariaLabelledby,
    setValue,
    commitValue,
    setFocused,
    setHovered,
    setDragging,
    variant,
  } = useSliderContext("SliderTrack");
  const isMicro = variant === "micro";

  const handleInputChange: InputHTMLAttributes<HTMLInputElement>["onChange"] = (
    event
  ) => {
    setValue(Number(event.currentTarget.value));
  };

  const handleKeyUp: InputHTMLAttributes<HTMLInputElement>["onKeyUp"] = (
    event
  ) => {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Home" ||
      event.key === "End" ||
      event.key === "PageUp" ||
      event.key === "PageDown"
    ) {
      commitValue();
    }
  };

  const visualShadow = disabled
    ? "none"
    : isDragging
      ? "0 14px 30px rgba(23, 24, 26, 0.12)"
      : isFocused
        ? "0 0 0 4px var(--so-focus-ring), 0 12px 28px rgba(23, 24, 26, 0.08)"
        : isHovered
          ? "0 12px 28px rgba(23, 24, 26, 0.08)"
          : "0 1px 0 rgba(255, 255, 255, 0.65) inset";

  return (
    <div
      className={cn(
        "so-track relative w-full",
        disabled ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-pointer",
        className
      )}
      style={{
        minHeight: "var(--so-track-height)",
        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 overflow-hidden border transition-[border-color,transform] duration-150"
        style={{
          height: "var(--so-track-height)",
          transform: `translateY(-50%) scale(${isDragging && !isMicro ? 1.002 : 1})`,
          background: "var(--so-track-bg)",
          borderColor: "var(--so-track-border)",
          borderRadius: "var(--so-track-radius)",
        }}
      />

      {children}

      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(
          "absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 appearance-none bg-transparent opacity-0",
          isMicro ? "h-12" : "h-11"
        )}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commitValue();
        }}
        onPointerDown={() => setDragging(true)}
        onPointerCancel={() => {
          setDragging(false);
          commitValue();
        }}
        onKeyUp={handleKeyUp}
        style={{
          cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "pointer",
        }}
      />
      {!isMicro && (
        <span
          aria-hidden="true"
          className={rightValueProps?.className}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px",
            fontFamily: 'Inter, system-ui, sans-serif',
            color: "#979797",
            pointerEvents: "none",
            ...rightValueProps?.style,
          }}
        >
          {rightValue === false
            ? null
            : rightValue !== undefined
              ? rightValue
              : rightValueFormatter
                ? rightValueFormatter(value)
                : value}
        </span>
      )}
    </div>
  );
}

export function SliderProgress({
  className,
  style,
  id,
  leftLabel = "Radius",
  leftLabelProps,
}: SliderProgressProps) {
  const { percent, reduceMotion, isDragging, isHovered, variant, size } =
    useSliderContext("SliderProgress");
  const isMicro = variant === "micro";
  if (isMicro) return null;

  // Approximate when the divider overlaps the left “Radius” label or right numeric value.
  // Layout is measured on a 64-unit scale, so convert to percent:
  // - “Radius” text covers ~2–15 → 0–(15/64)*100 ≈ 0–23.4%
  //   (we include 0 to also hide the divider during the first few pixels of movement)
  // - Numeric value covers ~58–62 → (58/64)*100–(62/64)*100 ≈ 90.6–96.9%
  const overlapsLeftLabel = percent <= (15 / 64) * 100;
  // Sağdaki sayı alanı 58–64 aralığını kapsasın diye üst sınırı kaldırıyoruz
  const overlapsRightValue = percent >= (58 / 64) * 100;

  const isAtEmpty = percent <= 0.5;
  const isAtFull = percent >= 99.5;
  const isHoverEmpty = isAtEmpty && isHovered && !isDragging;
  const isHoverFull = isAtFull && isHovered && !isDragging;

  // Normal divider (beyaz kısım içindeki) için görünürlük.
  const isBaseDividerVisible =
    !overlapsLeftLabel &&
    !overlapsRightValue &&
    !((isAtEmpty || isAtFull) && !isDragging);

  const outerRadius =
    size === "sm" ? "10px" : size === "lg" ? "16px" : "12px";
  const innerRadius =
    size === "sm" ? "8px" : size === "lg" ? "14px" : "10px";

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "so-progress pointer-events-none absolute left-0 top-1/2 rounded-[10px]",
        className
      )}
      style={{
        // White area should have aynı boşluk hem dikeyde hem yatayda.
        // Track yüksekliği 36px → içerideki beyaz alan 32px (her yönden 2px boşluk).
        height: "calc(var(--so-track-height) - 4px)",
        transform: "translateY(-50%)",
        marginInline: "0px",
        paddingInline: "2px",
        borderRadius: outerRadius,
        overflow: "hidden",
        ...style,
      }}
      initial={false}
      animate={{ width: "100%" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "tween",
              duration: 0.08,
              ease: "easeOut",
            }
      }
      id={id}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "relative",
          height: "100%",
          borderRadius: innerRadius,
          background: "transparent",
        }}
        initial={false}
      >
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--so-progress-bg)",
            borderRadius: innerRadius,
            overflow: "hidden",
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  type: "tween",
                  duration: 0.08,
                  ease: "easeOut",
                }
          }
        >
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              top: "8px",
              bottom: "8px",
              right: "8px",
              width: "2px",
              background: "#c4c4c4",
            }}
            initial={false}
            animate={{ opacity: isBaseDividerVisible && !isHoverEmpty && !isHoverFull ? 1 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.15,
                    ease: "easeOut",
                  }
            }
          />
        </motion.div>
        {/* 0 değer + hover durumunda, beyaz kısım olmadan sadece arka plan üzerinde sol tarafta dik çizgi */}
        <motion.div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            top: "8px",
            bottom: "8px",
            // Component'in solu (0px) ile "Radius" yazısının solu (10px) arasında tam ortada: 5px.
            left: "5px",
            width: "2px",
            background: "#c4c4c4",
          }}
          initial={false}
          animate={{ opacity: isHoverEmpty ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.15,
                  ease: "easeOut",
                }
          }
        />
        {/* Max değer + hover durumunda, sadece arka plan üzerinde sağ tarafta dik çizgi */}
        <motion.div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            top: "8px",
            bottom: "8px",
            // Sağdaki sayı span'i right: 12px; component'in sağı 0px → orta nokta 6px.
            right: "6px",
            width: "2px",
            background: "#c4c4c4",
          }}
          initial={false}
          animate={{ opacity: isHoverFull ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.15,
                  ease: "easeOut",
                }
          }
        />
        <span
          aria-hidden="true"
          className={leftLabelProps?.className}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px",
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
            color: "#979797",
            pointerEvents: "none",
            ...leftLabelProps?.style,
          }}
        >
          {leftLabel}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function SliderThumb({ className, style, id }: SliderThumbProps) {
  const {
    percent,
    reduceMotion,
    isDragging,
    isHovered,
    isFocused,
    disabled,
    variant,
  } = useSliderContext("SliderThumb");
  const isMicro = variant === "micro";

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "so-thumb pointer-events-none absolute top-1/2 z-20 rounded-full border",
        className
      )}
      style={{
        left: `calc(${percent}% - ${isMicro ? "1.5px" : "1px"})`,
        width: isMicro ? "3px" : "var(--so-thumb-size)",
        height: isMicro ? "22px" : "var(--so-thumb-size)",
        transform: "translateY(-50%)",
        background: isMicro ? "var(--so-thumb-bg)" : "transparent",
        borderColor: isMicro ? "var(--so-thumb-border)" : "transparent",
        boxShadow: "none",
        ...style,
      }}
      initial={false}
      animate={{
        scale: disabled ? 1 : isDragging ? (isMicro ? 1.04 : 1.08) : isFocused ? (isMicro ? 1.02 : 1.03) : isHovered ? 1.015 : 1,
        rotate: isMicro ? 0 : isDragging ? -1.5 : 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 360,
              damping: 24,
              mass: 0.6,
            }
      }
      id={id}
    >
      {null}
    </motion.div>
  );
}

export function SliderLabel({
  label = "Value",
  formatter,
  className,
  style,
  id,
}: SliderLabelProps) {
  const { value, percent, reduceMotion, isDragging, isFocused, isHovered, variant } =
    useSliderContext("SliderLabel");
  const isMicro = variant === "micro";

  const displayValue = formatter ? formatter(value) : String(value);
  const visible = isMicro ? true : isDragging || isFocused;

  if (isMicro) {
    return (
      <div
        id={id}
        className="pointer-events-none absolute left-0 top-1/2 z-20"
        style={{
          transform: "translateY(-50%)",
          width: "100%",
          paddingInline: "22px",
        }}
      >
        <div
          className={cn("so-label flex w-full items-center justify-between", className)}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            background: "transparent",
            color: "var(--so-label-text)",
            pointerEvents: "none",
            ...style,
          }}
        >
          <span
            className="font-medium tracking-[0.06em]"
            style={{ fontSize: "20px", color: "var(--so-label-text)" }}
          >
            {label}
          </span>
          <span
            className="font-medium tracking-[0.08em]"
            style={{ fontSize: "20px", color: "var(--so-label-text)" }}
          >
            {displayValue}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
