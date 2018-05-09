export interface IFacebookConfig {
    login_dialog_uri: string;
    access_token_uri: string;
    client_id: string;
    client_secret: string;
    oauth_redirect_uri: string;
    state: string;
}

export const facebookConfig: IFacebookConfig = {
    login_dialog_uri: 'https://www.facebook.com/v2.12/dialog/oauth',
    access_token_uri: 'https://graph.facebook.com/v2.12/oauth/access_token',
    client_id: process.env.FACEBOOK_ID,
    client_secret: process.env.FACEBOOK_SECRET,
    oauth_redirect_uri: 'http://localhost:4200/recipes',
    state: '{fbstate}'
};
