import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Building } from './building.entity';

export type UnitType = 'Apartment' | 'Office' | 'Garden' | 'Parking';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  unitNumber: string;

  @Column({ type: 'varchar', length: 20 })
  type: UnitType;

  @Column({ type: 'int' })
  floor: number;

  @Column({ type: 'varchar', length: 50 })
  entrance: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  size: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  coOwnershipShare: number;

  @Column({ type: 'int' })
  constructionYear: number;

  @Column({ type: 'int' })
  rooms: number;

  @ManyToOne('Building', 'units', { onDelete: 'CASCADE' })
  building: Building;

  @Column({ type: 'uuid' })
  buildingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
