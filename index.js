import { config } from "dotenv"
import express from "express"
import { DB_connection } from "./DB/connection.js"
import userRouter from "./src/modules/auth/auth.routes.js"

config()//this function is enable us to use env variables that are in env file
const app =express()
const port = process.env.PORT ||3000
app.use(express.json())

app.use("/user",userRouter)

DB_connection()
app.listen(port,()=>{
    console.log( `the server is running well on port ${port}`);
    
})
