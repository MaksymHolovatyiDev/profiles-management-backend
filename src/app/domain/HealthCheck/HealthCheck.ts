import mongoose from 'mongoose';
import {Get, JsonController} from 'routing-controllers';

const {KEY, DB_HOST} = process.env;

@JsonController('/HealthCheck')
export default class HealthCheck {
  @Get()
  async HealthCheck() {
    return {
      message: 'Server running!',
      mainData: `data ${KEY} ${DB_HOST}`,
      mongooseConnection: mongoose.connection.readyState,
    };
  }
}
