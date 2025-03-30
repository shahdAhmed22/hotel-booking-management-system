import { Router } from "express";
import * as authController from "./auth.controllers.js"

const router =Router()
router.post("/register",authController.register)

export default router