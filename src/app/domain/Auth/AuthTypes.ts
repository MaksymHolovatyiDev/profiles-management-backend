import { IUser } from "types/models/user";

export interface ISignUp extends IUser {
  remember: boolean;
}
