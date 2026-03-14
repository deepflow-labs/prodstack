# Themes

prodstack ships with 3 pre-configured theme presets and full light/dark/system support.

## Theme presets

| Preset    | Primary color | Background |
| --------- | ------------- | ---------- |
| `neutral` | Dark gray     | White      |
| `ocean`   | Blue-teal     | Slate-50   |
| `forest`  | Green         | Warm white |

## How themes work

**Color scheme (light/dark)** is handled by next-themes via the `class` attribute on `<html>`:

- `<html class="">` — light
- `<html class="dark">` — dark

**Theme preset** is set via the `data-theme` attribute on `<html>`:

- `<html data-theme="ocean">` — ocean preset

All CSS variables are defined in `app/globals.css`.

## Switching theme presets at runtime

To let users switch presets, maintain `data-theme` in localStorage and set it on mount:

```tsx
// Example: switch to ocean preset
document.documentElement.setAttribute("data-theme", "ocean");
localStorage.setItem("theme-preset", "ocean");
```

Or use a React hook:

```tsx
function useThemePreset() {
  const setPreset = (preset: "neutral" | "ocean" | "forest") => {
    document.documentElement.setAttribute("data-theme", preset);
    localStorage.setItem("theme-preset", preset);
  };
  return { setPreset };
}
```

## Adding a new theme preset

1. Open `app/globals.css`
2. Add a new block following the existing pattern:

```css
[data-theme="sunset"] {
  --background: oklch(0.98 0.01 30);
  --foreground: oklch(0.15 0.03 30);
  --primary: oklch(0.55 0.2 30); /* warm orange */
  --primary-foreground: oklch(1 0 0);
  /* ... fill in all tokens ... */
}

[data-theme="sunset"].dark {
  --background: oklch(0.12 0.02 30);
  --foreground: oklch(0.95 0.01 30);
  /* ... dark variants ... */
}
```

## Light/dark toggle

The `ThemeToggle` component in `components/theme-toggle/index.tsx` cycles:
`light` → `dark` → `system` → `light` ...

Add it anywhere in your UI:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";
<ThemeToggle />;
```
