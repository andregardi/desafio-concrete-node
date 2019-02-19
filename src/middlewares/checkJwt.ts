import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { errorMessageFormat } from "../helpers/errorFormater";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  if (!(<string>req.headers["authentication"])) {
    const formatedError = errorMessageFormat("2Usuário e/ou senha inválidos");
    res.status(401).send(formatedError);
  }

  const token = (<string>req.headers["authentication"]).split(" ")[1];

  try {
    const jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    const formatedError = errorMessageFormat("Usuário e/ou senha inválidos");
    res.status(401).send(formatedError);
    return;
  }

  next();
};
