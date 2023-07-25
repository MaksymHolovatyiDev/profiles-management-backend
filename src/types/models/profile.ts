import { Types } from 'mongoose';

export interface IProfile {
  name: string;
  gender: string;
  birthdate: Date;
  city: string;
  user: Types.ObjectId;
}
