export type ResourceType = "question paper" | "textbook" | "research paper" | "notes";

export interface Resource {
  _id: string;
  title: string;
  subject: string;
  university: string;
  branch: string;
  type: ResourceType;
  semester: number;
  uploadedBy: { _id: string; username: string };
  fileURL: string;
  downloads: number;
  createdAt: string;
}

export interface User { id: string; username: string }