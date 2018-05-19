import { Inject, Injectable } from '@nestjs/common';
import { UserModel as IUserModel } from '../user/user.provider';
import { Model, set as mongooseSet} from 'mongoose';
import { APP_TOKENS } from '../app.constants';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

mongooseSet('debug', true);
@Injectable()
export class RepositoryService {
    private models = {};

    constructor(
        @Inject('Context') private ctx: any,
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
        mongooseModel.find = this.find(mongooseModel, mongooseModel.find);
        mongooseModel.findOne = this.findOne(mongooseModel, mongooseModel.findOne);

        return mongooseModel;
    }

    private find(mongooseModel, orgMethod) {
        return this.methodOverride(mongooseModel, orgMethod);
    }

    private findOne(mongooseModel, orgMethod) {
        return this.methodOverride(mongooseModel, orgMethod);
    }

    private methodOverride(mongooseModel, orgMethod) {
        return (...args) => {
            const queryPart = args[0];
            const schemaDef = mongooseModel.schema;

            if (schemaDef.obj.authS) {
                const ctxAuthPart = this.ctx.get(APP_TOKENS.partialAuthQuery);

                _.assign(queryPart, ctxAuthPart);
            }
            return orgMethod.call(mongooseModel, ...args);
        };
    }
}
