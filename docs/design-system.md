# CPKit Design System Documentation

CPKit's design language is minimal, fast, elegant, and developer-friendly. It takes inspiration from Vercel, Linear, and Raycast, prioritizing a high-contrast typography hierarchy, ample whitespace, subtle borders, and smooth transitions.

---

## 🎨 Color Palette & Design Tokens

Every color supports **Light Mode**, **Dark Mode**, and **System Theme** seamlessly using Tailwind CSS v4 custom theme mappings and CSS variables (`globals.css`).

| Token | Light Mode Value (HSL) | Dark Mode Value (HSL) | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `background` | `240 5% 98%` | `240 10% 4%` | General page viewport background |
| `foreground` | `240 10% 3.9%` | `0 0% 98%` | Default body and headline text color |
| `primary` | `262.1 83.3% 57.8%` | `263.4 90% 65%` | Primary action accent (Purple / Violet) |
| `primary-fg` | `0 0% 98%` | `240 5.9% 10%` | High-contrast text on primary backgrounds |
| `secondary` | `240 4.8% 90%` | `240 3.7% 12%` | Muted interactive buttons & containers |
| `card` | `0 0% 100%` | `240 10% 6%` | Panel, list, and component card surfaces |
| `border` | `240 5.9% 88%` | `240 3.7% 15%` | Divider lines and border outlines |
| `success` | `142.1 76.2% 36.3%` | `142.1 70.6% 45.3%` | Positive statuses & success logs |
| `warning` | `38 92% 50%` | `47.9 95.8% 53.1%` | Alerts, caution limits, and warnings |
| `danger` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Errors and critical action buttons |
| `info` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` | Technical tips, helpers, and stats |

---

## 📐 Border Radius

| Token | CSS Variable Value | Recommended Usage |
| :--- | :--- | :--- |
| `radius-sm` | `calc(var(--radius) - 4px)` (4px) | Badges, checkboxes, tags, small inputs |
| `radius-md` | `calc(var(--radius) - 2px)` (6px) | Buttons, text fields, small select overlays |
| `radius-lg` | `var(--radius)` (8px) | Cards, modals, workspace panels |

---

## ✍️ Typography

| Hierarchy | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | `30px / 1.875rem` | Extrabold | `2.25rem` | Page titles, hero banners |
| **H2** | `24px / 1.5rem` | Bold | `2rem` | Workspace sections |
| **H3** | `18px / 1.125rem` | Bold | `1.75rem` | Card titles, headers |
| **Body** | `14px / 0.875rem` | Regular | `1.25rem` | Main reading and paragraphs |
| **Caption** | `12px / 0.75rem` | Medium | `1rem` | Statuses, labels, secondary info |
| **Code** | `12px / 0.75rem` | Regular | `1rem` | Inline code, inputs, test cases |

**Primary Font**: Inter (loaded dynamically via `next/font/google`).
**Code Font**: JetBrains Mono (for compiler logs, inputs, and code output displays).

---

## ⚡ Animation Principles

CPKit employs **subtle, fast, and smooth** animations to guarantee high responsiveness. Flashy transitions are prohibited.

- **Duration**: `150ms` (standard micro-interactions) to `250ms` (overlays, dialog viewports).
- **Easing**: Spring behaviors (e.g. `type: "spring", stiffness: 380, damping: 30` for sliding tabs) or standard CSS `ease-out`.
- **Transitions**: Fade-ins (`opacity`), Scale transitions (`scale: 0.95 -> 1`), and Slide-ups (`y: 10 -> 0`).

---

## ♿ Accessibility Rules (A11y)

1. **Keyboard Navigation**: All interactive elements (buttons, inputs, checkboxes, toggles) must support tab-focus cycling.
2. **Focus Rings**: A uniform, high-contrast violet focus ring (`focus-visible:ring-2 focus-visible:ring-ring`) must appear on focus.
3. **Screen Readers**: Elements must feature appropriate `aria-*` tags and semantic roles (e.g., `role="checkbox"`, `role="switch"`).
4. **Contrast**: Colors adhere to WCAG AA standards, offering comfortable reading thresholds in both dark and light modes.
