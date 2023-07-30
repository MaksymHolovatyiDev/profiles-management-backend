import { Body, HttpCode, JsonController, Post } from 'routing-controllers';

import AuthServices from './AuthServices';
import { ISignUp } from './AuthTypes';

@JsonController('/auth')
export default class Auth {
  public service = new AuthServices();

  @HttpCode(201)
  @Post('/SignUp')
  async SignUp(@Body() body: ISignUp) {
    return this.service.createNewUser(body);
  }

  @Post('/SignIn')
  async SignIn(@Body() body: Pick<ISignUp, 'email' | 'password' | 'remember'>) {
    return this.service.UserSignIn(body);
  }
}
