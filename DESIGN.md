> [!IMPORTANT]
> **Living Document Rule**
> This file must be updated whenever a component is added or changed, a color token is modified, or any Tailwind class in the design system changes. It is never allowed to be stale.

# PUPCON Design System

## Color Tokens

The application uses Tailwind CSS v4 configured with OKLCH CSS variables for precise color manipulation across themes.

| Semantic Role | CSS Variable | Light Mode (OKLCH) | Dark Mode (OKLCH) | Tailwind Class Example |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `--background` | `0.96 0 0` | `0.13 0 0` | `bg-background` |
| **Foreground** | `--foreground` | `0.22 0 0` | `97 0 0` | `text-foreground` |
| **Card** | `--card` | `0.97 0 0` | `0.10 0 0` | `bg-card` |
| **Card Foreground** | `--card-foreground` | `0.22 0 0` | `97 0 0` | `text-card-foreground` |
| **Primary (Brand)** | `--primary` | `38.7% 0.141 27` (Maroon) | `38.7% 0.141 27` (Maroon) | `bg-primary`, `text-primary` |
| **Primary Foreground** | `--primary-foreground`| `0.98 0 0` | `0.97 0.008 55` | `text-primary-foreground` |
| **Secondary** | `--secondary` | `0.945 0 0` | `0.21 0 0` | `bg-secondary` |
| **Muted** | `--muted` | `0.935 0 0` | `0.19 0 0` | `bg-muted` |
| **Muted Foreground** | `--muted-foreground` | `0.48 0 0` | `0.62 0 0` | `text-muted-foreground` |
| **Destructive** | `--destructive` | `0.55 0.22 27` | `0.62 0.2 18` | `bg-destructive` |
| **Border** | `--border` | `0.87 0 0` | `0.25 0 0` | `border-border` |
| **Sidebar** | `--sidebar` | `0.97 0 0` | `0.10 0 0` | `bg-sidebar` |
| **Success** | `--success` | `0.96 0.05 142` | `0.25 0.05 142` | `bg-success` |
| **Warning** | `--warning` | `0.72 0.17 85` | `0.68 0.17 85` | `bg-warning` |
| **Info** | `--info` | `0.7 0.12 240` | `0.6 0.14 240` | `bg-info` |

## Typography

The project relies on Google Fonts imported in `app.css`.

- **Primary / Brand**: Poppins (`font-poppins`)
- **Base / Sans**: Inter (`font-sans`)
- **Secondary**: Montserrat (`font-montserrat`)

### Usage Table

| Role | Font Family | Base Tailwind Classes | Example Usage |
| :--- | :--- | :--- | :--- |
| **Page Title** | Poppins | `font-poppins text-2xl font-bold tracking-tight text-foreground` | Top-level headings (`<h1>`) |
| **Section Heading** | Poppins | `font-poppins text-lg font-semibold text-foreground` | Card or section titles (`<h2>`, `<h3>`) |
| **Body Text** | Inter | `font-sans text-sm text-foreground` | Standard paragraphs, data tables |
| **Muted Label** | Inter | `font-sans text-xs font-medium text-muted-foreground` | Form labels, small descriptions, table headers |
| **Brand Accent** | Montserrat | `font-montserrat font-bold` | Logos, specific stylized banners |

## Layout

### App Layout (`app-layout.tsx`)
Used for dashboards and internal portals.

```text
+---------------------------------------------------+
|                  App Shell                        |
| +------------+ +--------------------------------+ |
| | Sidebar    | | Header (Breadcrumbs, Actions)  | |
| | (w/ Menu)  | |--------------------------------| |
| | bg-sidebar | |                                | |
| |            | |                                | |
| |            | |      Content Wrapper           | |
| |            | |      (bg-background)           | |
| |            | |                                | |
| |            | |                                | |
| |            | |                                | |
| |            | |                                | |
| +------------+ +--------------------------------+ |
+---------------------------------------------------+
```
**Key Classes**:
- Shell: `flex h-screen bg-background`
- Sidebar: `w-64 bg-sidebar border-r border-sidebar-border`
- Content: `flex-1 flex flex-col overflow-hidden`
- Header: `h-16 flex items-center px-4 border-b border-border bg-card`

