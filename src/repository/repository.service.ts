import { Inject, Injectable } from '@nestjs/common';
import { UserModel as IUserModel } from '../user/user.provider';
import { Model, set as mongooseSet } from 'mongoose';
import { APP_TOKENS } from '../app.constants';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';

mongooseSet('debug', true);
@Injectable()
export class RepositoryService {
    private models = {};

    constructor(
        @InjectModel(APP_TOKENS.userModel) readonly userModel: Model<IUserModel>,
        @InjectModel(APP_TOKENS.authGroupsModel) readonly authGroupsModel: Model<any>
    ) {
        this.models[APP_TOKENS.userModel] = userModel;
        this.models[APP_TOKENS.authGroupsModel] = authGroupsModel;
    }

    getModel<T>(tokenString): T {
        return this.overRideModels(this.models[tokenString]);
    }

    private overRideModels(mongooseModel) {
        return mongooseModel;
    }
}