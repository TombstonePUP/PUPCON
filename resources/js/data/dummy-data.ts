import { FrequencyUploads, OverallUploads } from "@/types";
import { ActivityLogs, DocumentStatistics } from "@/types/dashboard";

export const frequencyDummyUploads: FrequencyUploads[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  return {
    activity_date: date.toISOString().split("T")[0],
    activity: Math.floor(Math.random() * 20) + 1,
  };
});

export const documentDummyStatistics: DocumentStatistics[] = [
  { file_status: "Approved", documents: 142 },
  { file_status: "Pending",  documents: 58  },
  { file_status: "Rejected", documents: 23  },
];

export const overallDummyUploads: OverallUploads[] = [
  { document_type: "area_files",   outlines: 12, documents: 95  },
  { document_type: "area_forms",   outlines: 8,  documents: 74  },
  { document_type: "exhibit_files", outlines: 5, documents: 61  },
];

export const activityDummyLogs: ActivityLogs[] = [
  { activity_log_id: 1,  full_name: "Juan dela Cruz",   description: "Uploaded Budget Report Q1",        activity: "upload",  type: "Document", activity_date: "2025-03-28" },
  { activity_log_id: 2,  full_name: "Maria Santos",     description: "Approved Curriculum Map v2",       activity: "approve", type: "Content",  activity_date: "2025-03-27" },
  { activity_log_id: 3,  full_name: "Pedro Reyes",      description: "Rejected Exhibit A submission",    activity: "reject",  type: "Document", activity_date: "2025-03-27" },
  { activity_log_id: 4,  full_name: "Ana Gonzales",     description: "Uploaded Faculty Load Form",       activity: "upload",  type: "Document", activity_date: "2025-03-26" },
  { activity_log_id: 5,  full_name: "Carlos Bautista",  description: "Uploaded Accreditation Checklist", activity: "upload",  type: "Content",  activity_date: "2025-03-25" },
  { activity_log_id: 6,  full_name: "Liza Domingo",     description: "Approved Research Output Exhibit", activity: "approve", type: "Content",  activity_date: "2025-03-25" },
  { activity_log_id: 7,  full_name: "Ramon Flores",     description: "Updated Syllabus Form",            activity: "update",  type: "Users",    activity_date: "2025-03-24" },
  { activity_log_id: 8,  full_name: "Sofia Cruz",       description: "Uploaded Extension Program Docs",  activity: "upload",  type: "Document", activity_date: "2025-03-23" },
  { activity_log_id: 9,  full_name: "Mark Villanueva",  description: "Rejected Incomplete Exhibit C",    activity: "reject",  type: "Users",    activity_date: "2025-03-22" },
  { activity_log_id: 10, full_name: "Donna Mercado",    description: "Approved Faculty Profile Forms",   activity: "approve", type: "Users",    activity_date: "2025-03-21" },
];