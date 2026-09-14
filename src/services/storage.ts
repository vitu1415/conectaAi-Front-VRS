import { api } from './api'

export interface UploadResponse {
  url: string
}

export async function uploadFile(file: File, pasta = 'profile'): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<UploadResponse>(`/storage/upload?pasta=${pasta}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
