export const PartialAuthorization = {
    authorization: {
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