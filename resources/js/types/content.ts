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

export interface CampusDirectors {
    director_id: number;
    name: string;
    term_start_date: string;
    term_end_date: string;
    description: string;
    profile_image_name: string;
    profile_image_path: string;
}

export interface CampusGallery {
    gallery_id: number;
    image_name: string;
    image_path: string;
    description: string;
}

export interface LocalTaskForce {
    local_task_force_id: number;
    area_name: string;
    first_name: string;
    last_name: string;
    official: boolean;
    official_position?: string | null;
    profile_image_name?: string | null;
    profile_image_path?: string | null;
    members?: Members[];
}

export interface Members {
    member_id: number;
    local_task_force_id: number;
    full_name: string;
    role?: string | null;
    local_task_force?: LocalTaskForce;
}

export interface CampusGoals {
    goal_id: number;
    goal_title_eng: string;
    goal_desc_eng: string;
    goal_title_fil: string;
    goal_desc_fil: string;
}

export interface Pillars {
    pillar_id: number;
    pillar_title: string;
    pillar_items?: PillarItems[];
}

export interface PillarItems {
    item_id: number;
    pillar_id: number;
    item_description: string;
    pillar?: Pillars;
}

export interface Vmgo {
    vmgo_id: number;
    vision: string;
    mission: string;
    avp_link?: string | null;
    avp_title?: string | null;
    avp_description?: string | null;
}

export interface OtherServices {
    service_id: number;
    service_name: string;
    description: string | null;
    service_link: string | null;
}
