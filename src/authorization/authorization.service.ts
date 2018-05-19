import { Inject, Injectable } from '@nestjs/common';
import { APP_TOKENS } from '../app.constants';
import { RepositoryService } from '../repository/repository.service';
import { inspect } from 'util';
const MAX_USER_GROUPS = 3;

@Injectable()
export class AuthorizationService {
    groupsModel: any;

    constructor(
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
                newPart[`authS.groupId`] = g;
                newPart[`authS.rules.${[p.name]}`] = true;

                queryPartialAuth.$or.push(newPart);
            });
        });

        return queryPartialAuth;
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
}