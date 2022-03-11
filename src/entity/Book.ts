import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

/**
 * Represents a row with 5 columns in the Books table.
 */
@Entity({name: "Books"})
export class Book {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column()
    coverImage!: string;

    @Column()
    userID!: string;
}
