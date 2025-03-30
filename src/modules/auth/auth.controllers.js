//register
//check if email exist ✔
//create verification token
//send verification token via email
//hassing the password
//usersave(email,password,username)

import User from "../../../DB/models/user.model.js"
import jwt from "jsonwebtoken"//this is jsonweb token library which we will use for create verifcation token and access token
import { verificationEmailTemplete } from "../../utils/email-templetes.js"
import bcrypt from "bcryptjs"
import sendmailservice from "../../Services/send-email.js"

export const register=async(req,res)=>{
    
    const {username,email,password}=req.body
    if(!(email&&username&&password)){
        return res.status(400).json({message:"please provide all needed data"})
    }
    const isEmailExists=await User.findOne({email}) 
    if(isEmailExists)
        return res.status(409).json({message:"email is already exists"})
    const verificationToken =jwt.sign({email},"verification_token",{expiresIn:"1d"})
    const isEmailSent=await sendmailservice({ to : email, 
        subject : 'please verify your email',
        message : verificationEmailTemplete.replace("[Guest Name]",username).replace("[Verification Link]",verificationToken) })
    if(!isEmailSent){
        return res.status(500).json({message:"error occurs in sending verification email"})
    }
    const hashedPassword=bcrypt.hashSync(password,10)
    let user=await User.create({username,email,password:hashedPassword})
    user=user.toObject()
    delete user.password
    return res.status(201).json({message:"user created successfully",user})
}