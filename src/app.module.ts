import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './user/user.module';
import { RepositoryModule } from './repository/repository.module';
import { AuthorizationModule } from './authorization/authorization.module';

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
export class ApplicationModule {}