### Landing Layout (`landing-layout.tsx`)
Used for public-facing guest pages.

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
**Key Classes**:
- Header: `sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm`
- Content Wrapper: `flex-1`
- Footer: `relative min-h-[500px] bg-[#7f1414] py-10 pt-20 text-white`

## Components

### 1. Button

**Anatomy**:
```text
[ Icon(opt) | Label | Icon(opt) ]
```

**Structure & Classes**:
```html
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
  Click Me
</button>
```

**Variants**:
| Variant | Tailwind Classes |
| :--- | :--- |
| Default | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Destructive | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| Outline | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |
| Secondary | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| Ghost | `hover:bg-accent hover:text-accent-foreground` |
| Link | `text-primary underline-offset-4 hover:underline` |

### 2. Input Field

**Anatomy**:
```text
Label
[ Input Box               ]
Supporting text / Error
```

**Structure & Classes**:
```html
<div className="space-y-2">
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
</div>
```

### 3. StatCard

**Anatomy**:
```text
+-----------------------+
| Title            Icon |
|                       |
| 1,234                 |
| +12% from last month  |
+-----------------------+
```

**Structure & Classes**:
```html
<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
  <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
    <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
    <svg className="h-4 w-4 text-muted-foreground" />
  </div>
  <div className="p-6 pt-0">
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">+12% from last month</p>
  </div>
</div>
```

### 4. DataTable

**Anatomy**:
```text
+-----------------------------------+
| Search...           [Filter Menu] |
+-----------------------------------+
| Col 1 | Col 2 | Col 3 | Actions   |
|-------|-------|-------|-----------|
| Data  | Data  | Data  | [Edit][X] |
+-----------------------------------+
| Page 1 of 10         [<] [>]      |
+-----------------------------------+
```

**Structure & Classes**:
- Container: `rounded-md border`
- Table: `w-full caption-bottom text-sm`
- Header: `[&_tr]:border-b`
- Row: `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`
- Action Button (Icon): `h-8 w-8 p-0 text-muted-foreground hover:text-foreground`

### 5. PageHeader + Breadcrumb

**Anatomy**:
```text
Home > Dashboard > Users
= Users =================
Manage your users here.
```

**Structure & Classes**:
```html
<div className="flex flex-col gap-4 pb-4">
  <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
    <a href="/" className="hover:text-foreground">Home</a>
    <span className="opacity-50">/</span>
    <span className="text-foreground">Users</span>
  </nav>
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
    <p className="text-muted-foreground">Manage your users here.</p>
  </div>
</div>
```

### 6. Auth Forms
Uses a centralized wrapper (`auth-layout.tsx`).
- Wrapper: `flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10`
- Form Card: `w-full max-w-sm rounded-xl bg-card p-8 shadow-md`

## Dark Mode

Dark mode is controlled via the `.dark` class applied to the root `<html>` element.
- **Theme Toggling**: Handled by `next-themes` (e.g., `<ThemeProvider attribute="class">`).
- **Persistence**: Saved in `localStorage` under the key `theme`.
- **FOUC Prevention**: A script in the `<head>` evaluates `localStorage.theme` before React hydrates to prevent flashes of unstyled content.
- **Styling Strategy**: Colors are defined in `app.css` using the `@custom-variant dark` and the `.dark` class selector overriding root variables.

## Dev Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Run Dev Servers** | `npm run dev` | Starts Vite for frontend HMR and the Laravel dev server concurrently (via `concurrently` defined in `package.json`). |
| **Build for Production** | `npm run build` | Compiles Tailwind CSS and React assets using Vite. |
| **Run Laravel Server Only**| `php artisan serve` | Starts the PHP backend only. |
| **Format Code** | `npm run format` | Runs Prettier on `resources/`. |
