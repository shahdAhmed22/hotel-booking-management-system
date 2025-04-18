import { Router } from "express";
import * as authController from "./auth.controllers.js"
import { auth } from "../../middlewares/auth.middleware.js";
import { multerHost } from "../../middlewares/multer.middleware.js";

const router =Router()
router.post("/register",authController.register)
router.get("/verifiy-email/:token",authController.verifiyEmail)
router.post("/login",authController.login)
router.post("/forget-password",authController.forgetpassword)
router.put("/reset-password/:token",authController.resetpassword)
router.get("/profile",auth(),authController.getProfile)
router.get("/refresh-token",authController.refreshToken)
router.put("/upload-img",auth(),multerHost().single("image"),authController.uploadProfileImg)

export default router