import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ISignUp } from './AuthTypes';
import { User } from 'models/user';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from 'routing-controllers';
import PasswordValidator from 'password-validator';
import { Types } from 'mongoose';
import tokenVerification from 'helpers/tokenVerification';

const { KEY } = process.env;
const schema = new PasswordValidator();

schema.is().min(6);

export default class AuthServices {
  async createNewUser(userData: ISignUp) {
    const { name, email, password, admin, remember } = userData;

    try {
      if (!schema.validate(password)) {
        throw new BadRequestError('Password too short!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const existedUser: any = await User.findOne({ email });

      if (existedUser?._doc) {
        throw new ForbiddenError('User already exists!');
      }

      await User.create({
        name,
        email,
        password: hashedPassword,
        admin,
        token: null,
      });

      return await this.UserSignIn({ email, password, remember });
    } catch (e: any) {
      return e;
    }
  }

  async UserSignIn(userData: Pick<ISignUp, 'email' | 'password' | 'remember'>) {
    const { email, password, remember } = userData;

    try {
      const { _doc }: any = await User.findOne({ email });

      if (!_doc) throw new BadRequestError('User doesn`t exists!');

      const isCorrectPassword = await bcrypt.compare(password, _doc.password);

      if (!isCorrectPassword)
        throw new UnauthorizedError('Incorrect password!');

      const accessToken = await this.createToken(_doc._id, remember);
      await User.findByIdAndUpdate({ _id: _doc._id }, { token: accessToken });

      return { _id: _doc._id, token: accessToken, admin: _doc.admin };
    } catch (e) {
      return e;
    }
  }

  async UserLogOut(token: string) {
    try {
      const id = await tokenVerification(token);

      const { _id }: any = await User.findByIdAndUpdate(
        { _id: id },
        { token: null }
      );

      if (!_id) throw new BadRequestError('User not found!');

      return 'Logged out!';
    } catch (e) {
      return e;
    }
  }

  async createToken(id: Types.ObjectId, remember: boolean) {
    if (typeof KEY === 'string') {
      let expiresIn = remember ? '31d' : '1h';

      return jwt.sign({ id }, KEY, { expiresIn });
    } else {
      return 'KEY ERROR!';
    }
  }
}
