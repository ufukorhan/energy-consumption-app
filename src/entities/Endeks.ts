import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Endeks {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "float" })
  value!: number;

  @ManyToOne(() => User, user => user.endekses)
  user?: User;
}
