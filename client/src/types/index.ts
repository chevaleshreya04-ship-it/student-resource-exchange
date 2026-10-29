export const TYPE_OPTIONS = ["question paper", "textbook", "research paper", "notes"];
export type ResourceType = (typeof TYPE_OPTIONS)[number]

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

export type ResourceField = "subject" | "university" | "branch" | "semester";

export type FilterKey = ResourceField | "type"

export type Filters = Partial<Record<FilterKey, string>>

export interface User {
  id: string;
  username: string;
}
