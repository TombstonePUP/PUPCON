Frontend folders are grouped by audience first, then by feature.

- `pages/guest/*`
  Public-facing Inertia pages.
- `pages/admin/*`
  Admin dashboard, content management, documents, programs, users, and settings.
- `pages/auth/*`
  Authentication and account recovery pages.
- `pages/accreditor/*`
  Accreditor-facing pages.
- `pages/test/*`
  Internal UI test pages.

Layouts follow the same pattern where practical:

- `layouts/guest/*`
- `layouts/admin/*`
- `layouts/auth/*`
- `layouts/accreditor/*`

Shared building blocks stay outside audience folders when they are reused across roles:

- `components/ui/*`
- `components/*`
- `hooks/*`
- `lib/*`
- `types/*`

Rule of thumb:
put entry pages and role-specific layout shells under the audience that owns them, and keep generic UI primitives in shared folders.
