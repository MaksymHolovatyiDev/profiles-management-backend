import {
  ExpressMiddlewareInterface,
  ForbiddenError,
  UnauthorizedError,
} from 'routing-controllers';
import { verify } from 'jsonwebtoken';
import { User } from 'models/user';

const { KEY }: any = process.env;

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
        const data: any = verify(accessToken, KEY);

        const user: any = await User.findById(data?.id);

        if (admin && !user.admin) {
          throw new ForbiddenError('Access denied');
        }

        response.userTokenId = data?.id;

        next();
      } catch (e) {
        throw new UnauthorizedError('Not authorized!');
      }
    }
  };
}
