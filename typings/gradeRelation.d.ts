interface IGradeRelation {
    grader: string | IUser
    period: string | IPeriod
    graderRole: string | IGraderRole
    byGraders: string[] | IUser[]
    rates: { byGrader: string | IUser, problems:{problem: string | IProblem, rate: number, description: string}[], rateTotal: number }[],
    removed: boolean,
    remark: string,
}