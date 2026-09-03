import { LucideIcon } from 'lucide-react';
import { FacultyStaff } from './content';

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
}

export interface GuestNavigation {
    programs: Program[];
    outlines?: ParameterOutlines[];
}

export interface NavPrograms {
    program_id: number;
    program_name: string;
    program_link: string;
}

// Consolidated Program Interface
export interface Program {
    program_id: number;
    degree_type: string;
    program_name: string;
    program_link: string;
    program_description?: string;
    program_image_name?: string;
    program_image_path?: string;
    under_survey?: boolean;
    is_active?: boolean;
    color?: string;
    levels?: AccreditationLevels | AccreditationLevels[];
    active_levels?: AccreditationLevels | AccreditationLevels[];
    latest_level?: AccreditationLevels;
    faculty_staff?: FacultyStaff[];
    objectives?: ProgramObjectives[];
    gallery?: ProgramGalleryImages[];
    student_count?: number;
}

// Aliases for backwards compatibility to "retain how it works" without breaking imports
export type ProgramsUnderSurvey = Program;
export type PerProgramUnderSurvey = Program;
export type PerProgram = Program;

export interface ProgramPrivilege {
    program_name: string;
    program_link: string;
    latest_level?: AccreditationLevels;
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
    roles?: Roles;
}

export interface Roles {
    role_id: number;
    role_name: string;
}

export interface ProgramObjectives {
    program_objective_id: number;
    program_id: number;
    objective_title: string;
    objective_description: string;
    programs?: Program;
}

export interface ProgramGalleryImages {
    program_gallery_id: number;
    program_id: number;
    image_name: string;
    image_path: string;
    caption: string;
    programs?: Program;
}

export interface AccreditationLevels {
    accreditation_level_id: number;
    program_id: number;
    level: number;
    remarks: string;
    survey_date: string;
    is_active: boolean;
    programs?: Program;
    areas?: Area[];
}

// Consolidated Area Interface
export interface Area {
    area_id: number;
    program_id: number;
    area_name: string;
    area_description: string;
    area_image_name: string;
    area_image_path: string;
    area_number: string;
    area_numeral?: string;
    archive: boolean;
    areaParameters?: AreaParameters[];
    areaForms?: AreaForms[];
    levels?: AccreditationLevels | AccreditationLevels[];
}

// Alias for backwards compatibility
export type ProgramAreas = Area;

export interface AreaParameters {
    area_parameter_id: number;
    area_id: number;
    parameter_name: string;
    parameter_description: string;
    area?: Area;
    parameter_outlines?: ParameterOutlines[];
}

export interface ParameterOutlines {
    parameter_outline_id: number;
    area_parameter_id: number;
    parameter_outline_category_id: number;
    outline_number: string;
    outline_description: string;
    container: boolean;
    initial?: string;
    area_parameters?: AreaParameters;
    parameter_outline_category?: ParameterOutlineCategory;
    area_files?: AreaFiles;
}

export interface ParameterOutlineCategory {
    parameter_outline_category_id: number;
    category_name: string;
    category_description: string;
    parameter_outlines?: ParameterOutlines[];
}

export interface AreaFiles {
    area_file_id: number;
    parameter_outline_id: number;
    file_name: string;
    file_path: string;
    file_status_id: number;
    file_rejection_reason: string | null;
    parameter_outlines?: ParameterOutlines;
    file_status?: FileStatus;
}

export interface FileStatus {
    file_status_id: number;
    status_name: string;
    area_files?: AreaFiles[];
    areaForms?: AreaForms[];
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
    area_form_category?: AreaFormCategory;
    area?: Area;
    file_status?: FileStatus;
}

export interface AreaFormCategory {
    area_form_category_id: number;
    category_name: string;
    areaForms?: AreaForms[];
}

export interface FilesOverview {
    file_type: string;
    outline: string;
    file_id: string;
    file_name: string;
    file_path: string;
    uploaded_by: string;
    upload_date: string;
    file_status: string;
    rejection_reason: string;
}

export type OverallUploads = {
    document_type: string;
    documents: number;
    outlines?: number;
};

export interface FrequencyUploads {
    activity_date: string;
    activity: number;
}
