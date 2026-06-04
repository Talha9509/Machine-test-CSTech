import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Agent from '../models/Agent.js'

export const AddAgent = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name
  const phone = req.body.phone
  try {
    const agentExists = await Agent.findOne({ email: email })
    if(agentExists){
      console.log(agentExists)
      return res.status(409).json({ message: "Agent already exists" })
    }
    const hashedPass = await bcrypt.hash(password, 10)
    const agent = await Agent.create({
      email: email,
      password: hashedPass,
      name: name,
      phone: phone
    })
    return res.status(201).json({ message: "Agent Created", agent })
  } catch (error) {
    console.log(error)
  }
}