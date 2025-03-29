import mongoose from "mongoose";

export const DB_connection=async()=>{
        await mongoose.connect(process.env.mongo_db_host)
        .then((res)=>console.log("DB connected sucessfully"))
        .catch((err)=>console.log(`DB failed to connect because ${err}`))
        
}