export interface AuthToken {
    accessToken: string;
    kind: string;
}

export interface IUser {
    readonly email: string;
    readonly facebook: string;
    readonly tokens: AuthToken[];

    readonly firstName: string;
    readonly lastName: string;
    readonly gender: string;
    readonly profilePicture: string;
}

export interface ICreateUser {
    email: string;
    facebook?: string;
    tokens?: AuthToken[];
    firstName?: string;
    lastName?: string;
    gender?: string;
    profilePicture?: string;
}