import { Schema, model } from 'mongoose';
import { IUser } from 'types/models/user';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
