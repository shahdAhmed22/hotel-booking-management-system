import jwt from "jsonwebtoken"
import User from "../../DB/models/user.model.js";
import { systemRoles } from "../utils/system-roles.js";
export const auth=(authRoles=Object.values(systemRoles))=>{
    return async (req,res,next)=>{
        try{
            const accessToken=req.headers.token;
            if(!accessToken){
                return res.status(404).json("please login first")
            }
            const decodedData=jwt.decode(accessToken,process.env.access_token_signature)
            if(!decodedData||!decodedData.id){
                return res.status(400).json({message:"invalied token payload"})
            }
            const user=await User.findById(decodedData.id).select("-password")
            if(!user){
                return res.status(404).json({message:"user not found"})
            }
            if(!authRoles.includes(user.role)){
                return res.status(401).json({message:"you are not authorized to do that action"})
            }
            req.auth=user
            next()
        }catch(err){
            return res.status(500).json({message:"error in auth middleware",error:err.message})
        }
    }
}