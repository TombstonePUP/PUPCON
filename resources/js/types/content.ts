export interface FacultyStaff {
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


