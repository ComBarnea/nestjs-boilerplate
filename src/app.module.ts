import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL),
        UsersModule,
        AuthModule
    ],
    controllers: [AppController],
    components: []
})
export class ApplicationModule {}
