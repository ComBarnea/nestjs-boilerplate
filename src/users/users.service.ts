import { InjectModel } from '@nestjs/mongoose';
import { Component, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';
import {UserSchema} from './schemas/user.schema';
import {UserModel} from './users.provider';
import {ICreateUser} from './user.interface';

@Component()
export class UsersService {

    constructor(@InjectModel(UserSchema) private userModel: Model<UserModel>) {

    }

    public async create(userData: ICreateUser): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Email is required', 422);
        if (!userData.firstName) throw new HttpException('First Name is required', 422);

        return this.userModel.create(userData);
    }

    /**
     * Simple health check
     * only fetch user _id in order to validate existence
     * @param {String} userId
     * @return {Promise<UserModel>}
     */
    public async validateUser(userId: string): Promise<boolean> {
        const foundUser = await this.userModel.findById(userId, '_id');
        if (!foundUser) throw {err: 'Invalid user.'};

        return !!foundUser;
    }
}