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
        throw new ForbiddenError('Email already exists!');
      }

      await User.create({
        name,
        email,
        password: hashedPassword,
        admin,
        profiles: [],
      });

      return await this.UserSignIn({ email, password, remember });
    } catch (e: any) {
      throw e;
    }
  }

  async UserSignIn(userData: Pick<ISignUp, 'email' | 'password' | 'remember'>) {
    const { email, password, remember } = userData;

    try {
      const userData: any = await User.findOne({ email });

      if (!userData) throw new BadRequestError('User doesn`t exists!');

      const { _doc } = userData;

      const isCorrectPassword = await bcrypt.compare(password, _doc.password);

      if (!isCorrectPassword)
        throw new UnauthorizedError('Incorrect password!');

      const accessToken = await this.createToken(_doc._id, remember);

      return {
        _id: _doc._id.toString(),
        token: accessToken,
        admin: _doc.admin,
        name: _doc.name,
      };
    } catch (e) {
      throw e;
    }
  }

  async createToken(id: Types.ObjectId, remember: boolean) {
    if (typeof KEY === 'string') {
      const expiresIn = remember ? '31d' : '1h';

      return jwt.sign({ id }, KEY, { expiresIn });
    } else {
      return 'KEY ERROR!';
    }
  }
}
