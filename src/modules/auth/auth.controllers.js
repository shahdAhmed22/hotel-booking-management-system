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
    const verificationToken =jwt.sign({email},process.env.Verification_signature,{expiresIn:"1d"})
    const isEmailSent=await sendmailservice({ to : email, 
        subject : 'please verify your email',
        message : verificationEmailTemplete.replace("[Guest Name]",username).replace("[Verification Link]",`${req.protocol}://${req.headers.host}/user/verifiy-email/${verificationToken}`) })
    if(!isEmailSent){
        return res.status(500).json({message:"error occurs in sending verification email"})
    }
    const hashedPassword=bcrypt.hashSync(password,10)
    let user=await User.create({username,email,password:hashedPassword})
    user=user.toObject()
    delete user.password
    return res.status(201).json({message:"user created successfully",user})
} 
//this function is for verify email that has just been registered
//verify token
//take token
//decode token and get email from it 
//find row in database with this email and isVerified:false
//change isVerified:true
export const verifiyEmail=async(req,res,next)=>{
    const {token} = req.params
    if(!token){
        return res.status(404).json({meassage:"please provide verification token"})
    }
    const decodedData=await jwt.decode(token,process.env.Verification_signature)
    const user=await User.findOneAndUpdate({email:decodedData.email,isVerified:false},{isVerified:true},{new:true})
    if(!user){
        return res.status(404).json({message:"user not found or has been already verified"})
    }
    res.status(200).json({meassage:"user verified successfully"})
}
