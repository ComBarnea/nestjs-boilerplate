import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import {Component, HttpException, Inject} from '@nestjs/common';
import { UserSchema } from '../users/schemas/user.schema';
import { UserModel } from '../users/users.provider';
import { Model } from 'mongoose';
import {FacebookDto} from './auth.dto';

import {IAuthProviderLogin} from './auth.interface';
import {ICreateUser, IUpdateUser} from '../users/user.interface';
import {UsersService} from '../users/users.service';
import {FacebookProvider} from './loginProviders/facebook.provider';

@Component()
export class AuthService {
    private tokenExp = '2 days';
    constructor(
        @InjectModel(UserSchema) private userModel: Model<UserModel>,
        @Inject(UsersService) private usersService: UsersService,
        @Inject(FacebookProvider) private facebookProvider: FacebookProvider,
    ) {

    }

    private async createToken(user: UserModel) {

        const data = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            profilePicture: user.profilePicture
        };
        const token = jwt.sign(data, process.env.SECRET, { expiresIn: this.tokenExp });

        return {
            access_token: token
        };
    }

    public async validateUser(userId: string) {
        return await this.usersService.validateUser(userId);
    }

    // TODO: how about we validate the password?
    public async login(email, password) {
        let foundUser: UserModel;
        if (!email) throw new HttpException('Email is required', 422);
        if (!password) throw new HttpException('Password is required', 422);

        foundUser = await this.usersService.findUserForLogin({ email });
        if (!foundUser) throw new HttpException('User not found', 401);

        const isMatch = await foundUser.comparePassword(password);
        if (!isMatch) throw new HttpException('Wrong password.', 401);

        foundUser = await this.usersService.findUserByEmail({ email });
        if (!foundUser) throw new HttpException('User not found', 401);

        return this.createToken(foundUser);
    }

    public async register(userData: ICreateUser) {
        let foundUser: UserModel;
        foundUser = await this.usersService.findUserForLogin({ email: userData.email});
        if (foundUser) throw new HttpException('User already found', 409);

        foundUser = await this.usersService.create(userData);

        return this.createToken(foundUser);
    }

    /**
     * login or sign ups users based on provider
     * @param {IAuthProviderLogin} providerLoginData
     * @return {Promise<{access_token: string}>}
     */
    public async providerLogin(providerLoginData: IAuthProviderLogin) {
        if (!providerLoginData.providerId) throw new HttpException('Could not process provider', 500);
        if (!providerLoginData.providerType) throw new HttpException('Could not process provider', 500);
        if (!providerLoginData.user) throw new HttpException('Could not process provider', 500);
        let foundUser: UserModel;

        foundUser = await this.usersService.findUserByProvider({
            providerType: providerLoginData.providerType,
            providerId: providerLoginData.providerId});

        if (!foundUser) {
            if (providerLoginData.user && providerLoginData.user.email) {
                foundUser = await this.usersService.findUserByEmail({ email: providerLoginData.user.email });
            }
        }

        if (foundUser) {
            const updateData: Partial<IUpdateUser> = {};
            if (!foundUser[providerLoginData.providerType]) {
                updateData[providerLoginData.providerType] = providerLoginData.providerId;
            }

            updateData.tokens = foundUser.tokens || [];
            const foundToken = updateData.tokens.find((token) => {
                return token.provider === providerLoginData.providerType;
            });

            if (foundToken) {
                foundToken.accessToken = providerLoginData.providerToken;
            } else {
                updateData.tokens.push({
                    provider: providerLoginData.providerType,
                    accessToken: providerLoginData.providerToken
                });
            }

            foundUser = await this.usersService.updateOne({_id: foundUser._id}, updateData);
        } else {
            providerLoginData.user[providerLoginData.providerType as string] = providerLoginData.providerId;
            providerLoginData.user.tokens = [
                {
                    accessToken: providerLoginData.providerToken,
                    provider: providerLoginData.providerType
                }
            ];

            foundUser = await this.usersService.create(providerLoginData.user);
        }

        return this.createToken(foundUser);
    }

    /**
     * handle all types of facebook login/sign up
     * @param {FacebookDto} facebookData
     * @return {Promise<Promise<{access_token: string}>>}
     */
    public async facebook(facebookData: FacebookDto) {
        let accessToken: string;
        if (!facebookData.sdk) {
            accessToken = await this.facebookProvider.getAccessToken(facebookData.code, facebookData.clientId, facebookData.redirectUri);
        } else {
            accessToken = facebookData.accessToken;
        }

        const providerData = await this.facebookProvider.authentication(accessToken);

        return this.providerLogin(providerData);
    }
}