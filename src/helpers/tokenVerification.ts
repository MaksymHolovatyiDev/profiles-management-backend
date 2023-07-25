import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { User } from 'models/user';

const { KEY } = process.env;

export default async function tokenVerification(token: string) {
  const [bearer, accessToken] = token.split(' ');

  if (bearer != 'Bearer' || !accessToken) {
    throw new UnauthorizedError('Missing token!');
  }

  if (typeof KEY === 'string') {
    const { id }: any = verify(accessToken, KEY);
    const user: any = await User.findById(id);

    if (!user || !user?.token || user?.token != accessToken) {
      throw new UnauthorizedError('Not authorized!');
    }
    return id;
  }
  return 'No KEY!';
}
