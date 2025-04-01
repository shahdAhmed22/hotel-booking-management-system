import User from "../../../DB/models/user.model.js"
import jwt from "jsonwebtoken"//this is jsonweb token library which we will use for create verifcation token and access token
import { forgetPasswordEmailTemplete, verificationEmailTemplete } from "../../utils/email-templetes.js"
import bcrypt from "bcryptjs"
import sendmailservice from "../../Services/send-email.js"
import { nanoid } from "nanoid"

//register
//check if email exist ✔
//create verification token
//send verification token via email
//hassing the password
//usersave(email,password,username)

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

export const login=async(req,res,next)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(404).json({message:"please provide email and password"})
    }
    const user=await User.findOne({email})
    if(!user)
        return res.status(404).json({message:"invalid credientials"})
    const isPasswordMatch=bcrypt.compareSync(password,user.password)
    if(!isPasswordMatch)
        return res.status(404).json({message:"invalid credientials"})
    const accessToken=jwt.sign({id:user._id},process.env.access_token_signature,{expiresIn:"1d"})
    const refreshToken=jwt.sign({id:user._id},process.env.refresh_token_signature,{expiresIn:"7d"})
    return res.status(200).json({message:"user logined sucessfully",accessToken,refreshToken})
}

//forget pasword 
//first: send email with reset password link
    //reset password String: random string,reset password expirein: 10min
    //send forgetpassword email
//second: reset password

export const forgetpassword=async(req,res,next)=>{
    const {email}=req.body
    if(!email)
        return res.status(404).json({message:"please provide email for forget password"})
    const user =await User.findOne({email})
    if(!user)
        return res.status(404).json({message:"there isn't user with this email"})
    const resetPasswordToken=nanoid(8)//create random string with 8 characters
    user.resetPasswordToken=resetPasswordToken //this is for save reset password token
    user.resetPasswordExpiresIn=Date.now()+(10*60*1000)//each second = 1000

    await user.save()//save changes in db that we make local in user variable
    const isEmailSent=await sendmailservice({ 
        to : email, 
        subject : 'forget password request',
        message : forgetPasswordEmailTemplete.replace("[User Name]",user.username).replace("[Reset Password Link]",`${req.protocol}://${req.headers.host}/user/reset-password/${resetPasswordToken}`)
         })
    if(!isEmailSent){
        return res.status(500).json({message:"error occurs in sending verification email"})
    }
    return res.status(200).json({message:"resetpassword link has been sent successfully"})
}


export const resetpassword=async(req,res,next)=>{
    const {token}=req.params
    const {newPassword}=req.body
    if(!token){
        return res.status(400).json({message:"please provide token"})
    }
    const user = await User.findOne({resetPasswordToken:token,resetPasswordExpiresIn:{$gt:Date.now()}})
    if(!user)return res.status(404).json({message:"user not found"})
    const hashedPassword=bcrypt.hashSync(newPassword,10)

    user.password=hashedPassword
    user.resetPasswordToken=null
    user.resetPasswordExpiresIn=null
    await user.save()
    return res.status(200).json({message:"password changed successfully"})
}

export const getProfile=async(req,res,next)=>{
    const user=req.auth
    return res.status(200).json({message:"profile fetched successfully",user})
}