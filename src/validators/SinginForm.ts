import { Length, IsNotEmpty, IsEmail, Matches, IsArray } from "class-validator";
import { Phone } from "../entity/Phone";

export class SinginForm {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  senha: string;

  static fromBody(body) {
    const validator = new SinginForm();
    validator.email = body.email;
    validator.senha = body.senha;
    return validator;
  }
}
