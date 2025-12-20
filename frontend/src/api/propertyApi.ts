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
  declarationFilePath: string;
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
};
