import { Controller, Get, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRoutesToken } from './user.constants';

import { ReflectMetadata } from '@nestjs/common/utils/decorators/reflect-metadata.decorator';
import {} from '';
import { IServerRequest } from '../types/main.types';
import { AuthValidationInterceptor } from '../authorization/interceptors/auth.validation.interceptor';
import { APP_REFLECTOR_TOKENS } from '../app.constants';

@UseInterceptors(AuthValidationInterceptor)
@Controller(UserRoutesToken.root)
export class UsersController {
    constructor(
        private userService: UsersService
    ) {}

    @ReflectMetadata(APP_REFLECTOR_TOKENS.authPermission, ['view'])
    @Get(`/${UserRoutesToken.singleUser}`)
    public getUserById(@Req() req: IServerRequest,@Param() params: {userId: string}) {

        return this.userService.findUserById({_id: params.userId});
    }
}