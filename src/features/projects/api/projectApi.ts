import { apiClient } from '../../../services/api/apiClient'

export interface ProjectRole {
  id: number
  name: string
}

export interface Project {
  id: number
  name: string
  description: string | null
  status: string
  startDate: string
  endDate: string | null
  roles: ProjectRole[]
}

export interface ProjectsResponse {
  message: string
  data: Project[]
}

export async function getProjects(): Promise<Project[]> {
  const response =
    await apiClient.get<ProjectsResponse>(
      '/projects',
    )

  return response.data.data
}