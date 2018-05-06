import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import {
    FacebookDto, GetUserWithPasswordResetTokenDto, GoogleDto, LoginDto, PasswordResetDto, PasswordResetRequestDto,
    RegisterDto
} from './auth.dto';

import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

    }

    @Post('/register')
    public async register(@Body() body: RegisterDto) {
        return await this.authService.register(body);
    }

    @Post('/login')
    public async login(@Body() body: LoginDto) {
        return await this.authService.login(body.email, body.password);
    }

    @Post('/facebook')
    @ApiOperation({
        title: 'Facebook login and sign up.',
        description: `Can be with sdk=true and than accessToken is required.
        Without sdk code, clientId, and redirectUri are required.`
    })
    public async facebook(@Body() body: FacebookDto) {
        return await this.authService.facebook(body);
    }

    @Get('/facebook/callback')
    @ApiOperation({
        title: 'Facebook login and sign up.',
        description: `Can be with sdk=true and than accessToken is required.
        Without sdk code, clientId, and redirectUri are required.`
    })
    public async facebookCallback(@Query() query: FacebookDto) {
        return await this.authService.facebook(query);
    }

    @Post('/google')
    @ApiOperation({
        title: 'Google login and sign up.',
        description: `Can be with sdk=true and than accessToken is required.
        Without sdk code, clientId, and redirectUri are required.`
    })
    public async google(@Body() body: GoogleDto) {
        return await this.authService.facebook(body);
    }

    @Get('/google/callback')
    @ApiOperation({
        title: 'Google login and sign up.',
        description: `Can be with sdk=true and than accessToken is required.
        Without sdk code, clientId, and redirectUri are required.`
    })
    public async googleCallback(@Query() query: GoogleDto) {
        return await this.authService.facebook(query);
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