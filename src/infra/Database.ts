import mongoose from 'mongoose';
import { IServes } from 'types/serves';

const { DB_HOST } = process.env;

export class Database implements IServes {
  private static instance: Database;

  constructor() {
    if (!Database.instance) {
      Database.instance = this;
    }
    return Database.instance;
  }

  async init() {
    await mongoose.set('strictQuery', true);

    try {
      if (typeof DB_HOST === 'string') {

        await mongoose.connect(DB_HOST);

        console.log('Database connected!');
        
      } else {
        throw new Error('Database ERROR!');
      }
    } catch (e) {
      console.log(e);
    }

    return true;
  }
}
