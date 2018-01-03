import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Component, HttpException } from '@nestjs/common';
import { UserSchema } from '../users/schemas/user.schema';
import { UserModel } from '../users/users.provider';
import { Model } from 'mongoose';

@Component()
export class AuthService {
    private tokenExp = '2 days';
    constructor(
        @InjectModel(UserSchema) private userModel: Model<UserModel>
    ) {

    }

    private async createToken(user: UserModel) {
        const data = {
            email: user.email,
            name: user.name,
            _id: user._id,
            profilePicture: user.profilePicture
        };
        const token = jwt.sign(data, process.env.SECRET, { expiresIn: this.tokenExp });

        return {
            access_token: token
        };
    }

    public async validateUser(userId: string) {
        const foundUser = await this.userModel.findById(userId, '_id');
        return !!foundUser;
    }

    public async login(email, password) {
        if (!email) throw new HttpException('Email is required', 422);
        if (!password) throw new HttpException('Password is required', 422);

        const foundUser = await this.userModel.findOne({ email });
        if (!foundUser) throw new HttpException('User not found', 401);

        return this.createToken(foundUser);
    }
}