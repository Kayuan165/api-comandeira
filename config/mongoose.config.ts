import { MongooseModuleOptions } from '@nestjs/mongoose';

export const monngooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/comandeiro',
};
