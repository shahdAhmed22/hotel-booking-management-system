import { v2 as cloudinary } from "cloudinary";


export const cloudinaryConfig=()=>{
    cloudinary.config({
        cloud_name: process.env.Cloud_Name ,
        api_key: process.env.API_Key,
        api_secret: process.env.API_Secret
    })
    return cloudinary;
}