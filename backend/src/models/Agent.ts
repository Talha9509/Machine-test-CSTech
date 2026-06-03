import mongoose, { Schema, Model, Document } from 'mongoose'

export interface newAgent extends Document {
  email: string,
  password: string,
  name: string,
  phone: string,
  createdAt: Date
}

const AgentSchema = new Schema<newAgent>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const Agent: Model<newAgent> = mongoose.models.Agent || mongoose.model<newAgent>("Agent", AgentSchema);
export default Agent