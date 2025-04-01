import { Router } from "express";
import * as authController from "./auth.controllers.js"

const router =Router()
router.post("/register",authController.register)
router.get("/verifiy-email/:token",authController.verifiyEmail)

export default router