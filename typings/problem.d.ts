interface IProblem {
    _id: string,
    title: string,
    order: number,
    score: number,
    period: string | IPeriod,
    graderRole: string | any,
    remark: string,
}