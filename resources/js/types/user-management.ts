export interface UserRecords {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: UserRecordRoles[];
    areas?: AssignedAreas[];
    [key: string]: unknown;
}

export interface UserRecordRoles {
    role_id: number;
    role_name: string;
    user: UserRecords[];
    [key: string]: unknown;
}

export interface AssignedAreas {
    area_id: number;
    area_name: string;
    area_number: string;
    program_id: number;
    user: UserRecords[];
    levels: AssignedLevels;
    [key: string]: unknown;
}

export interface AssignedLevels {
    level_id: number;
    level_name: string;
    programs: AssignedPrograms;
    areas?: AssignedAreas[];
    [key: string]: unknown;
}


export interface AssignedPrograms {
    program_id: number;
    program_name: string;
    degree_type: string;
    color: string;
    levels?: AssignedLevels[];
    [key: string]: unknown;
}

export interface AssignablePrograms {
    program_id: number;
    program_name: string;
    levels: Levels[];
    [key: string]: unknown;
}

export interface Levels {
    level_id: number;
    level_name: string;
    programs: AssignablePrograms;
    areas?: AssignableAreas[];
    [key: string]: unknown;
}

export interface AssignableAreas {
    area_id: number;
    area_name: string;
    area_number: string;
    program_id: number;
    levels: Levels;
    [key: string]: unknown;
}

export interface AssignableRoles {
    role_id: number;
    role_name: string;
    [key: string]: unknown;
}
