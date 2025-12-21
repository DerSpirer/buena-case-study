import axios from 'axios';
import type {
  Property,
  CreatePropertyPayload,
  UploadFileResponse,
  ExtractWithAIResponse,
} from '../types/Property';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  async getAll(): Promise<Property[]> {
    const { data } = await apiClient.get<Property[]>('/properties');
    return data;
  },

  async getById(id: string): Promise<Property> {
    const { data } = await apiClient.get<Property>(`/properties/${id}`);
    return data;
  },

  async create(payload: CreatePropertyPayload): Promise<Property> {
    const { data } = await apiClient.post<Property>('/properties', payload);
    return data;
  },

  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<UploadFileResponse>(
      '/properties/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  async extractWithAI(filename: string): Promise<ExtractWithAIResponse> {
    const { data } = await apiClient.post<ExtractWithAIResponse>(
      '/properties/extract',
      { filename }
    );
    return data;
  },
};
