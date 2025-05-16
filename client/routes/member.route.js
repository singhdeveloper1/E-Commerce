import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import uploadLocal from "../middlewares/uploadLocal.middleware.js"
import { addMember, deleteMember, getSpecificMember, updateMember } from "../controllers/member.controller.js"

const router = express.Router()

router.post("/addMember", authentication, uploadLocal.single("image"), addMember)
router.patch("/updateMember/:memberId", authentication,uploadLocal.single("image"), updateMember)
router.delete("/deleteMember/:memberId", authentication, deleteMember)
router.get("/getSpecificMember/:memberId", authentication, getSpecificMember)

export default router