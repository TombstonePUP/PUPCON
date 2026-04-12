export interface ActivityLogs {
    activity_log_id: number;
    full_name: string;
    description: string;
    activity: string;
    type: 'Document' | 'Users' | 'Content';
    action: 'Approved' | 'Pending' | 'Rejected';  
    activity_date: string;
}

export interface FrequencyUploads {
    activity_date: string;
    activity: number;
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