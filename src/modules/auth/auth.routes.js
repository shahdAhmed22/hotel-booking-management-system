import { Router } from "express";
import * as authController from "./auth.controllers.js"

const router =Router()
router.post("/register",authController.register)
router.get("/verifiy-email/:token",authController.verifiyEmail)
router.post("/login",authController.login)
router.post("/forget-password",authController.forgetpassword)

export default router