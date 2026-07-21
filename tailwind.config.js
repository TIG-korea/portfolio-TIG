/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant": "#cfc4c5",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#c7c6c6",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#001b3f",
        "on-tertiary-fixed-variant": "#00458f",
        "on-primary-container": "#848484",
        "secondary-container": "#e1dfdf",
        "secondary-fixed": "#e4e2e2",
        "surface-container-highest": "#e2e2e4",
        "surface-bright": "#f9f9fb",
        "on-primary-fixed-variant": "#474747",
        "on-primary-fixed": "#1b1b1b",
        "on-secondary-fixed": "#1b1c1c",
        "surface-container": "#eeeef0",
        "inverse-primary": "#c6c6c6",
        "on-secondary-container": "#626262",
        "on-background": "#1a1c1d",
        "on-primary": "#ffffff",
        tertiary: "#000000",
        background: "#f9f9fb",
        "primary-fixed": "#e2e2e2",
        "on-error": "#ffffff",
        outline: "#7e7576",
        primary: "#000000",
        "on-secondary-fixed-variant": "#464747",
        surface: "#f9f9fb",
        "primary-fixed-dim": "#c6c6c6",
        "on-surface-variant": "#4c4546",
        "inverse-surface": "#2f3132",
        "on-surface": "#1a1c1d",
        "tertiary-fixed-dim": "#abc7ff",
        secondary: "#5e5e5e",
        "surface-container-low": "#f3f3f5",
        "surface-variant": "#e2e2e4",
        "surface-tint": "#5e5e5e",
        "primary-container": "#1b1b1b",
        "surface-container-high": "#e8e8ea",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        error: "#ba1a1a",
        "tertiary-container": "#001b3f",
        "on-tertiary-container": "#2b82f4",
        "inverse-on-surface": "#f0f0f2",
        "surface-dim": "#d9dadc",
        "tertiary-fixed": "#d7e2ff"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "stack-md": "24px",
        "margin-mobile": "20px",
        "section-v-padding": "120px",
        "stack-sm": "8px",
        "container-max": "1200px",
        gutter: "32px",
        "stack-lg": "64px",
        "margin-desktop": "40px"
      },
      fontFamily: {
        "label-md": ["Noto Sans KR", "Inter", "sans-serif"],
        display: ["Noto Sans KR", "Inter", "sans-serif"],
        "body-md": ["Noto Sans KR", "Inter", "sans-serif"],
        "headline-lg": ["Noto Sans KR", "Inter", "sans-serif"],
        "headline-md": ["Noto Sans KR", "Inter", "sans-serif"],
        "body-lg": ["Noto Sans KR", "Inter", "sans-serif"],
        caption: ["Noto Sans KR", "Inter", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "500" }],
        display: ["56px", { lineHeight: "68px", letterSpacing: "0", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["40px", { lineHeight: "50px", letterSpacing: "0", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "34px", letterSpacing: "0", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }]
      }
    }
  }
};
