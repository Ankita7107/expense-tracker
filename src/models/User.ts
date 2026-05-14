import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
