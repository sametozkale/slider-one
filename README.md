# Slider One

An animated React slider with tactile thumb motion, dynamic progress, and a floating value label.

## Installation

```shell
npm install @sametozkale/slider-one
npm install framer-motion
```

Requires [Tailwind CSS](https://tailwindcss.com/). Add the package dist files to Tailwind's content/source configuration so the generated classes are included.

**Tailwind v4**

```css
@import "tailwindcss";

@source "../node_modules/@sametozkale/slider-one/dist/**/*.js";
```

## Usage

```tsx
import { useState } from "react";
import {
  Slider,
  SliderLabel,
  SliderProgress,
  SliderThumb,
  SliderTrack,
} from "@sametozkale/slider-one";

function RadiusControl() {
  const [radius, setRadius] = useState(28);

  return (
    <Slider
      min={0}
      max={60}
      value={radius}
      onValueChange={setRadius}
      aria-label="Radius"
    >
      <SliderTrack>
        <SliderLabel label="Radius" formatter={(value) => `${value}px`} />
        <SliderProgress />
        <SliderThumb />
      </SliderTrack>
    </Slider>
  );
}
```

## API

### `Slider`

- `min`, `max`, `step`
- `value`, `defaultValue`
- `onValueChange`, `onValueCommit`
- `size`: `"sm" | "md" | "lg"`
- `variant`: `"default" | "micro"`
- `disabled`
- `tokens`: typed theme tokens (maps to `--so-*` CSS variables)
- `className`, `style`
- `aria-label`, `aria-labelledby`

### `SliderTrack`

- `rightValue`: `ReactNode | false` (custom right-side value display, or hide)
- `rightValueFormatter`: `(value) => ReactNode`
- `rightValueProps`: `{ className?, style? }`

### `SliderLabel`

- `label`: small leading text
- `formatter`: format the current numeric value

### `SliderProgress`

- `leftLabel`: `ReactNode` (defaults to `"Radius"`)
- `leftLabelProps`: `{ className?, style? }`

### Exports

- `Slider`
- `SliderTrack`
- `SliderProgress`
- `SliderThumb`
- `SliderLabel`
- Types: `SliderProps`, `SliderTrackProps`, `SliderProgressProps`, `SliderThumbProps`, `SliderLabelProps`, `SliderSize`, `SliderValueFormatter`, `SliderTokens`

## Theming

Customize the component through CSS variables on the root element:

```css
.slider-demo {
  --so-track-bg: linear-gradient(180deg, #f6f7fb 0%, #eceff6 100%);
  --so-track-border: rgba(61, 76, 122, 0.12);
  --so-progress-bg: linear-gradient(135deg, #17181a 0%, #5170ff 100%);
  --so-label-bg: rgba(17, 24, 39, 0.96);
  --so-focus-ring: rgba(81, 112, 255, 0.16);
}
```

You can also pass the same values in a typed way via `tokens`:

```tsx
<Slider
  min={0}
  max={60}
  value={radius}
  onValueChange={setRadius}
  tokens={{
    trackHeight: "40px",
    trackRadius: "14px",
    trackBg: "transparent",
    trackBorder: "#f2f2f2",
    progressBg: "#ffffff",
    labelBg: "rgba(17, 24, 39, 0.96)",
    focusRing: "rgba(81, 112, 255, 0.16)",
  }}
>
  <SliderTrack rightValueFormatter={(v) => `${v} / 60`}>
    <SliderLabel label="Radius" formatter={(value) => `${value}px`} />
    <SliderProgress leftLabel="Radius" />
    <SliderThumb />
  </SliderTrack>
</Slider>
```

## Links

- [Demo](https://slider-one-component.vercel.app/)
- [GitHub](https://github.com/sametozkale/slider-one)
- [npm](https://www.npmjs.com/package/@sametozkale/slider-one)

## License

MIT
