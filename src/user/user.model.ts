import { UserSchema } from './schemas/user.schema';
import { APP_TOKENS } from '../app.constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

export const UserModel = MongooseModule.forFeature([{
    name: APP_TOKENS.userModel,
    schema: UserSchema
}]);