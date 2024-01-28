import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity({name: "blacklist"})
export class Blacklist {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}