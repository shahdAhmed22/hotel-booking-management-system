import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.js";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    isVerified:{
        //this is check for email verfication that will be true when we fire the link in verifiecation email
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:Object.values(systemRoles),
        default:systemRoles.guest
    },
    phoneNumber:{
        type:String,
        required:false
    },
    Image:{
        public_id:String,
        secure_url:String
    },
    address:String,
    resetPasswordToken:String,
    resetPasswordExpiresIn:Date
},{timestamps:true})//createdAt , updatedAt
//create collection(table) of user using its schema
const user =mongoose.models.User||mongoose.model("User",userSchema)

export default user
