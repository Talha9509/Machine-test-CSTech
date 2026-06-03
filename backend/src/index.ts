import express from 'express'
import { connectDB } from './utils/db.js'

const app = express()

await connectDB();

app.get("/register", async ( req, res )=>{
    res.send("registering")
})

app.listen(3001,()=>{
    console.log(`Server running on 3001`)
})