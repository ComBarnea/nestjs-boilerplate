import { Module, NestModule, forwardRef, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsAuthenticated } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { ROUTE_PREFIX } from '../app.constants';
import { UserRoutesToken } from './user.constants';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'User',
            schema: UserSchema
        }]),
        forwardRef(() => AuthModule)
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [MongooseModule, UsersService]
})
export class UsersModule implements NestModule {
    constructor() {}

    public configure(consumer: MiddlewareConsumer) {
        const IsAuthenticatedPathArr = [
            {path: `${ROUTE_PREFIX}/${UserRoutesToken}/${UserRoutesToken.singleUser}`, method: RequestMethod.GET}
        ];

        IsAuthenticatedPathArr.forEach((pathObj: any) => {
            consumer.apply(IsAuthenticated)
                .forRoutes(pathObj);
        });
    }
}
