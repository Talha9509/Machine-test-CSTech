import { Request, Response } from 'express'
import Agent from '../models/Agent.js'
import Task from '../models/Task.js'

export const DistributeList = async (req: Request, res: Response) => {
  try {
    // Fetch all agents (Make sure to exclude their passwords!)
    const agents = await Agent.find()
    
    if (!agents || agents.length === 0) {
      return res.status(404).json({ message: "No agents found." });
    }

    // Fetch all tasks
    const tasks = await Task.find();

    // Map over each agent and attach only the tasks assigned to their specific ID
    const groupedData = agents.map(agent => {
      // Find all tasks that belong to this specific agent
      const agentTasks = tasks.filter(
        task => task.AgentId === agent._id.toString()
      );

      return {
        agentDetails: agent,
        totalAssigned: agentTasks.length,
        tasks: agentTasks
      };
    });
    return res.status(200).json(groupedData);
  } catch (error: any) {
    console.error("Error fetching lists:", error);
    return res.status(500).json({ error: "Failed to fetch distributed lists." });
  }
}