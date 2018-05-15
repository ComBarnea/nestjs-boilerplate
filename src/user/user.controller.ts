import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRoutesToken } from './user.constants';

@Controller(UserRoutesToken.root)
export class UsersController {
    constructor(
        private userService: UsersService
    ) {}

    @Get(`/${UserRoutesToken.singleUser}`)
    public getUserById(@Param() params: {userId: string}) {
        return this.userService.findUserById({_id: params.userId});
    }
}