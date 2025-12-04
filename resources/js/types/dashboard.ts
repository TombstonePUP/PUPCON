export interface ActivityLogs {
    activity_log_id: number;
    full_name: string;
    description: string;
    activity: string;
    type: string;
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
