export class LoginDto {
    readonly email: string;
    readonly password: string;
}

export class FacebookDto {
    readonly sdk?: boolean;
    readonly accessToken?: string;
    code?: string;
    clientId?: string;
    redirectUri?: string;
}