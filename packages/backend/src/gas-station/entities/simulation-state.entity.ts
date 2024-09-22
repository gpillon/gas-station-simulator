import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SimulationState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  state: string;

  @Column()
  timestamp: Date;
}
