import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export type messageType = [string, string]

@ObjectType()
@Entity()
export class Game extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.games)
  @JoinColumn()
  users!: User[];

  @Field(() => [[Int]], { nullable: true })
  @Column("int", { array: true })
  gameBoard: number[][]

  @Field()
  @Column()
  whoseMove: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  winner: number;

  @Field(() => String)
  @Column({unique: true})
  gameUUID: string
}
