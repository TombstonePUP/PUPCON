import React, { useEffect, useState } from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => {
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} className={className} {...props}>
      {children}
    </AppLayoutTemplate>
  );
};
