import { Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  admin: boolean;
  profiles: Types.ObjectId[];
}
