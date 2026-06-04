import express from 'express'
import { connectDB } from './utils/db.js'
import 'dotenv/config'
import cors from 'cors'
import authRoutes from './routes/auth.Route.js'
import agentRoutes from './routes/agent.Route.js'
import fileRoutes from './routes/file.Route.js'
import distrubuteListRoutes from './routes/distributedList.routes.js'

const app = express()
const corsOptions = {
  origin: process.env.FRONTEND_URL, 
};

app.use(cors(corsOptions));
app.use(express.json());

await connectDB();

app.use("/auth", authRoutes)
app.use("/add/agent", agentRoutes)
app.use("/upload/file", fileRoutes)
app.use("/distributed-lists", distrubuteListRoutes)


app.use((req, res, err) => {
  console.log(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

app.listen(3001, () => {
  console.log(`Server running on 3001`)
})