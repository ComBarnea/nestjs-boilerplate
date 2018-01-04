import {ApiModelProperty} from '@nestjs/swagger';

export class LoginDto {
    @ApiModelProperty()
    readonly email: string;
    @ApiModelProperty()
    readonly password: string;
}

export class FacebookDto {
    @ApiModelProperty()
    readonly sdk?: boolean;
    @ApiModelProperty()
    readonly accessToken?: string;
    @ApiModelProperty()
    code?: string;
    @ApiModelProperty()
    clientId?: string;
    @ApiModelProperty()
    redirectUri?: string;
}