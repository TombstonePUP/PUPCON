> [!IMPORTANT]
> **Living Document Rules**
> This `CONTEXT.md` MUST be updated any time the project structure, routing, layout system, tech stack, or constraints change.
> No code change that affects any of the above is considered complete until this doc is updated to match.

# PUPCON Context

## Project Overview
PUPCON (Polytechnic University of the Philippines - San Juan Campus) is a web application designed to manage, display, and facilitate access to university programs, faculty, history, facilities, and administration data. It serves both as a public-facing informative website and an administrative portal (e.g., for accreditors and admins).

## Tech Stack
| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Laravel 12 | Primary backend framework, providing routing, models, and controllers. |
| **UI** | React 19 | Frontend library for building interactive user interfaces. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework (configured via `@tailwindcss/vite`). Includes Radix UI for accessible components and Framer Motion for animations. |
| **Runtime / Package Managers** | PHP 8.2 (Composer), Node.js (npm/vite) | PHP for backend dependencies; Node for frontend asset bundling and dev server. |
| **Render Mode** | Inertia.js 2.0 | Bridges Laravel routing to React components, providing a SPA experience without building an API. |
| **Database** | PostgreSQL (Primary) | Configured in `.env`. SQLite also supported for local dev. |

## Project Structure
```text
e:\INTERN\GitHub\PUPCON/
├── app/                  # Backend application logic
│   ├── Http/             # Controllers, Middleware, Requests
│   └── Models/           # Eloquent Models representing database tables
├── bootstrap/            # App bootstrapping and caching
├── config/               # Application configuration files
├── database/             # Migrations, factories, and seeders
├── public/               # Publicly accessible files (images, compiled assets)
├── resources/            # Frontend assets and views
│   ├── css/              # Contains app.css (Tailwind v4 base styles and design tokens)
│   ├── js/               # React application root
│   │   ├── components/   # Reusable UI components (buttons, headers, data tables)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Shell layouts (app-layout, landing-layout, auth-layout)
│   │   ├── lib/          # Utility functions (e.g., clsx, tailwind-merge)
│   │   ├── pages/        # Page-level React components (mapped to routes)
│   │   ├── types/        # TypeScript type definitions
│   │   ├── app.tsx       # Inertia app entry point
│   │   └── ssr.jsx       # Server-side rendering entry point
│   └── views/            # Blade templates (e.g., app.blade.php for Inertia)
├── routes/               # Route definitions
│   ├── web.php           # Main web routes (guest access)
│   ├── auth.php          # Authentication routes
│   ├── admin.php         # Admin specific routes
│   ├── accreditor.php    # Accreditor specific routes
│   ├── settings.php      # Settings routes
│   └── shared.php        # Shared routes
├── package.json          # Node dependencies and scripts
├── composer.json         # PHP dependencies
└── vite.config.js        # Vite build configuration
```

## Layout System
The layout system is centralized in `resources/js/layouts/`.

| Layout | File | Usage | Styling Approach |
| :--- | :--- | :--- | :--- |
| **Landing Layout** | `landing-layout.tsx` | Used for guest-facing pages (home, about, programs, exhibits). | Features a sticky header with a maroon gradient, animated navigation menus, a complex mobile sidebar, and an image-based footer with gradients. Uses Framer Motion for transitions. |
| **App Layout** | `app-layout.tsx` | Used for authenticated dashboard areas (wrapping `app-sidebar-layout`). | Structured with a responsive sidebar and main content area. Focuses on utility and data presentation. |
| **Auth Layout** | `auth-layout.tsx` | Used for authentication pages (login, register, reset password). | Centered, minimalist card-based design with background graphics or splits. |
| **Accreditor Layout** | `accreditor-layout.tsx` | Used specifically for accreditor portal pages. | Similar to App Layout but with tailored navigation and context. |
| **About Layout** | `about-layout.tsx` | Used to wrap sub-pages in the "About" section. | Provides a consistent secondary navigation or aside for about-related pages. |

## Routing Conventions
Routes are defined in the `routes/` directory and map directly to React components in `resources/js/pages/` via Inertia.

| URL Pattern | Layout Used | Description & Notes |
| :--- | :--- | :--- |
| `/` | Landing | The main welcome page. |
| `/about/*` | Landing + About | Informational pages (history, vmgo, administration, facilities). |
| `/programs/*` | Landing | Dynamic routes showing programs and specific areas of evaluation. |
| `/login`, `/register` | Auth | Authentication entry points. |
| `/admin/*` | App | Administrative dashboard routes. Requires Admin role. |
| `/accreditor/*` | Accreditor | Accreditor evaluation routes. Requires Accreditor role. |
| `/settings/*` | App | User profile and system settings. |

## Render Mode
The application uses **Inertia.js** to render React components.
- **Gotchas**: Do not use standard React Router `<a>` or standard HTML `<a>` tags for internal navigation. Always use Inertia's `<Link>` component to prevent full-page reloads and maintain the SPA state. Data is passed from Laravel controllers directly to React page props.

> [!IMPORTANT]
> **Styling Approach**
> This project uses **Tailwind CSS v4** and relies on CSS variables defined in `resources/css/app.css` for its design system.
> All specifics regarding color tokens, typography, component structures, and Tailwind classes **MUST** be referenced from `DESIGN.md`. `DESIGN.md` is the single source of truth for all visual and design decisions.

## Key Constraints & Gotchas
- **Never do**:
  - Do not use inline styles or raw CSS files for component styling. Always use Tailwind utility classes.
  - Do not hardcode colors (e.g., `bg-red-500`). Always use semantic design tokens (e.g., `bg-primary`, `text-muted-foreground`).
  - Do not bypass Inertia for internal links (always use `<Link>`).
  - Do not create layout wrappers at the page level if a global layout exists.
- **Always remember**:
  - Keep components modular and placed in `resources/js/components/`.
  - Use unified components for shared logic: use `TableOfContents` for scroll-spying on long pages instead of implementing local `IntersectionObserver` logic.
  - Prioritize global types: Always use and extend types from `resources/js/types/index.ts` (e.g., `PerProgramUnderSurvey`) rather than defining local `any` overrides.
  - Prefix Tailwind arbitrary values only when a specific utility is absent, but prefer the design tokens.
  - Test responsive behaviors—most layouts rely on complex mobile states (like the slide-out menu in `landing-layout.tsx`).
