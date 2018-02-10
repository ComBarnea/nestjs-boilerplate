import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) {}

    @Get('/:userId([0-9a-f]{24})')
    public getUserById(@Param() params: {userId: string}) {
        return this.userService.findUserById({_id: params.userId});
    }
}