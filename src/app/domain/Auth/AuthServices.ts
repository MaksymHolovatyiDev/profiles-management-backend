import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PasswordValidator from 'password-validator';
import { Types } from 'mongoose';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';

import { User } from 'models/user';
import { ISignUp } from './AuthTypes';
import { ISavedUser } from 'types/mainTypes';
import { customError } from 'cusotmError/customError';

const { KEY } = process.env;
const schema = new PasswordValidator();

schema.is().min(6);

export default class AuthServices {
  async createNewUser(userData: ISignUp) {
    const { name, email, password, admin, remember } = userData;

    const existedUser: ISavedUser | null = await User.findOne({ email });

    if (existedUser) {
      throw new customError(409, 'Email already exists!');
    }

    try {
      if (!schema.validate(password)) {
        throw new BadRequestError('Password too short!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        admin,
      });

      return await this.UserSignIn({ email, password, remember });
    } catch (e) {
      throw e;
    }
  }

  async UserSignIn(userData: Pick<ISignUp, 'email' | 'password' | 'remember'>) {
    const { email, password, remember } = userData;

    try {
      const userData: ISavedUser | null = await User.findOne({ email });

      if (!userData) throw new BadRequestError('User doesn`t exists!');

      const { _id, name, admin, password: userPassword } = userData;

      const isCorrectPassword = await bcrypt.compare(password, userPassword);

      if (!isCorrectPassword)
        throw new UnauthorizedError('Incorrect password!');

      const accessToken = await this.createToken(_id, remember);

      return {
        _id: _id.toString(),
        name: name,
        admin: admin,
        token: accessToken,
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
