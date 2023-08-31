import {Get, JsonController} from 'routing-controllers';

const {KEY, PORT, DB_TEST} = process.env;

@JsonController('/HealthCheck')
export default class HealthCheck {
  @Get()
  async HealthCheck() {
    return {
      message: 'Server running!!!',
      key: KEY,
      port: PORT,
      db: DB_TEST,
    };
  }
}
