import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Endeks } from "./Endeks";
import { Consumption } from "./Consumption";

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", nullable: false, unique: true})
    email?: string;

    @Column({ type: "varchar", nullable: false})
    password?: string;

    @Column({type: "varchar", nullable: false})
    companyName?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany(() => Endeks, (endeks) => endeks.user)
    endekses?: Endeks[];

    @OneToMany(() => Consumption, (consumption) => consumption.user)
    consumptions?: Consumption[];
}
