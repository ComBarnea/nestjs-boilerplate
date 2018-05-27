import { HttpException, Inject, Injectable } from '@nestjs/common';
import { APP_TOKENS } from '../app.constants';
import { RepositoryService } from '../repository/repository.service';
import { IPartialGroupAuth } from '../auth/auth.types';
import * as _ from 'lodash';
import { IAuthParentPipe } from './decorators/autorization.decorators';

const MAX_USER_GROUPS = 3;

@Injectable()
export class AuthorizationService {
    groupsModel: any;

    constructor(
        @Inject('Context') private ctx: any,
        @Inject(RepositoryService) private repositoryService: RepositoryService,
    ) {
        this.groupsModel = this.repositoryService.getModel(APP_TOKENS.authGroupsModel);

    }
    public async addUserBasicGroups(user) {
        const basicGroup = this.getBasicGroup();
        basicGroup.name = `${user._id}_basic_group`;
        basicGroup.members[0].parentId = String(user._id);
        basicGroup.members[0].parentType = APP_TOKENS.userModel;

        const newGroup = await this.groupsModel.create(basicGroup);

        return [newGroup];
    }

    /**
     *
     * @param {string} userId
     * @param {number} depth
     * @param {string[]} foundGroups
     * @return {Promise<any>}
     * TODO: Need to add cache
     */
    public async getUserGroups(userId: string, depth?: number, foundGroups?: string[]) {
        let tempGroups: any[];
        if (!foundGroups) foundGroups = [];
        if (!depth) depth = 0;
        if (depth >= MAX_USER_GROUPS) return foundGroups;

        const findQuery = {
            members:  {
                $in: [
                    {
                        parentId: userId,
                        parentType: APP_TOKENS.userModel
                    }
                ]
            }
        } as any;

        if (foundGroups && foundGroups.length) {
            foundGroups.forEach((g) => {
                findQuery.members.$in.push({
                    parentId: g,
                    parentType: APP_TOKENS.authGroupsModel
                });
            });

            findQuery._id = {
                $nin: foundGroups
            };
        }

        tempGroups = await this.groupsModel.find(findQuery, '_id');
        if (!tempGroups.length) return foundGroups;

        tempGroups.forEach((tg) => {
            const foundInside = foundGroups.find((g) => g === tg._id);

            if (!foundInside) foundGroups.push(String(tg._id));
        });

        return this.getUserGroups(userId, depth + 1, foundGroups);

    }

    public async constructAuthQueryPart(groups: string[], permissionNeeded: {name: string}[]) {
        const queryPartialAuth = {
            $or: []
        };

        if (!(groups && groups.length) || !(permissionNeeded && permissionNeeded.length)) return queryPartialAuth;

        groups.forEach((g) => {
            permissionNeeded.forEach((p) => {
                const newPart = this.getBasicAuthPart();
                newPart[`authorization.groupId`] = g;
                newPart[`authorization.rules.${[p.name]}`] = true;

                queryPartialAuth.$or.push(newPart);
            });
        });

        return queryPartialAuth;
    }

    public async constructAuthQueryPartByUser(authPermissions, userId: string) {
        const foundGroups = await this.getUserGroups(userId);

        // TODO: add fine grain control over this
        foundGroups.push('everyone');

        const partialAuthQuery = await this.constructAuthQueryPart(foundGroups, authPermissions.map((a) => {
            return {
                name: a
            };
        }));

        return partialAuthQuery;
    }

    private getBasicAuthPart() {
        return {

        };
    }

    private getBasicGroup() {
        return {
            members: [{
                parentId: null,
                parentType: null
            }],
            name: null
        };
    }

    public async preValidateResource(partialAuthParentOverRide?: IAuthParentPipe, authorizationOverRide?: any[]): Promise<any> {
        let partialAuthParent: IAuthParentPipe = this.ctx.get(APP_TOKENS.partialAuthParent);

        if (partialAuthParentOverRide) partialAuthParent = partialAuthParentOverRide;

        if (!partialAuthParent) return;
        if (!partialAuthParent.parentId || !partialAuthParent.parentType) throw new HttpException('Authorization not found.', 401);

        const parentModel: any = this.repositoryService.getModel(partialAuthParent.parentType);
        const foundParent = await parentModel.findOne({_id: partialAuthParent.parentId}, `authorization`);

        if (!foundParent) throw new HttpException('Authorization not found.', 401);

        return await this.validateResource(foundParent, authorizationOverRide);
    }

    public async validateResource(resource: IPartialGroupAuth, authorizationOverRide?: any[], keepAuth?: boolean): Promise<any> {
        if (!resource) return;
        if (!resource.authorization) return;

        let authorizationQuery = this.ctx.get(APP_TOKENS.partialAuthQuery);

        if (authorizationOverRide && authorizationOverRide.length) {
            authorizationQuery = {$or: authorizationOverRide};
        }

        const foundPermission = validateResourceWithAuthorizationGroupList(resource, authorizationQuery.$or);

        if (!foundPermission)  throw new HttpException('Authorization not found.', 401);

        // TODO: TEMP solution until proper DTO's
        if (!keepAuth)  {
            resource = this.cleanAuth(resource) as any;
        }

        return resource;
    }

    public cleanAuth(data: IPartialGroupAuth | IPartialGroupAuth[]) {
        if (_.isArray(data)) {
            data.forEach((singleDoc) => {
                applyDocMutation(singleDoc);
            });

            return data;
        } else {
            applyDocMutation(data);

            return data;
        }

        function applyDocMutation(doc) {
            if ((doc as any).set) (doc as any).set('authorization', null);
            if ((doc as any)._doc) delete (doc as any)._doc.authorization;

            delete doc.authorization;
        }
    }

    public extendQueryWithAuthorization(query: IPartialGroupAuth): any {
        const authorizationQuery = this.ctx.get(APP_TOKENS.partialAuthQuery);
        const cloneQuery = _.cloneDeep(query);
        _.assign(cloneQuery, authorizationQuery);

        return cloneQuery;
    }
}

function validateResourceWithAuthorizationGroupList(resource: IPartialGroupAuth, authorizationList: any[]): boolean {
    let foundPermission = false;

    if (authorizationList && authorizationList.length) {
        authorizationList.forEach((singlePerReq) => {
            const singlePerRequest = _.cloneDeep(singlePerReq);

            Object.keys(singlePerRequest).forEach((key) => {
                if (key.includes('authorization.')) {
                    singlePerRequest[key.replace('authorization.', '')] = singlePerRequest[key];

                    delete singlePerRequest[key];
                }
            });

            resource.authorization.forEach((singlePer) => {
                if (singlePer.groupId === singlePerRequest.groupId) {
                    Object.keys(singlePerRequest).forEach((key) => {
                        if (key.includes('rules')) {
                            const ruleKey = key.replace('rules.', '');

                            if (singlePer.rules[ruleKey] === singlePerRequest[key]) foundPermission = true;
                        }
                    });
                }
            });
        });
    }

    return foundPermission;
}