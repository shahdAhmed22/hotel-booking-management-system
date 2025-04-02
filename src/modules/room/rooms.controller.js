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

export const deleteRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params; // Get room ID from request parameters

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Extract folder name from customID
        const folderPath = `hotel/rooms/${room.customID}`;

        // Delete images from Cloudinary
        for (const image of room.images) {
            await cloudinaryConfig().uploader.destroy(image.public_id);
        }

        // Delete the folder from Cloudinary
        await cloudinaryConfig().api.delete_folder(folderPath);

        // Delete room from database
        await Room.findByIdAndDelete(roomId);

        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
    
export const getRooms=async(req,res,next)=>{
    const rooms=await Room.find()
    res.status(200).json({message:"rooms fetched successfully",rooms})
}