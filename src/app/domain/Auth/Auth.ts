import { Body, HeaderParam, JsonController, Post } from 'routing-controllers';
import AuthServices from './AuthServices';
import { ISignUp } from './AuthTypes';

@JsonController('/auth')
export default class Auth {
  public service = new AuthServices();

  @Post('/SignUp')
  async SignUp(@Body() body: ISignUp) {
    return this.service.createNewUser(body);
  }

  @Post('/SignIn')
  async SignIn(@Body() body: Pick<ISignUp, 'email' | 'password' | 'remember'>) {
    return this.service.UserSignIn(body);
  }

  @Post('/LogOut')
  async UserLogOut(@HeaderParam('authorization') token: string) {
    return this.service.UserLogOut(token);
  }
}
