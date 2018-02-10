import { Module, NestModule, forwardRef, MiddlewaresConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsAuthenticated } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'User',
            schema: UserSchema
        }]),
        forwardRef(() => AuthModule)
    ],
    components: [UsersService],
    controllers: [UsersController],
    exports: [MongooseModule, UsersService]
})
export class UsersModule implements NestModule {
    constructor() {

    }

    public configure(consumer: MiddlewaresConsumer) {
        consumer.apply(IsAuthenticated).forRoutes(UsersController);
    }
}
