import { apiClient } from "../../../services/api/apiClient";

export interface ProjectRole {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  roles: ProjectRole[];
}

export interface ProjectsResponse {
  message: string;
  data: Project[];
}

export async function getProjects(): Promise<Project[]> {
  const response = await apiClient.get<ProjectsResponse>("/projects");

  return response.data.data;
}

export interface ProjectMember {
  userId: number;
  name: string;
  email: string;
  roles: ProjectRole[];
}

export interface ProjectDetails {
  id: number;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
}

export interface ProjectDetailsResponse {
  message: string;
  data: ProjectDetails;
}

export async function getProject(projectId: number): Promise<ProjectDetails> {
  const response = await apiClient.get<ProjectDetailsResponse>(
    `/projects/${projectId}`,
  );

  return response.data.data;
}

export interface ProjectAccess {
  projectId: number;
  roles: ProjectRole[];
  permissions: string[];
}

export interface ProjectAccessResponse {
  message: string;
  data: ProjectAccess;
}

export async function getProjectAccess(
  projectId: number,
): Promise<ProjectAccess> {
  const response = await apiClient.get<ProjectAccessResponse>(
    `/projects/${projectId}/access`,
  );

  return response.data.data;
}
