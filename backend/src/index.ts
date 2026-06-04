import express, { Request, Response } from 'express'
import { connectDB } from './utils/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import 'dotenv/config'
import { authMiddleware } from './middleware/auth.middleware.js'
import Agent from './models/Agent.js'
import multer from 'multer'
import path from 'path'
import XLSX from 'xlsx'
import Task from './models/Task.js'

const app = express()
app.use(express.json());

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext == '.csv' || ext === '.xlsx' || ext === '.xls' || ext === '.axls') {
      cb(null, true)
    } else {
      // cb(null, false)
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  }
})

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
    if (!user) {
      // check http code and message here
      return res.status(409).json({ message: "Create an Account first" })
    }
    const correct = bcrypt.compare(password, user?.password)
    if (!correct) {
      return res.status(401).json({ message: "Incorrect Password" })
    }
    const token = jwt.sign({ userId: user.email }, secret!, { expiresIn: "72h" })
    console.log(token)
    return res.status(201).json({ message: "User Logged in", token })
  } catch (error) {
    console.log(error)
  }
})

app.post("/add/agent", authMiddleware, async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name
  const phone = req.body.phone
  try {
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
})

app.post("/upload/file", authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or invalid file format." });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName!];

    const parsedData: any[] = XLSX.utils.sheet_to_json(worksheet!);

    if (!parsedData || parsedData.length === 0) {
      return res.status(400).json({ error: "The uploaded file is empty." });
    }

    const requiredHeaders = ['FirstName', 'Phone', 'Notes'];
    
    const agents = await Agent.find();
    console.log(agents.length, agents)

    if (!agents || agents.length === 0) {
      return res.status(400).json({ error: "No agents found in the database. Please create agents before uploading a list." });
    }

    const numberOfAgents = agents.length;
    const assignedTasks = [];

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const keys = Object.keys(row);
      const hasAllHeaders = requiredHeaders.every(header => keys.includes(header));

      if (!hasAllHeaders) {
        return res.status(400).json({
          error: `Row ${i + 1} is missing required columns. Must include FirstName, Phone, and Notes.`
        });
      }

      const phoneAsNum = Number(row?.Phone);
      if (isNaN(phoneAsNum) || !row?.Phone) {
        return res.status(400).json({
          error: `Validation Error at row ${i + 1}: Phone must be a numeric value.`
        });
      }

      const agentIndex = i % numberOfAgents;
      const assignedAgent = agents[agentIndex];

      assignedTasks.push({
        FirstName: row.FirstName,
        phone: String(row.Phone), 
        notes: row.Notes,
        AgentId: assignedAgent?._id 
      });
    }

    await Task.insertMany(assignedTasks);

    const itemsPerAgent = Math.floor(parsedData.length / numberOfAgents);
    const remainder = parsedData.length % numberOfAgents;

    return res.status(200).json({
      message: "File uploaded and distributed successfully!",
      stats: {
        totalRowsProcessed: parsedData.length,
        baseItemsPerAgent: itemsPerAgent,
        agentsReceivingExtraItem: remainder 
      }
    });
  } catch (error) {
    console.error("File processing error:", error);
  }
})

app.use((req, res, err) => {
  console.log(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

app.listen(3001, () => {
  console.log(`Server running on 3001`)
})