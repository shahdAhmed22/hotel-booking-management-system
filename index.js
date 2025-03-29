import { config } from "dotenv"
import express from "express"
import { DB_connection } from "./DB/connection.js"


config()//this function is enable us to use env variables that are in env file
const app =express()
const port = 3000

DB_connection()
app.listen(port,()=>{
    console.log( `the server is running well on port ${port}`);
    
})
