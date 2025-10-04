import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    programs: ProgramPrivilege;
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

export interface GuestNavigation {
    programs: NavPrograms[];
    outlines?: ParameterOutlines[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface NavPrograms {
    program_id: number;
    program_name: string;
    program_link: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ProgramsUnderSurvey {
    program_id: number;
    program_name: string;
    degree_type: string;
    program_description: string;
    accreditation_level: string;
    program_image_name: string;
    program_image_path: string;
    program_link: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PerProgramUnderSurvey {
    program_id: number;
    degree_type: string;
    program_name: string;
    program_link: string;
    program_description: string;
    accreditation_level: number;
    under_survey: boolean;
    program_image_name: string;
    program_image_path: string;
    overview_image_name: string;
    overview_image_path: string;
    overview_description: string;
    page_banner_image_name: string;
    page_banner_image_path: string;
    color?: string;

    areas?: ProgramAreas[];
    faculties?: Faculty[];
    objectives: Objectives[];
    program_gallery: ProgramGallery[];
    [key: string]: unknown;
}

export interface ProgramPrivilege {
    program_name: string;
    program_link: string;
    [key: string]: unknown;
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    userRoles: UserRoles;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Roles {
    role_id: number;
    role_name: string;
    userRoles: UserRoles[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface UserRoles {
    user_id: number;
    role_id: number;
    user: User;
    role: Roles;
    [key: string]: unknown;
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

export interface PerProgram {
    program_id: number;
    degree_type: string;
    program_name: string;
    program_link: string;
    program_description: string;
    accreditation_level: string;
    under_survey: boolean;
    program_image_name: string;
    program_image_path: string;
    overview_image_name: string;
    overview_image_path: string;
    overview_description: string;
    page_banner_image_name: string;
    page_banner_image_path: string;
    areas?: ProgramAreas[];
    faculties?: Faculty[];
    [key: string]: unknown;
}

export interface ProgramAreas {
    area_id: number;
    program_id: number;
    area_number: string;
    area_name: string;
    area_description: string;
    area_image_name: string;
    area_image_path: string;
    area_numeral: string;
    programs?: PerProgram;
    [key: string]: unknown;
}

export interface Program {
    program_id: number;
    degree_type: string;
    program_name: string;
    program_link: string;
    area?: Area;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Area {
    area_id: number;
    program_id: number;
    area_name: string;
    area_description: string;
    area_image_name: string;
    area_image_path: string;
    area_number: string;
    area_numeral?: string;
    program?: Program;
    areaParameters?: AreaParameters[];
    areaForms?: AreaForms[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface AreaParameters {
    area_parameter_id: number;
    area_id: number;
    parameter_name: string;
    parameter_description: string;
    area?: Area;
    parameterOutlines?: ParameterOutlines[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface ParameterOutlines {
    parameter_outline_id: number;
    area_parameter_id: number;
    parameter_outline_category_id: number;
    outline_number: string;
    outline_description: string;
    container: boolean;
    initial?: string;
    areaParameters?: AreaParameters;
    parameterOutlineCategory?: ParameterOutlineCategory;
    areaFiles?: AreaFiles;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ParameterOutlineCategory {
    parameter_outline_category_id: number;
    category_name: string;
    category_description: string;
    parameterOutlines?: ParameterOutlines[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface AreaFiles {
    area_file_id: number;
    parameter_outline_id: number;
    file_name: string;
    file_path: string;
    file_status_id: number;
    file_rejection_reason: string | null;
    parameterOutlines?: ParameterOutlines;
    fileStatus?: FileStatus;
    [key: string]: unknown; // This allows for additional properties...
}

export interface FileStatus {
    file_status_id: number;
    status_name: string;
    areaFiles?: AreaFiles[];
    areaForms?: AreaForms[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface AreaForms {
    area_form_id: number;
    area_id: number;
    area_form_category_id: number;
    form_image_name: string;
    form_image_path: string;
    file_name: string;
    file_path: string;
    file_status_id: number;
    file_rejection_reason: string | null;
    areaFormCategory?: AreaFormCategory;
    area?: Area;
    fileStatus?: FileStatus;
    [key: string]: unknown; // This allows for additional properties...
}

export interface AreaFormCategory {
    area_form_category_id: number;
    category_name: string;
    areaForms?: AreaForms[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface FilesOverview {
    file_type: string;
    outline: string;
    file_id: string;
    file_name: string;
    file_path: string;
    file_status: string;
    rejection_reason: string;
}

export interface Faculty {
    faculty_id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    faculty_status: string;
    program_id: number;
    program_coordinator: boolean;
    faculty_image_name?: string | null;
    faculty_image_path?: string | null;
}

export interface Objectives {
    program_id: number;
    objective_description?: string | null;
    program_objective_id: number;
}

export interface ProgramGallery {
    program_gallery_id: number;
    program_id: number;
    image_name: string;
    image_path: string; 
}

