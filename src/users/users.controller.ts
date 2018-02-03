import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor() {}

    @Get('authorized')
    public async authorized() {
        return '123';
    }
}