import { Connection, Document } from 'mongoose';
import { DB_CONNECTION_TOKEN, USER_MODEL_TOKEN } from '../app.constants';
import { UserSchema } from './schemas/user.schema';
import { IUser } from './user.interface';

export type UserModel = Document & IUser;
