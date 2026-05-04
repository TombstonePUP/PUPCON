> [!IMPORTANT]
> **Living Document Rule**
> This file must be updated whenever a component is added or changed for the Guest/Public facing pages.

# PUPCON Guest Design System

## Color Tokens

The guest pages rely heavily on the PUP brand identity.

| Semantic Role | Color/Class | Description |
| :--- | :--- | :--- |
| **Primary (Brand)** | `#7f1414`, `bg-[#7f1414]` | PUP Maroon, used for headers, footers, primary buttons. |
| **Primary Gradient**| `from-[#7f1414] to-[#a71d1d]`| Used in the Guest Header and accent backgrounds. |
| **Secondary Accent**| `#d2b539` | PUP Gold/Yellow, used in the logo background and hover states. |
| **Background** | `#FAF9F6`, `bg-white` | Clean white or off-white for main content areas. |
| **Foreground** | `text-gray-900` | Dark text for readability. |

## Typography

The project relies on Google Fonts imported in `app.css`.

- **Primary / Brand**: Poppins (`font-poppins`)
- **Base / Sans**: Inter (`font-sans`)
- **Secondary**: Montserrat (`font-montserrat`)

### Usage Table

| Role | Font Family | Base Tailwind Classes | Example Usage |
| :--- | :--- | :--- | :--- |
| **Hero Title** | Poppins | `font-poppins text-4xl lg:text-6xl font-black uppercase` | Main landing page headings |
| **Section Heading** | Poppins | `font-poppins text-2xl font-bold tracking-tight` | Section titles |
| **Body Text** | Inter | `font-sans text-sm text-gray-700` | Standard paragraphs, descriptions |
| **Navigation** | Inter/Poppins | `font-medium tracking-wide text-white/90` | Header and footer links |

## Layout

### Landing Layout (`landing-layout.tsx`)
Used for all public-facing guest pages.

```text
+---------------------------------------------------+
| Sticky Header (NavMenu, Logo, bg-gradient)        |
+---------------------------------------------------+
|                                                   |
|                Main Content Area                  |
|                   (flex-1)                        |
|                                                   |
|                                                   |
+---------------------------------------------------+
| Image-based Footer (bg-[#7f1414] w/ overlay)      |
+---------------------------------------------------+
```
**Key Components**:
- **GuestHeader**: Sticky at the top, includes desktop navigation and responsive toggles. Features a fast Framer Motion hide-on-scroll down effect.
- **SearchModal**: Animated slide-in modal for searching outlines and benchmarks.
- **MobileMenu**: Full-screen slide-in drawer for mobile navigation.
- **GuestFooter**: Fixed bottom structure with background image overlay.

## UI Elements

### Modularized Header System
- Desktop navigation is rendered within `<GuestHeader />`.
- Search is triggered via an icon, opening `<SearchModal />`.
- Mobile menu is triggered via a hamburger icon, opening `<MobileMenu />`.
