
import {Controller, Post, Body, Query, Get} from '@nestjs/common';
import {FacebookDto, LoginDto, RegisterDto} from './auth.dto';

import { AuthService } from './auth.service';
import {ApiOperation} from '@nestjs/swagger';

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
}