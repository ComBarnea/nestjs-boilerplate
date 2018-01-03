import { Module, NestModule, forwardRef, MiddlewaresConsumer, Component } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'User',
            schema: UserSchema
        }]),
        forwardRef(() => AuthModule)
    ],
    components: [],
    controllers: [UsersController],
    exports: [MongooseModule]
})
export class UsersModule implements NestModule {
    constructor() {

    }

    public configure(consumer: MiddlewaresConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
