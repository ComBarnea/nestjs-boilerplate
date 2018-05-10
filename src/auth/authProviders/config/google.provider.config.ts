export interface IGoogleConfig {
    login_dialog_uri: string;
    client_id: string;
    client_secret: string;
    oauth_redirect_uri: string;
    access_token_uri: string;
    response_type: string;
    scopes: string[];
    grant_type: string;
}

export const googleConfig: IGoogleConfig = {
  login_dialog_uri: 'https://accounts.google.com/o/oauth2/auth',
  client_id: process.env.GOOGLE_ID,
  client_secret: process.env.GOOGLE_SECRET,
  oauth_redirect_uri: 'http://localhost:4200/recipes',
  access_token_uri: 'https://accounts.google.com/o/oauth2/token',
  response_type: 'code',
  scopes: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ],
  grant_type: 'authorization_code'
};
