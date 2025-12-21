import axios from 'axios';
import type { Property } from '../types/Property';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreatePropertyPayload {
  managementType: 'WEG' | 'MV';
  name: string;
  propertyManager: string;
  accountant: string;
  declarationFileName: string;
  buildings: CreateBuildingPayload[];
}

export interface CreateBuildingPayload {
  name: string;
  address: string;
  units: CreateUnitPayload[];
}

export interface CreateUnitPayload {
  name: string;
  floor?: number;
  area?: number;
}

export interface UploadFileResponse {
  message: string;
  filename: string;
}

export interface ExtractedBuildingData {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  units: ExtractedUnitData[];
}

export interface ExtractedUnitData {
  unitNumber: string;
  type: 'Apartment' | 'Office' | 'Garden' | 'Parking';
  floor: number;
  entrance: string;
  size: number;
  coOwnershipShare: number;
  constructionYear: number;
  rooms: number;
}

export interface ExtractedPropertyData {
  managementType?: 'WEG' | 'MV';
  name?: string;
  propertyManager?: string;
  accountant?: string;
  buildings?: ExtractedBuildingData[];
}

export interface ExtractWithAIResponse {
  message: string;
  data: ExtractedPropertyData;
}

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
