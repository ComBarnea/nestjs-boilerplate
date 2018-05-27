import { Injectable, HttpException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { UserModel } from './user.provider';
import {
    ICreateUser, IFindUserByEmail, IFindUserById, IFindUserByProvider, IFindUserByResetToken,
    IFindUsers
} from './user.types';
import { APP_TOKENS } from '../app.constants';
import { RepositoryService } from '../repository/repository.service';
import { AuthorizationRoot } from '../authorization/authorization.root';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class UsersService extends AuthorizationRoot {
    userModel: Model<UserModel>;

    constructor(@Inject(AuthorizationService) private authorizationService: AuthorizationService,
                @Inject(RepositoryService) private repositoryService: RepositoryService) {
        super();

        this.userModel = this.repositoryService.getModel(APP_TOKENS.userModel);
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
        const query = {
            ...this.getBasicQuery(),
            _id: userId
        };

        const foundUser = await this.userModel.findOne(query, '_id');
        if (!foundUser) throw {err: 'Invalid user.'};

        return !!foundUser;
    }

    public async findUserForLogin(userData: IFindUserByEmail): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Find condition are required.', 422);
        const findConditions = {
            email: userData.email,
            ...this.getBasicQuery()
        };

        return await this.userModel.findOne(findConditions, ['_id', 'password']);
    }

    public async findUsers(userData: IFindUsers): Promise<UserModel[]> {
        return await this.userModel.find(this.getBasicQuery());
    }

    public async findUserById(userData: IFindUserById): Promise<UserModel> {
        if (!userData._id) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            _id: userData._id,
            ...this.getBasicQuery()
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByEmail(userData: IFindUserByEmail): Promise<UserModel> {
        if (!userData.email) throw new HttpException('Find condition are required.', 422);
        const findConditions = {
            email: userData.email,
            ...this.getBasicQuery()
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByProvider(userData: IFindUserByProvider): Promise<UserModel> {
        if (!userData.providerId || !userData.providerType) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            [userData.providerType]: userData.providerId,
            ...this.getBasicQuery()
        };

        return await this.userModel.findOne(findConditions);
    }

    public async findUserByResetToken(userData: IFindUserByResetToken): Promise<UserModel> {
        if (!userData.resetToken) throw new HttpException('Find condition are required.', 422);

        const findConditions = {
            resetToken: userData.resetToken,
            ...this.getBasicQuery()
        };

        return await this.userModel.findOne(findConditions);
    }

    public async updateOne(userData: IFindUserById, updateData): Promise<UserModel> {
        if (!userData._id) throw new HttpException('Find condition are required.', 422);

        let foundUser = await this.findUserById(userData);
        foundUser = await this.authorizationService.validateResource(foundUser);

        if (updateData.hasOwnProperty('password')) {
            updateData.password = String(updateData.password);
            if (!checkPassword(updateData.password)) throw new HttpException('Password no good.', 400);

            updateData.password = await hashPassword(updateData.password);
        }

        const findConditions = {
            _id: userData._id,
            ...this.getBasicQuery()
        };

        await this.userModel.update(findConditions, updateData);

        return await this.findUserById(findConditions);
    }

    public getBasicQuery() {
        return {
            deletedAt: null
        } as any;
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
