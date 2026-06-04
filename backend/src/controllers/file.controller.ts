import { Request, Response } from 'express'
import Agent from '../models/Agent.js'
import XLSX from 'xlsx'
import Task from '../models/Task.js'

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or invalid file format." });
    }

    // Read the file directly from the Multer memory buffer
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

    // Loop through every row in the uploaded file to validate and distribute
    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const keys = Object.keys(row);

      // Data Validation: Ensure all required columns exist in this row
      const hasAllHeaders = requiredHeaders.every(header => keys.includes(header));
      if (!hasAllHeaders) {
        return res.status(400).json({
          error: `Row ${i + 1} is missing required columns. Must include FirstName, Phone, and Notes.`
        });
      }

      // Format Validation: Ensure phone is a valid number
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
}