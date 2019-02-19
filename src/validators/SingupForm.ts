import { Length, IsNotEmpty, IsEmail, Matches, IsArray } from "class-validator";
import { Phone } from "../entity/Phone";

export class SingupForm {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsNotEmpty()
  @IsArray()
  telefones: Phone[];

  @Length(9, 9)
  @Matches(/\d{5}\-\d{3}/)
  CEP: string;

  static fromBody(body) {
    const validator = new SingupForm();
    validator.nome = body.nome;
    validator.email = body.email;
    validator.senha = body.senha;
    validator.telefones = body.telefones;
    validator.CEP = body.CEP;
    return validator;
  }
}
