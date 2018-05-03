import { Component } from '@nestjs/common';
import { AuthProviderEnums } from '../auth.enums';
import { IAuthProviderLogin } from '../auth.types';
import { ICreateUser } from '../../user/user.types';
import { wrappedRequest } from '../../utils/index';

@Component()
export class FacebookProvider {
    /**
     * holding accessToken we can now grab our facebook user
     * @param {string} accessToken
     * @return {Promise<IAuthProviderLogin>}
     * @private
     */
    async authentication(accessToken: string): Promise<IAuthProviderLogin> {
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
    async getAccessToken(code: string, clientId: string, redirectUri: string): Promise<string> {
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