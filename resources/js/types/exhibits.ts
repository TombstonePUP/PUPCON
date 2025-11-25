import { FileStatus, User } from ".";

export interface Exhibits {
    exhibit_id: number;
    exhibit_name: string;
    image_name: string;
    image_path: string;
    container: boolean;
    outlines?: ExhibitOutlines[];
}

export interface ExhibitOutlines {
    exhibit_outline_id: number;
    exhibit_id: number;
    outline_description: string;
    category: string;
    exhibit?: Exhibits;
    files?: ExhibitFiles[];
}

export interface ExhibitFiles {
    exhibit_file_id: number;
    exhibit_outline_id: number;
    file_name: string;
    file_path: string;
    uploaded_by: string;
    uploaded_at: string;
    file_status_id: number;
    file_rejection_reason?: string | null;
    exhibit_outline?: ExhibitOutlines;
    file_status?: FileStatus;
    user?: User;
}

