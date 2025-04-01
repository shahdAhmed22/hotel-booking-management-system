import mongoose from "mongoose";
import { RoomStates } from "../../src/utils/enums.utils.js";


const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["single", "double", "suite", "deluxe", "family"],
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String], // ["WiFi", "TV", "Air Conditioning"]
    default: [],
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null 
  },
  status: {
    type: String,
    enum: Object.values(RoomStates),
    default: "available",
  },
  images: {
    type: [String], // Array of image URLs
    default: [],
  },
  description: {
    type: String,
  },
},{timestamps:true});

const room =mongoose.models.Room||mongoose.model("Room",roomSchema)

export default room