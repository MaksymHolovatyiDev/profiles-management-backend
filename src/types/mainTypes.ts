import { Types } from 'mongoose';
import { IUser } from './models/user';

export interface ISavedUser extends IUser {
  _id: Types.ObjectId;
}
