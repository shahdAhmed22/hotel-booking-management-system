import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import * as roomController from "./rooms.controller.js"
import { systemRoles } from "../../utils/system-roles.js";
import { multerHost } from "../../middlewares/multer.middleware.js";


const  router=Router()
router.post("/add",auth([systemRoles.receptionist,systemRoles.manager]),multerHost().array('images',7),roomController.addRoom)

export default router