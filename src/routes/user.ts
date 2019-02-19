import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { validateBody } from "../middlewares/validateBody";
import { SingupForm } from "../validators/singupForm";
import { SinginForm } from "../validators/SinginForm";

const router = Router();

router.post("/singup", validateBody(SingupForm), UserController.singup);
router.post("/singin", validateBody(SinginForm), UserController.singin);
router.get("/:user_id", checkJwt, UserController.getOneById);

export default router;
