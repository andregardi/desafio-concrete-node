import { ValidationError } from "class-validator"
export const errorMessageFormat = (message: any) => {
  return {
    menssagem: message
  };
};

export const classValidatorErrorsFormat = (errors:ValidationError[]) => {
  const formatedErrors = errors.map(error => {
    const { property, constraints } = error;
    return { property, constraints };
  });
  return errorMessageFormat(formatedErrors);
};
