export type PropertyType = 'WEG' | 'MV';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  uniqueNumber: string;
  address?: string;
  createdAt: Date;
}

