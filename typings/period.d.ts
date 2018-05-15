interface IPeriod {
    _id: string;
    name: string;
    begin: Date | string;
    end: Date | string;
    published: boolean;
    byGraders: {_id: string, uid: string | IUser, remark: string}[]
    removed: boolean;
    remark: string;
}