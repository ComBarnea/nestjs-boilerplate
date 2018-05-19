import { Controller, Post, Body, Query, Get, Req, UseInterceptors, ReflectMetadata } from '@nestjs/common';
import {
    FacebookDto, GetUserWithPasswordResetTokenDto, GoogleDto, IToken, LoginDto, PasswordResetDto,
    PasswordResetRequestDto,
    RegisterDto
} from './auth.dto';

import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { IServerRequest } from '../types/main.types';
import { AuthProviderEnums } from './auth.enums';
import { AuthCreateInterceptor } from '../authorization/auth.interceptors';
import { APP_REFLECTOR_TOKENS, APP_TOKENS } from '../app.constants';

@UseInterceptors(AuthCreateInterceptor)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

    }

    @ReflectMetadata(APP_REFLECTOR_TOKENS.modelType, APP_TOKENS.userModel)
    @ReflectMetadata(APP_REFLECTOR_TOKENS.befPipe, (answer) => {
        return answer.data.user;
    })
    @Post('/register')
    async requestJsonWebTokenAfterLocalSignUp(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.createToken(req.user, true);
    }

    @Post('/login')
    async requestJsonWebTokenAfterLocalSignIn(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.createToken(req.user, true);
    }

    @Get('/facebook/uri')
    async requestFacebookRedirectUrl(): Promise<{redirect_uri: string}> {
        const ans =  await this.authService.getProviderRedirectUri<any>(AuthProviderEnums.FACEBOOK, {});

        return ans;
    }

    @Post('/facebook/login')
    async facebookSignIn(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.providerLoginIn<any>(AuthProviderEnums.FACEBOOK, {code: req.body.code});
    }

    @Post('/facebook/token')
    async requestJsonWebTokenAfterFacebookSignIn(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.createToken(req.user, true);
    }

    @Get('/google/uri')
    async requestGoogleRedirectUrl(): Promise<{redirect_uri: string}> {
        const ans =  await this.authService.getProviderRedirectUri<any>(AuthProviderEnums.GOOGLE, {});

        return ans;
    }

    @Post('/google/login')
    async googleSignIn(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.providerLoginIn<any>(AuthProviderEnums.GOOGLE, {code: req.body.code});
    }

    @Post('/google/token')
    async requestJsonWebTokenAfterGoogleSignIn(@Req() req: IServerRequest): Promise<IToken> {
        return await this.authService.createToken(req.user, true);
    }

    @Post('/password-reset-request')
    public async createPasswordResetRequest(@Body() body: PasswordResetRequestDto) {
        return await this.authService.createPasswordResetRequest(body);
    }

    @Get('/password-reset-request')
    public async getUserWithPasswordResetToken(@Query() query: GetUserWithPasswordResetTokenDto) {
        return await this.authService.getUserWithPasswordResetToken(query);
    }

    @Post('/password-reset')
    public async resetUserPassword(@Body() body: PasswordResetDto) {
        return await this.authService.resetUserPassword(body);
    }

}