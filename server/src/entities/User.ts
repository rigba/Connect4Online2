import { BaseEntity, Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Game } from "./Game";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ type: String , unique: true})
    username!: string;

    @OneToMany(() => Game, (game) => game.users)
    @JoinColumn()
    games: Game[];
}