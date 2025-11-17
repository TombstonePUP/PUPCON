import { Program } from ".";

export interface ContentPages {
    content_page_id: number;
    page: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    image_name?: string | null;
    image_path?: string | null;
    quote?: string | null;
    author?: string | null;
    phone_number?: string | null;
    address?: string | null;
}

export interface FacultyStaff {
    faculty_staff_id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    // suffix?: string | null;
    personnel_type: string;
    status: string;
    program_id?: number;
    program_coordinator: boolean;
    image_name?: string | null;
    image_path?: string | null;
    programs?: Program;
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

export interface Facilities {
    facility_id: number;
    facility_name: string;
    description?: string | null;
    image_name?: string | null;
    image_path?: string | null;
}

export interface Administration {
    administration_id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    position: string;
    profile_picture_name?: string | null;
    profile_picture_path?: string | null;
}

export interface OrganizationTypes {
    type_id: number;
    type_name: string;
    organizations?: Organizations[];
}

export interface Organizations {
    organization_id: number;
    organization_name: string;
    affiliation: string;
    type_id: number;
    type?: OrganizationTypes;
}
