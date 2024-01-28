import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Consumption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "float" })
  value!: number;

  @ManyToOne(() => User, user => user.consumptions)
  user?: User;
}