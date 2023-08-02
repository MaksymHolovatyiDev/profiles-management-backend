import { verify } from 'jsonwebtoken';
import {
  ExpressMiddlewareInterface,
  ForbiddenError,
  UnauthorizedError,
} from 'routing-controllers';

import { User } from 'models/user';
import { ISavedUser } from 'types/mainTypes';

const { KEY } = process.env;

export default function authenticationMiddleware(admin: boolean = false) {
  return class authenticationMiddlewareClass
    implements ExpressMiddlewareInterface
  {
    async use(request: any, response: any, next: any): Promise<any> {
      const token = request.headers['authorization'];
      const [bearer, accessToken] = token.split(' ');

      if (!token || bearer != 'Bearer' || !accessToken) {
        throw new UnauthorizedError('Missing token!');
      }

      try {
        if (typeof KEY !== 'string') throw new Error('KEY Error!');

        const data: any = verify(accessToken, KEY);

        const user: ISavedUser | null = await User.findById(data?.id);

        if (!user) {
          throw new Error('User not found!');
        }

        if (admin && !user?.admin) {
          throw new ForbiddenError('Access denied!');
        }

        response.userTokenId = data?.id;

        next();
      } catch (e) {
        console.log(e);
        throw new ForbiddenError('Access denied!');
      }
    }
  };
}
