import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Building } from './building.entity';

export type ManagementType = 'WEG' | 'MV';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  managementType: ManagementType;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  propertyManager: string;

  @Column({ type: 'varchar', length: 255 })
  accountant: string;

  @Column({ type: 'varchar', length: 500 })
  declarationFilePath: string;

  @OneToMany('Building', 'property', { cascade: true })
  buildings: Building[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
