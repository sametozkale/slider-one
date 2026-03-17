"use client";

import { useCallback, useMemo, useState } from "react";

const NPM_URL = "https://www.npmjs.com/package/@sametozkale/slider-one";

/** Prompt pre-filled when opening in Cursor: install + ready-to-run example in the user's app. */
const CURSOR_PROMPT = [
  "You are helping me integrate @sametozkale/slider-one into an existing React app.",
  "",
  "Goals:",
  "- Install all required packages.",
  "- Add a minimal but production-ready example slider component.",
  "- Wire it into an existing page or route so I can verify it visually.",
  "",
  "Tasks:",
  "1) Add the dependency:",
  "   npm install @sametozkale/slider-one framer-motion",
  "",
  "2) Create a reusable <RadiusControl /> component that:",
  "   - Imports Slider, SliderTrack, SliderProgress, SliderThumb, and SliderLabel from '@sametozkale/slider-one'.",
  "   - Controls a radius state between 0 and 64.",
  "   - Uses SliderTrack rightValueFormatter to show `current / max`.",
  "   - Uses SliderTokens (tokens prop) to customize track height, radius, and colors.",
  "",
  "3) Mount <RadiusControl /> somewhere visible in my app (for example in an existing page component) and keep the code self-contained and easy to copy.",
  "",
"Now inspect my repo structure and implement these changes step by step.",
].join("\n");

const CURSOR_URL = `https://cursor.com/link/prompt?text=${encodeURIComponent(CURSOR_PROMPT)}`;
const V0_PROMPT =
  [
    "Design a small section for a product settings page that showcases the @sametozkale/slider-one component.",
    "",
    "UI requirements:",
    "- A card or panel titled \"Corner radius\".",
    "- One main slider that controls a numeric radius between 0 and 64.",
    "- The left label text is customizable (for example \"Radius\" or a product-specific label).",
    "- On the right, show a total/summary label like `current / 64`.",
    "- Demonstrate different visual themes by using the Slider `tokens` prop to change track/ thumb/ label colors and border radius.",
    "",
  "Code requirements:",
  "- Use React + Tailwind CSS in the solution.",
  "- Import Slider, SliderTrack, SliderProgress, SliderThumb, and SliderLabel from '@sametozkale/slider-one'.",
  "- Show concrete JSX that can be pasted into a React project.",
  ].join("\n");
const V0_URL = "https://v0.dev/chat";

const CURSOR_LINK_TITLE =
  "Opens Cursor with a step-by-step prompt to install and integrate @sametozkale/slider-one into your project (new tab)";
const V0_LINK_TITLE =
  "Opens v0.dev with a concrete UI brief and code-oriented prompt for @sametozkale/slider-one (new tab)";

export function PageFooter() {
  const [v0Copied, setV0Copied] = useState(false);
  const v0Prompt = useMemo(() => V0_PROMPT, []);

  const handleOpenV0 = useCallback(() => {
    setV0Copied(false);

    const open = () => {
      window.open(V0_URL, "_blank", "noopener,noreferrer");
    };

    if (!("clipboard" in navigator)) {
      open();
      window.prompt("Copy this prompt into v0:", v0Prompt);
      return;
    }

    navigator.clipboard
      .writeText(v0Prompt)
      .then(() => {
        setV0Copied(true);
        open();
      })
      .catch(() => {
        open();
        window.prompt("Copy this prompt into v0:", v0Prompt);
      });
  }, [v0Prompt]);

  return (
    <footer className="page-footer">
      <hr className="page-footer-divider" />
      <div className="page-footer-links">
        <a
          href={NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="View @sametozkale/slider-one on npm"
        >
          View on npm
        </a>
        <a
          href={CURSOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={CURSOR_LINK_TITLE}
          aria-label={CURSOR_LINK_TITLE}
        >
          Open in Cursor
        </a>
        <a
          href={V0_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={V0_LINK_TITLE}
          aria-label={V0_LINK_TITLE}
          onClick={(event) => {
            event.preventDefault();
            handleOpenV0();
          }}
        >
          {v0Copied ? "Prompt copied • Open v0" : "Open in v0"}
        </a>
      </div>
      Developed by{" "}
      <a
        href="https://samet.works/"
        target="_blank"
        rel="noopener noreferrer"
      >
        samet.works
      </a>{" "}
      in 2026.
    </footer>
  );
}

export { NPM_URL, CURSOR_URL, V0_URL, V0_PROMPT, CURSOR_PROMPT, CURSOR_LINK_TITLE, V0_LINK_TITLE };
