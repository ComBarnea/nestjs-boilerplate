import { Controller, Get, Param, Req, UseGuards, UseInterceptors, Put, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRoutesToken } from './user.constants';

import { IServerRequest } from '../types/main.types';
import { AuthValidationInterceptor } from '../authorization/interceptors/auth.validation.interceptor';
import { AuthPermissions } from '../authorization/decorators/autorization.decorators';
import { IUpdateUserDTO } from './user.types';

@UseInterceptors(AuthValidationInterceptor)
@Controller(UserRoutesToken.root)
export class UsersController {
    constructor(
        private userService: UsersService
    ) {}

    @AuthPermissions(['view'])
    @Get(`/`)
    public async getUsers(@Req() req: IServerRequest) {

        return this.userService.findUsers({});
    }

    @AuthPermissions(['view'])
    @Get(`/${UserRoutesToken.singleUser}`)
    public async getUserById(@Req() req: IServerRequest,@Param() params: {userId: string}) {

        const ans = await this.userService.findUserById({_id: params.userId});

        return ans;
    }

    @AuthPermissions(['edit'])
    @Put(`/${UserRoutesToken.singleUser}`)
    public async updateUserById(@Req() req: IServerRequest,@Param() params: {userId: string}, @Body() body: IUpdateUserDTO) {

        const ans = await this.userService.updateOne({_id: params.userId}, body);

        return ans;
    }
}