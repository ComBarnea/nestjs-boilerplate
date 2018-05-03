import { InjectModel } from '@nestjs/mongoose';
import { Component, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { Model } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserModel } from './user.provider';
import { ICreateUser, IFindUserByEmail, IFindUserById, IFindUserByProvider, IFindUserByResetToken } from './user.types';

@Component()
export class UsersService {

    constructor(@InjectModel(UserSchema) private userModel: Model<UserModel>) {

    }

    public async create(userData: ICreateUser): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Email is required', 422);
        if (!userData.firstName) throw new HttpException('First Name is required', 422);

        if (userData.password) {
            userData.password = String(userData.password);
            if (!checkPassword(userData.password)) throw new HttpException('Password no good.', 400);

            userData.password = await hashPassword(userData.password);
        }

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

    public async findUserForLogin(userData: IFindUserByEmail): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Find condition are required.', 422);
        const findConditions = {
            email: userData.email
        };

        return await this.userModel.findOne(findConditions, ['_id', 'password']);
    }

    public async findUserById(userData: IFindUserById): Promise<UserModel> {
        if (!userData._id) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            _id: userData._id
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByEmail(userData: IFindUserByEmail): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Find condition are required.', 422);
        const findConditions = {
            email: userData.email
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByProvider(userData: IFindUserByProvider): Promise<UserModel> {
        if (!userData.providerId || !userData.providerType) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            [userData.providerType]: userData.providerId
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByResetToken(userData: IFindUserByResetToken): Promise<UserModel> {
        if (!userData.resetToken) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            resetToken: userData.resetToken
        };

        return await this.userModel.findOne(findConditions);
    }

    public async updateOne(userData: IFindUserById, updateData): Promise<UserModel> {
        if (!userData._id) throw new HttpException('Find condition are required.', 422);

        if (updateData.hasOwnProperty('password')) {
            updateData.password = String(updateData.password);
            if (!checkPassword(updateData.password)) throw new HttpException('Password no good.', 400);

            updateData.password = await hashPassword(updateData.password);
        }

        const findConditions = {
            _id: userData._id
        };

        await this.userModel.update(findConditions, updateData);

        return await this.findUserById(findConditions);
    }
}

/**
 * Password hash middleware.
 * @param {string} password
 * @return {Promise<void>}
 */
function hashPassword(password: string) {
    return bcrypt.hash(String(password), 10)
        .then((hash) => {
            return hash;
        })
        .catch(() => {
            throw {err: 'Error hashing password'};
        });
}

function checkPassword(password: string) {
    const passwordReg = /^.{6,}$/;

    return passwordReg.test(password);
}
