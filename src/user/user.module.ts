import { Module, NestModule, forwardRef, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { IsAuthenticated } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { ROUTE_PREFIX } from '../app.constants';
import { UserRoutesToken } from './user.constants';
import { RepositoryModule } from '../repository/repository.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CommonModule,
        RepositoryModule,
        AuthorizationModule,
        forwardRef(() => AuthModule)
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule implements NestModule {
    constructor() {}

    public configure(consumer: MiddlewareConsumer) {
        const IsAuthenticatedPathArr = [
            {path: `${ROUTE_PREFIX}/${UserRoutesToken.root}/${UserRoutesToken.singleUser}`, method: RequestMethod.GET},
            {path: `${ROUTE_PREFIX}/${UserRoutesToken.root}`, method: RequestMethod.GET}
        ];

        IsAuthenticatedPathArr.forEach((pathObj: any) => {
            consumer.apply(IsAuthenticated)
                .forRoutes(pathObj);
        });
    }
}
