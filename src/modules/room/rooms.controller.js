import { nanoid } from "nanoid"
import Room from "../../../DB/models/rooms.model.js"
import { cloudinaryConfig } from "../../utils/cloudinary.util.js"
import { RoomStates } from "../../utils/enums.utils.js"

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

export const updateRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params; // Get room ID from URL
        const { roomName, type, pricePerNight, amenities, description } = req.body;

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check if new roomName already exists
        if (roomName && roomName !== room.roomName) {
            const isRoomExists = await Room.findOne({ roomName });
            if (isRoomExists) return res.status(409).json({ message: "Room name already exists" });
        }

        // Check if new images are uploaded
        const files = req.files;
        let updatedImages = room.images; // Default to old images

        if (files && files.length > 0) {
            // Delete old images from Cloudinary
            for (const image of room.images) {
                await cloudinaryConfig().uploader.destroy(image.public_id);
            }

            // Upload new images to Cloudinary
            const folderPath = `hotel/rooms/${room.customID}`;
            updatedImages = [];
            for (const file of files) {
                const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(file.path, {
                    folder: folderPath,
                    resource_type: "auto"
                });
                updatedImages.push({ public_id, secure_url });
            }
        }

        // Build update object dynamically (only update provided fields)
        const updateFields = {};
        if (roomName) updateFields.roomName = roomName;
        if (type) updateFields.type = type;
        if (pricePerNight) updateFields.pricePerNight = pricePerNight;
        if (amenities) updateFields.amenities = amenities;
        if (description) updateFields.description = description;
        if (files && files.length > 0) updateFields.images = updatedImages;

        // Update room details
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: updateFields },
            { new: true } // Return the updated room
        );

        return res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateRoomStatus=async(req,res,next)=>{
    const { roomId } = req.params; // Get room ID from URL
    const { status } = req.body;
    if(!roomId||!status){
        return res.status(404).json({ message: "please provide roomId and status" });
    }
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    if(!Object.values(RoomStates).includes(status)){
        return res.status(400).json({ message:`Room status should be one of these: ${Object.values(RoomStates)}` }); 
    }
    const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { status },
        { new: true } // Return the updated room
    );

    return res.status(200).json({ message: "Room updated successfully", room: updatedRoom });

}

export const getSpecificRooms=async(req,res,next)=>{
    const {id}=req.params
    const room = await Room.findById(id);
    
    return res.status(200).json({ message: "Room fetched successfully", room})
}
//find find all elements that meet condition find({status:"available"})//find all available rooms
//findOne find first element that meet condition 
//findbyId like find one but with id (id)

//update element 
//find one and update