import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { classValidatorErrorsFormat } from "../helpers/errorFormater";

export const validateBody = (validator: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const singupForm = validator.fromBody(body);
    const errors = await validate(singupForm);
    if (errors.length > 0) {
      const formatedErrors = classValidatorErrorsFormat(errors);
      res.status(400).send(formatedErrors);
      return;
    }
    next();
  };
};
