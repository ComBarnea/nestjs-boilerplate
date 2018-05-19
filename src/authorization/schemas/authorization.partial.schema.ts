export const PartialAuthorization = {
    authS: {
        select: process.verbose_api ? true : false,
        type: []
    }
};

export interface ISingleAuth {
    parentId?: string;
    parentType?: string;
    groupId: string;
    rules: {
        view: Boolean;
        edit: Boolean;
        remove: Boolean;
        create: Boolean;
        editRules: any[];
    };
}