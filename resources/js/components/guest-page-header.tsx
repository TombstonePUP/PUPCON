import { Link } from '@inertiajs/react';

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: Crumb[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#ffffff] to-[#ffffff] py-4 shadow-md">
      <div className="mx-auto flex w-[75%] max-w-7xl items-center justify-between text-[#7f1414]">
        <h1 className="text-l md:text-l font-semibold tracking-tight">{title}</h1>

        <nav className="flex items-center text-sm">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={idx} className="flex items-center">
                {isLast ? (
                  <span className="font-semibold text-[#7f1414]">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href ?? '#'}
                    className="text-[#7f1414]/70 transition-colors hover:text-[#7f1414]"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast && <span className="mx-2 text-[#7f1414]/50">/</span>}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
