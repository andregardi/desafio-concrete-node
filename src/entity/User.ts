import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne
} from "typeorm";
import * as jwt from "jsonwebtoken";

import { Length, IsNotEmpty, IsEmail, Matches } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Phone } from "./Phone";
import { Geolocation } from "./Geolocation";
import config from "../config/config";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(type => Phone, phone => phone.user, {
    cascade: ["insert", "update"],
    eager: true
  })
  phones: Phone[];

  @OneToOne(type => Geolocation, geolocation => geolocation.user, {
    cascade: ["insert", "update"],
    eager: true
  })
  geolocation: Geolocation;

  @Column()
  @Length(9, 9)
  @Matches(/\d{5}\-\d{3}/)
  postalCode: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  lastLogin: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

  singUpResponseFormat() {
    const { jwtSecret } = config;
    const jwtToken = jwt.sign({ user_id: this.id }, jwtSecret, {
      expiresIn: "30m"
    });
    const formatedUser = {
      id: this.id,
      nome: this.name,
      email: this.email,
      telefones: this.phones,
      CEP: this.postalCode,
      geolocation: this.geolocation.toPoint(),
      data_criacao: this.createdAt,
      data_atualizacao: this.updatedAt,
      ultimo_login: this.lastLogin,
      token: jwtToken
    };
    return formatedUser;
  }

  static fromSingUpForm(body: any): User {
    const user = new User();
    user.name = body.nome;
    user.email = body.email;
    user.password = body.senha;
    user.postalCode = body.CEP;

    const phones = body.telefones.map(telefone => {
      let phone = new Phone();
      phone.ddd = telefone.ddd;
      phone.numero = telefone.numero;
      return phone;
    });

    user.phones = phones;

    return user;
  }
}
