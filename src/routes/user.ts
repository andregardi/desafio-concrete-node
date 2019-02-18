import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/singup", UserController.singup);
router.post("/singin", UserController.singin);
router.get("/:user_id", UserController.getOneById);

export default router;
