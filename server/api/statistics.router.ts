/**
 * 评分项管理
 */

import * as Router from 'koa-router';
import { GradeRelationModel } from '../models/GradeRelation';
import { PeriodModel } from '../models/Period';
import { GraderRoleModel } from '../models/GraderRole';

const router = new Router({ prefix: '/statistics' });
const emit = (key: any, val: any) => 0;
export default router;

// 统计每个打被评分人的得分
router.get('/average', async ctx => {
    const periodId = ctx.query.periodId;
    const rates = await GradeRelationModel.mapReduce({
        map: function () {
            const doc = this as any;
            doc.rates.map((item: any) => {
                if (doc.byGraders.some((item1: any) => item1.toString() === item.byGrader.toString()))
                    emit({ byGrader: item.byGrader, graderRole: doc.graderRole }, item.rateTotal);
            });
        },
        reduce: function (key: string, values: any) {
            return values.reduce((x: number, y: number) => x + y, 0) / values.length;
        },
        query: { period: periodId },
    })
        .then(res => res.results)
        .then(res => res.map((item: any) => ({ ...item._id, averageRate: item.value })));
    const byGraders: { _id: string, id: string, name: string }[] = await PeriodModel.findById(periodId).populate('byGraders.uid', ['name'])
        .then(res => res!.toJSON().byGraders.map((item: any) => ({ ...item.uid })));
    const roles = await GraderRoleModel.find({ period: periodId, removed: false }, { name: 1 });
    ctx.body = { rates, roles, byGraders };
});

// 按打分人统计： 对哪些人已经评分，可以点开查看评分细节； 对哪些人还没有评分，不可以点开
router.get('/grade', async ctx => {
    const periodId = ctx.query.periodId;
    const graders = await GradeRelationModel.find({ period: periodId, removed: false }, { byGraders: 1, 'rates.byGrader': 1, 'rates.rateTotal': 1, grader: 1, graderRole: 1 })
        .populate('graderRole', ['name'])
        .populate('byGraders', ['name'])
        .populate('grader', ['name']);
    ctx.body = { graders };
});
// GradeRelationModel.find({ period: '5acf85c3c4bb181182822afe', removed: false }, { byGraders: 1, 'rates.byGrader': 1, 'rates.rateTotal': 1, grader: 1, graderRole: 1 })
//     .populate('graderRole', ['name'])
//     .populate('byGraders', ['name'])
//     .populate('grader', ['name'])
//     .then(res => console.log(res[0]));