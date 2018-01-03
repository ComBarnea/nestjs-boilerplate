export interface AuthToken {
    accessToken: string;
    kind: string;
}

export interface IUser {
    readonly email: string;
    readonly facebook: string;
    readonly tokens: AuthToken[];

    readonly name: string;
    readonly gender: string;
    readonly profilePicture: string;
}