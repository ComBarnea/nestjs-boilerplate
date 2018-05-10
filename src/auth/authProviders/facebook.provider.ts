import { Component, forwardRef, Inject } from '@nestjs/common';
import { use } from 'passport';
import { wrappedRequest } from '../../utils';
import * as FacebookTokenStrategy from 'passport-facebook-token';

import { AuthProviderEnums } from '../auth.enums';
import { IAuthProviderLogin } from '../auth.types';
import { AuthService } from '../auth.service';
import { IFacebookConfig } from './config/facebook.provider.config';
import { SERVER_CONFIG } from '../../app.constants';
import { facebookConfig } from './config/facebook.provider.config';

@Component()
export class FacebookProvider {
    url: string;
    fbConfig: IFacebookConfig;
    constructor(
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
    ) {
        this.fbConfig = facebookConfig;
        this.init();
        this.url = `${SERVER_CONFIG.protocol}://${SERVER_CONFIG.origin}:${SERVER_CONFIG.port}`;
    }

    private init(): void {
        use('facebook', new FacebookTokenStrategy({
            clientID: this.fbConfig.client_id,
            clientSecret: this.fbConfig.client_secret,
            profileFields: ['id', 'email', 'first_name', 'last_name', 'link', 'gender', 'age_range', 'birthday', 'location']
        }, async (accessToken: string, refreshToken: string, profileData: any, done: Function) => {
            const profile = profileData._json;

            try {
                const providerLoginData: IAuthProviderLogin = {
                    user: {
                        profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                        firstName: profile.first_name,
                        lastName: profile.last_name,
                        email: (profile.email && profile.email.toLowerCase()) || `${profile.id}@null.com`,  // fake mail assignment
                        gender: profile.gender || null
                    },
                    providerType: AuthProviderEnums.FACEBOOK,
                    providerId: profile.id,
                    providerToken: accessToken
                };

                const user = await this.authService.providerLogin(providerLoginData);

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
    }

    async requestProviderRedirectUri(): Promise<{redirect_uri: string}> {
        const queryParams: string[] = [
            `client_id=${this.fbConfig.client_id}`,
            `redirect_uri=${this.fbConfig.oauth_redirect_uri}`,
            `state=${this.fbConfig.state}`
        ];
        const redirect_uri: string = `${this.fbConfig.login_dialog_uri}?${queryParams.join('&')}`;

        return {
            redirect_uri
        };
    }

    async requestProviderLogIn(data: {code: string}): Promise<any> {
        const code: string = data.code;
        let response;
        const queryParams = {
            client_id: `${this.fbConfig.client_id}`,
            redirect_uri: `${this.fbConfig.oauth_redirect_uri}`,
            client_secret: `${this.fbConfig.client_secret}`,
            code
        };

        response = await wrappedRequest({
            method: 'GET',
            url: `${this.fbConfig.access_token_uri}`,
            qs: queryParams,
            json: true
        });

        const { access_token } = response.data;

        response = await wrappedRequest({
            method: 'POST',
            url: `${this.url}/v1/auth/facebook/token`,
            form: {
                access_token
            },
            json: true
        });

        return response.data.data;
    }
}