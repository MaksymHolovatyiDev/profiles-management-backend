import { Schema, model } from 'mongoose';
import { IUser } from 'types/models/user';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
    admin: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
