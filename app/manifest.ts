import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slider One",
    short_name: "Slider One",
    description:
      "A smooth, animated React slider with tactile motion, dynamic progress, and a floating value label.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#17181A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
