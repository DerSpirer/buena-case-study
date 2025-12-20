import type { Property } from '../types/Property';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Schillerstraße Residenz',
    type: 'WEG',
    uniqueNumber: 'WEG-2024-001',
    address: 'Schillerstraße 42, 10625 Berlin',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    name: 'Prenzlauer Berg Apartments',
    type: 'MV',
    uniqueNumber: 'MV-2024-012',
    address: 'Kastanienallee 77, 10435 Berlin',
    createdAt: new Date('2024-06-22'),
  },
  {
    id: '3',
    name: 'Kreuzberg Gemeinschaft',
    type: 'WEG',
    uniqueNumber: 'WEG-2024-003',
    address: 'Oranienstraße 185, 10999 Berlin',
    createdAt: new Date('2024-08-10'),
  },
  {
    id: '4',
    name: 'Mitte Investment Properties',
    type: 'MV',
    uniqueNumber: 'MV-2024-027',
    address: 'Rosenthaler Str. 34, 10178 Berlin',
    createdAt: new Date('2024-09-05'),
  },
  {
    id: '5',
    name: 'Charlottenburg Eigentümer',
    type: 'WEG',
    uniqueNumber: 'WEG-2024-008',
    address: 'Kantstraße 112, 10627 Berlin',
    createdAt: new Date('2024-11-18'),
  },
];

