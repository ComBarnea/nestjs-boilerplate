import { Component, Inject, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { use } from 'passport';
import { Strategy } from 'passport-local';

import { UserModel } from '../../user/user.provider';
import { UsersService } from '../../user/user.service';

@Component()
export class LocalStrategy {
    constructor(
        @Inject(UsersService) private usersService: UsersService) {
        this.init();
    }

    private init(): void {
        use('local-signup', new Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req: any, email: string, password: string, done: Function) => {
            try {
                const userData = req.body;
                let foundUser: UserModel;
                foundUser = await this.usersService.findUserForLogin({ email });
                if (foundUser) throw new HttpException('User already found', 409);

                foundUser = await this.usersService.create(userData);

                done(null, foundUser);
            } catch (error) {
                done(error, false);
            }
        }));

        use('local-signin', new Strategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email: string, password: string, done: Function) => {
            try {
                let foundUser: UserModel;
                if (!email) throw new HttpException('Email is required', 422);
                if (!password) throw new HttpException('Password is required', 422);

                foundUser = await this.usersService.findUserForLogin({ email });
                if (!foundUser) throw new HttpException('User not found', 401);

                const isMatch = await foundUser.comparePassword(password);
                if (!isMatch) throw new HttpException('Wrong password.', 401);

                foundUser = await this.usersService.findUserByEmail({ email });
                if (!foundUser) throw new HttpException('User not found', 401);

                done(null, foundUser);
            } catch (error) {
                done(error, false);
            }
        }));
    }
}
