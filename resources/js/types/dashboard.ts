export interface ActivityLogs {
    activity_log_id: number;
    full_name: string;
    description: string;
    activity: string;
    type: 'Authentication' | 'File Management' | 'Content Management' | 'User Management' | 'System';
    activity_date: string;
}

export interface FrequencyUploads {
    activity_date: string;
    upload_count: number;
}

export interface DocumentStatistics {
    file_status: 'Pending' | 'Approved' | 'Rejected';
    documents: number;
}

export interface OverallUploads {
    document_type: string;
    outlines: number;
    documents: number;
}
