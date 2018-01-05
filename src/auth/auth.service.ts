import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import {Component, HttpException, Inject} from '@nestjs/common';
import { UserSchema } from '../users/schemas/user.schema';
import { UserModel } from '../users/users.provider';
import { Model } from 'mongoose';
import {FacebookDto} from './auth.dto';
import * as requestLib from 'request';
import {AuthProviderEnums} from './auth.enums';
import {IAuthProviderLogin} from './auth.interface';
import {ICreateUser, IUser} from '../users/user.interface';
import {UsersService} from '../users/users.service';

@Component()
export class AuthService {
    private tokenExp = '2 days';
    constructor(
        @InjectModel(UserSchema) private userModel: Model<UserModel>,
        @Inject(UsersService) private usersService: UsersService,
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
        if (!email) throw new HttpException('Email is required', 422);
        if (!password) throw new HttpException('Password is required', 422);

        const foundUser = await this.userModel.findOne({ email });
        if (!foundUser) throw new HttpException('User not found', 401);

        return this.createToken(foundUser);
    }

    /**
     * login or sign ups users based on provider
     * @param {IAuthProviderLogin} providerLoginData
     * @return {Promise<{access_token: string}>}
     */
    // TODO: wee need to be able to find user based on other details like email
    // TODO: if found add needed data to said user for next login
    public async providerLogin(providerLoginData: IAuthProviderLogin) {
        if (!providerLoginData.providerId) throw new HttpException('Could not process provider', 500);
        if (!providerLoginData.providerType) throw new HttpException('Could not process provider', 500);
        if (!providerLoginData.user) throw new HttpException('Could not process provider', 500);
        let foundUser: UserModel;

        foundUser = await this.userModel.findOne({ [providerLoginData.providerType]: providerLoginData.providerId });
        if (!foundUser) {
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

            accessToken = await this._facebookGetAccessToken(facebookData.code, facebookData.clientId, facebookData.redirectUri);
        } else {
            accessToken = facebookData.accessToken;
        }

        const providerData = await this._facebookAuthentication(accessToken);

        return this.providerLogin(providerData);
    }

    /**
     * holding accessToken we can now grab our facebook user
     * @param {string} accessToken
     * @return {Promise<IAuthProviderLogin>}
     * @private
     */
    private async _facebookAuthentication(accessToken: string): Promise<IAuthProviderLogin> {
        const fields          = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'gender', 'age_range', 'birthday', 'location'];
        const graphApiUrl     = `https://graph.facebook.com/v${process.env.FACEBOOK_GRAPH_API_VERSION}/me?fields=${fields.join(',')}`;

        // Step 2. Retrieve profile information about the current user.
        const params = {
            access_token: accessToken
        };

        // Step 1. Exchange authorization code for access token.
        const {data: profile} = await wrappedRequest({url: graphApiUrl, qs: params, json: true});

        const user: ICreateUser = {
            profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: (profile.email && profile.email.toLowerCase()) || `${profile.id}@null.com`,  // fake mail assignment
            gender: profile.gender || null
        };

        return { providerType: AuthProviderEnums.FACEBOOK, user, providerId: profile.id, providerToken: accessToken};

    }

    /**
     * with no facebook sdk on client side
     * we need to convert code into access_token
     * @param {string} code
     * @param {string} clientId
     * @param {string} redirectUri
     * @return {Promise<string>}
     * @private
     */
    private async _facebookGetAccessToken(code: string, clientId: string, redirectUri: string): Promise<string> {
        const accessTokenUrl  = 'https://graph.facebook.com/v2.5/oauth/access_token';

        const params = {
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: process.env.FACEBOOK_SECRET,
            scope: 'user_friends'
        };

        // Step 1. Exchange authorization code for access token.
        const {data: accessToken} = await wrappedRequest({url: accessTokenUrl, qs: params, json: true});

        return accessToken.access_token;
    }

}
// TODO: we should try and replace that with facebook js SDK if we can
function wrappedRequest(params): Promise<{response: any, data: any}> {
    return new Promise((resolve, reject) => {
        requestLib.get(params, (err, response, data) => {
            if (err) throw err;
            if (response.statusCode !== 200) throw new Error(data.error.message);

            resolve({response, data});
        });
    });
}