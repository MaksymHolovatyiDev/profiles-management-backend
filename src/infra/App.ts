require('dotenv').config();
import { Tcp } from './Tcp';
import { Database } from './Database';
import { IServes } from 'types/serves';

export class App implements IServes {
  private static instance: App;

  private database: IServes = new Database();
  private tcp: IServes = new Tcp();

  constructor() {
    if (!App.instance) {
      App.instance = this;
    }
    return App.instance;
  }

  async init() {
    const { database, tcp } = this;
    console.log('Started');

    await database.init();
    await tcp.init();

    return true;
  }
}
