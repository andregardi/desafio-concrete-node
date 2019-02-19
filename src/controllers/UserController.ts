import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import { geolocationByPostalCode } from "../services/geolocationService";
import { Geolocation } from "../entity/Geolocation";
import {
  classValidatorErrorsFormat,
  errorMessageFormat
} from "../helpers/errorFormater";

class UserController {
  singup = async (req: Request, res: Response) => {
    let user = User.fromSingUpForm(req.body);

    const errors = await validate(user);
    if (errors.length > 0) {
      const formatedErrors = classValidatorErrorsFormat(errors);
      res.status(400).send(formatedErrors);
      return;
    }

    const point = await geolocationByPostalCode(user.postalCode);
    user.geolocation = Geolocation.fromPoint(point);

    user.hashPassword();

    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      const formatedError = errorMessageFormat("E-mail já existente");
      res.status(409).send(formatedError);
      return;
    }

    const formatedUser = user.singUpResponseFormat();
    res.status(201).send(formatedUser);
  };

  singin = async (req: Request, res: Response) => {
    let { email, senha } = req.body;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      const formatedError = errorMessageFormat("Usuário e/ou senha inválidos");
      res.status(401).send(formatedError);
    }

    const userPasswordMatchs = user.checkIfUnencryptedPasswordIsValid(senha);
    if (!userPasswordMatchs) {
      const formatedError = errorMessageFormat("Usuário e/ou senha inválidos");
      res.status(401).send(formatedError);
      return;
    }

    user.lastLogin = new Date();
    await userRepository.save(user);;

    const formatedUser = user.singUpResponseFormat();
    res.send(formatedUser);
  };

  getOneById = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const sameUserId = user_id == res.locals.jwtPayload.user_id;
    if (!sameUserId){
      const formatedError = errorMessageFormat("Não autorizado");
      res.status(401).send(formatedError);
    }
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ id: user_id });
    } catch (error) {
      const formatedError = errorMessageFormat("Não autorizado");
      res.status(401).send(formatedError);
    }

    const formatedUser = user.singUpResponseFormat();
    res.send(formatedUser);
  };
}
export default new UserController();
