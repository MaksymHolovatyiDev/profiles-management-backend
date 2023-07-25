import { Schema, model } from 'mongoose';
import { IProfile } from 'types/models/profile';

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    birthdate: { type: Date, required: true },
    city: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Profile = model<IProfile>('Profile', profileSchema);
