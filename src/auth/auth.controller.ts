import { Controller, Post, Body, Query } from '@nestjs/common';
import {FacebookDto, LoginDto} from './auth.dto';
import { AuthService } from './auth.service';

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
    public async facebook(@Query() query: FacebookDto, @Body() body: FacebookDto) {

        return await this.authService.facebook(Object.assign({}, query, body));
    }
}