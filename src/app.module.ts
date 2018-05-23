import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './user/user.module';
import { RepositoryModule } from './repository/repository.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { JWTParse } from './auth/auth.middleware';
import { UserRoutesToken } from './user/user.constants';
import { ROUTE_PREFIX } from './app.constants';

@Module({
    imports: [
        CommonModule,
        MongooseModule.forRoot(process.env.DB_URL),
        RepositoryModule,
        UsersModule,
        AuthModule,
        AuthorizationModule
    ],
    providers: []
})
export class ApplicationModule implements NestModule{
    constructor() {}

    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(JWTParse)
            .forRoutes({path: '*', method: RequestMethod.ALL} as any);
    }
}
