import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  class: string;

  @Column("text", { array: true })
  subjects: string[];

  @Column('int')
  attendance: number;
}