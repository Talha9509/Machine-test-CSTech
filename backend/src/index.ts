import express from 'express'
import { connectDB } from './utils/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './models/UserSchema.js'
import 'dotenv/config'

const app = express()

await connectDB();
const secret = process.env.JWT_SECRET

app.post("/register", async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const hashedPass = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email,
      password: hashedPass
    })
    const token = jwt.sign({ userId: user.email }, secret!, { expiresIn: "72h" })
    console.log(token)
    return res.status(201).json({ message: "User Created", token, user })
  } catch (error) {
    console.log(error)
  }
})

app.post("/login", async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findOne({ email: email })
    if(!user){
      // check http code and message here
      return res.status(409).json({ message: "Create an Account first" })
    }
    const correct = bcrypt.compare(password, user?.password )
    if (!correct) {
      return res.status(401).json({ message: "Incorrect Password" })
    }
    const token = jwt.sign({ userId: user.email }, secret!, { expiresIn: "72h" })
    console.log(token)
    return res.status(201).json({ message: "User Created", token })
  } catch (error) {
    console.log(error)
  }
})

app.use((req, res, err)=>{
  console.log(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

app.listen(3001, () => {
  console.log(`Server running on 3001`)
})