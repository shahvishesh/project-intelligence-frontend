import { publicApiClient } from '../../../services/api/publicApiClient';

export type RefreshResponse = {
  message: string;
  data: {
    accessToken: string;
  };
};

export async function refreshAccessToken(): Promise<string> {
  const response = await publicApiClient.post<RefreshResponse>('/auth/refresh');

  return response.data.data.accessToken;
}
