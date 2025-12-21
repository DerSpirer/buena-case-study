import axios from 'axios';
import type {
  Property,
  PropertySummary,
  PropertyPayload,
  UploadFileResponse,
  ExtractWithAIResponse,
  ManagementType,
} from '../types/Property';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  /** Get all properties (lightweight, for dashboard list) */
  async getAll(): Promise<PropertySummary[]> {
    const { data } = await apiClient.get<PropertySummary[]>('/properties');
    return data;
  },

  /** Get full property by ID (includes buildings and units) */
  async getById(id: string): Promise<Property> {
    const { data } = await apiClient.get<Property>(`/properties/${id}`);
    return data;
  },

  /** Create a new property */
  async create(payload: PropertyPayload): Promise<Property> {
    const apiPayload = {
      ...payload,
      managementType: payload.managementType as ManagementType,
    };
    const { data } = await apiClient.post<Property>('/properties', apiPayload);
    return data;
  },

  /** Update an existing property */
  async update(id: string, payload: PropertyPayload): Promise<Property> {
    const apiPayload = {
      ...payload,
      managementType: payload.managementType as ManagementType,
    };
    const { data } = await apiClient.put<Property>(`/properties/${id}`, apiPayload);
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

  /** Delete a property by ID */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  },
};
