import { Router } from "express";
import { machingLogicController } from "../controllers/logic.controller.js";

const router: Router = Router();

router.post("/match", machingLogicController);

export default router;