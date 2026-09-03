> [!IMPORTANT]
> **Living Document Rule**
> This file must be updated whenever a component is added or changed for the Admin/Dashboard facing pages.

# PUPCON Admin Design System

## Color Tokens

The admin application uses Tailwind CSS v4 configured with OKLCH CSS variables for precise color manipulation across themes.

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
| **Destructive** | `--destructive` | `0.55 0.22 27` | `0.62 0.2 18` | `bg-destructive` |
| **Border** | `--border` | `0.87 0 0` | `0.25 0 0` | `border-border` |
| **Sidebar** | `--sidebar` | `0.97 0 0` | `0.10 0 0` | `bg-sidebar` |

## Typography

- **Primary / Brand**: Poppins (`font-poppins`)
- **Base / Sans**: Inter (`font-sans`)

### Usage Table

| Role | Font Family | Base Tailwind Classes | Example Usage |
| :--- | :--- | :--- | :--- |
| **Page Title** | Poppins | `font-poppins text-2xl font-bold tracking-tight text-foreground` | Top-level headings (`<h1>`) |
| **Section Heading** | Poppins | `font-poppins text-lg font-semibold text-foreground` | Card or section titles (`<h2>`, `<h3>`) |
| **Body Text** | Inter | `font-sans text-sm text-foreground` | Standard paragraphs, data tables |
| **Muted Label** | Inter | `font-sans text-xs font-medium text-muted-foreground` | Form labels, small descriptions, table headers |

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
| |            | |      Content Wrapper           | |
| |            | |      (bg-background)           | |
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

## Components

### 1. Button
- Default: `bg-primary text-primary-foreground hover:bg-primary/90`
- Destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90`
- Outline: `border border-input bg-background hover:bg-accent hover:text-accent-foreground`

### 2. StatCard
```html
<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
  <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
    <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
  </div>
  <div className="p-6 pt-0">
    <div className="text-2xl font-bold">1,234</div>
  </div>
</div>
```

### 3. DataTable
- Container: `rounded-md border`
- Table: `w-full caption-bottom text-sm`
- Row: `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`

### 4. PageHeader + Breadcrumb
```html
<div className="flex flex-col gap-4 pb-4">
  <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
    <span className="text-foreground">Users</span>
  </nav>
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
  </div>
</div>
```

## Dark Mode

Dark mode is controlled via the `.dark` class applied to the root `<html>` element.
- **Theme Toggling**: Handled by `next-themes` (e.g., `<ThemeProvider attribute="class">`).
- **Styling Strategy**: Colors are defined in `app.css` using the `@custom-variant dark` and the `.dark` class selector overriding root variables.

## Auth Forms
Uses a centralized wrapper (`auth-layout.tsx`).
- Wrapper: `flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10`
- Form Card: `w-full max-w-sm rounded-xl bg-card p-8 shadow-md`

## Dev Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Run Dev Servers** | `npm run dev` | Starts Vite for frontend HMR and the Laravel dev server concurrently (via `concurrently` defined in `package.json`). |
| **Build for Production** | `npm run build` | Compiles Tailwind CSS and React assets using Vite. |
| **Run Laravel Server Only**| `php artisan serve` | Starts the PHP backend only. |
| **Format Code** | `npm run format` | Runs Prettier on `resources/`. |
