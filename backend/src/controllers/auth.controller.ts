import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import 'dotenv/config'

const secret = process.env.JWT_SECRET

export const register = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password
  try {
    // Prevent duplicate admin registrations
    const userExists = await User.findOne({ email: email })
    if(userExists){
      console.log(userExists)
      return res.status(409).json({ message: "User already exists" })
    }
    // Hash password for security before saving to database
    const hashedPass = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email,
      password: hashedPass
    })
    // Generate a JWT for session management
    const token = jwt.sign({ userId: user.email }, secret!, { expiresIn: "72h" })
    console.log(token)
    return res.status(201).json({ message: "User Created", token, user })
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(401).json({ message: "Create an Account first" })
    }
    // Compare the incoming plain-text password with the stored hash
    const correct = await bcrypt.compare(password, user?.password)
    if (!correct) {
      return res.status(401).json({ message: "Incorrect Password" })
    }
    const token = jwt.sign({ userId: user.email }, secret!, { expiresIn: "72h" })
    console.log(token)
    return res.status(201).json({ message: "User Logged in", token })
  } catch (error) {
    console.log(error)
  }
}