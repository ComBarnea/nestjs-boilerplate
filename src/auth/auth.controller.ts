import { Controller, Post, Body, Query } from '@nestjs/common';
import { FacebookDto, FacebookDtoQuery, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import {ApiOperation} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

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
    public async facebook(@Query() query: FacebookDtoQuery, @Body() body: FacebookDto) {

        return await this.authService.facebook(Object.assign({}, query, body));
    }
}