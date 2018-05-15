import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { wrappedRequest } from '../../utils';
import * as GoogleTokenStrategy from 'passport-google-plus-token';

import { AuthProviderEnums } from '../auth.enums';
import { IAuthProviderLogin } from '../auth.types';
import { AuthService } from '../auth.service';
import { ROUTE_PREFIX, SERVER_CONFIG } from '../../app.constants';
import { googleConfig } from './config/google.provider.config';
import { get, post, Response } from 'request';
import { IGoogleConfig } from './config/google.provider.config';

@Injectable()
export class GoogleProvider {
    url: string;
    googleConfig: IGoogleConfig;
    constructor(
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
    ) {
        this.googleConfig = googleConfig;
        this.init();
        this.url = `${SERVER_CONFIG.protocol}://${SERVER_CONFIG.origin}:${SERVER_CONFIG.port}`;
    }

    private init(): void {
        use('google', new GoogleTokenStrategy({
            clientID: this.googleConfig.client_id,
            clientSecret: this.googleConfig.client_secret
        }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

            try {
                const providerLoginData: IAuthProviderLogin = {
                    user: {
                        profilePicture: profile.photos && profile.photos[0] && profile.photos[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: (profile.emails && profile.emails[0] && profile.emails[0].value.toLowerCase()) || `${profile.id}@null.com`,  // fake mail assignment
                        gender: profile.gender || null
                    },
                    providerType: AuthProviderEnums.GOOGLE,
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
            `client_id=${this.googleConfig.client_id}`,
            `redirect_uri=${this.googleConfig.oauth_redirect_uri}`,
            `response_type=${this.googleConfig.response_type}`,
            `scope=${this.googleConfig.scopes.join(' ')}`
        ];
        const redirect_uri: string = `${this.googleConfig.login_dialog_uri}?${queryParams.join('&')}`;

        return {
            redirect_uri
        };
    }

    async requestProviderLogIn(data: {code: string}): Promise<any> {
        const code: string = data.code;
        let response;

        response = await wrappedRequest({
            method: 'POST',
            url: this.googleConfig.access_token_uri,
            form: {
                code,
                client_id: this.googleConfig.client_id,
                client_secret: this.googleConfig.client_secret,
                redirect_uri: this.googleConfig.oauth_redirect_uri,
                grant_type: this.googleConfig.grant_type
            },
            json: true
        });

        const { access_token } = response.data;

        response = await wrappedRequest({
            method: 'POST',
            url: `${this.url}${ROUTE_PREFIX}/auth/google/token`,
            form: {
                access_token
            },
            json: true
        });

        return response.data.data;
    }
}
