interface IGraderRole {
    _id: string
    name: string,
    period: string | IPeriod,
    removed: boolean,
    remark: string,
}