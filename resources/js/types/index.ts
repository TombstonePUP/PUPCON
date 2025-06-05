import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ActivityLogs {
    activity_log_id: number;
    full_name: string;
    area: string;
    program: string;
    file_name: string;
    activity: string;
    activity_date: string;
    [key: string]: unknown;
}

export interface FrequencyUploads {
    activity_date: string;
    activity: number;
    [key: string]: unknown;
}

export interface DocumentStatistics {
    file_status: string;
    documents: number;
    [key: string]: unknown;
}

export interface OverallUploads {
    document_type: string;
    outlines: number;
    documents: number;
    [key: string]: unknown;
}

export interface UserRecords {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    program_roles: string;
    area_roles: string;
    [key: string]: unknown;
}
