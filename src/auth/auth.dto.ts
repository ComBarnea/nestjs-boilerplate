import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
    @ApiModelProperty()
    readonly email: string;
    @ApiModelProperty()
    readonly password: string;
}

export class RegisterDto {
    @ApiModelProperty()
    readonly email: string;
    @ApiModelProperty()
    readonly password: string;
    @ApiModelProperty()
    readonly firstName: string;
    @ApiModelProperty()
    readonly lastName: string;
}

export class FacebookDto {
    @ApiModelPropertyOptional()
    readonly sdk?: boolean;
    @ApiModelPropertyOptional()
    readonly accessToken?: string;
    @ApiModelPropertyOptional()
    code?: string;
    @ApiModelPropertyOptional()
    clientId?: string;
    @ApiModelPropertyOptional()
    redirectUri?: string;
}

export class FacebookDtoQuery {
    @ApiModelPropertyOptional()
    readonly sdk?: boolean;
}

export class PasswordResetRequestDto {
    @ApiModelPropertyOptional()
    readonly email: string;
}

export class GetUserWithPasswordResetTokenDto {
    @ApiModelPropertyOptional()
    readonly token: string;
}

export class PasswordResetDto {
    @ApiModelPropertyOptional()
    readonly token: string;
    @ApiModelPropertyOptional()
    readonly newPassword: string;
}