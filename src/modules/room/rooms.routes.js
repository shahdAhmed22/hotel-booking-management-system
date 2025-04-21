import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import * as roomController from "./rooms.controller.js"
import { systemRoles } from "../../utils/system-roles.js";
import { multerHost } from "../../middlewares/multer.middleware.js";


const  router=Router()
router.post("/add",auth([systemRoles.receptionist,systemRoles.manager]),multerHost().array('images',7),roomController.addRoom)
router.delete("/delete/:roomId",auth([systemRoles.receptionist,systemRoles.manager]),roomController.deleteRoom)
router.get("/",roomController.getRooms)
router.get("/:id",roomController.getSpecificRooms)
router.put("/update/:roomId",auth([systemRoles.receptionist,systemRoles.manager]),multerHost().array('images',7),roomController.updateRoom)
router.put("/update-status/:roomId",auth([systemRoles.receptionist,systemRoles.manager]),roomController.updateRoomStatus)

export default router