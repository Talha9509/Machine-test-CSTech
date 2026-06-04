import mongoose, { Schema, Model, Document } from 'mongoose'

export interface newTask extends Document {
  FirstName: string,
  phone: string,
  notes: string,
  AgentId: string
}

const TaskSchema = new Schema<newTask>({
  FirstName: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  notes: { type: String, required: true },
  AgentId: { type: String, required: true }
})

const Task: Model<newTask> = mongoose.models.Task || mongoose.model<newTask>("Task", TaskSchema);
export default Task