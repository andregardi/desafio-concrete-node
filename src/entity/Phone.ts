import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import { Length } from "class-validator";
import { User } from "./User";

@Entity()
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(8, 9)
  numero: string;

  @Column()
  @Length(2, 2)
  ddd: string;

  @ManyToOne(type => User, user => user.phones)
  user: User;
}
