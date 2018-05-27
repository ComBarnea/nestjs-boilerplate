export const PartialDelete = {
    deletedAt: {
        type: Date,
        default: null
    }
};

export interface ISingleDelete {
    deletedAt: Date;
}