import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './user/user.module';

@Module({
    imports: [
        CommonModule,
        MongooseModule.forRoot(process.env.DB_URL),
        UsersModule,
        AuthModule
    ],
    providers: []
})
export class ApplicationModule {}
