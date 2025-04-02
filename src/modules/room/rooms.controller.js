import { nanoid } from "nanoid"
import Room from "../../../DB/models/rooms.model.js"
import { cloudinaryConfig } from "../../utils/cloudinary.util.js"

export const addRoom=async(req,res,next)=>{
    try{
    const {roomName,type,pricePerNight,amenities,description}=req.body
    if(!roomName){
        return res.status(404).json({messge:"you need to provide room details"})
    }
    const isRoomExists=await Room.findOne({roomName})
    if(isRoomExists)return res.status(409).json({message:"room name is already exists"})
    const files=req.files
    if(!files||files.length==0){
        return res.status(404).json({messge:"you need to provide at least 1 image"})
    }
    const customID=nanoid(8)
    const folderPath=`hotel/rooms/${customID}`
    const images=[]
    for (const file of files){
        const {public_id,secure_url}=await cloudinaryConfig().uploader.upload(file.path,
        {
            folder:folderPath,
            resource_type:"auto"
        })
        images.push({public_id,secure_url})
    }
    const RoomObj={
        roomName,
        type,
        pricePerNight,
        amenities,
        description,
        images,
        customID

    }
    const room = await Room.create(RoomObj)
    return res.status(201).json({message:"room created successfully",room})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}