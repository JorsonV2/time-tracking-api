import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;
}
