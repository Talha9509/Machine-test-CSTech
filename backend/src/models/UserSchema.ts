import mongoose, { Schema, Model, Document } from 'mongoose'

export interface newUser extends Document {
  email: string,
  password: string,
  createdAt: Date
}

const UserSchema = new Schema<newUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User: Model<newUser> = mongoose.models.User || mongoose.model<newUser>("User", UserSchema);
export default User