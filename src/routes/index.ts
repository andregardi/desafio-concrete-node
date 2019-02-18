import { Router, Request, Response } from "express";
import user from "./user";
import { errorMessageFormat } from "../helpers/errorFormater";

const routes = Router();

routes.use("/user", user);
routes.use((req: Request, res: Response) => {
  const formatedError = errorMessageFormat("Endpoint não encontrado");
  res.status(401).send(formatedError);
});

export default routes;
