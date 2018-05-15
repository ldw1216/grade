/**
 * 打分
 */
import * as Router from 'koa-router';
import { PeriodModel } from '../models/Period';
import { GradeRelationModel } from '../models/GradeRelation';
import { ProblemModel } from '../models/Problem';
import { UserModel } from '../models/User';
import { GraderRoleModel } from '../models/GraderRole';
const router = new Router({ prefix: '/grade' });
export default router;

// 选择评分周期
router.get('/choosePeriod', async ctx => {
    ctx.body = await PeriodModel.find({ removed: false, published: true, begin: { $lte: new Date() }, end: { $gte: new Date() } }, { name: 1 });
});

// 被评分人列表
router.get('/byGrader', async ctx => {
    const graderId = ctx.session!.user.id;
    const periodId = ctx.query.periodId;
    const roles = await GradeRelationModel.find({ removed: false, grader: graderId, period: periodId }, { graderRole: 1, byGraders: 1, rates: 1 })
        .populate('byGraders', ['name'])
        .populate('graderRole', ['name'])
        .then((list: any[]) => {
            if (list.length === 0) return [];
            return list.map(doc => ({
                _id: doc._id,
                graderRoleId: doc.graderRole._id,
                graderRoleName: doc.graderRole.name,
                list: doc.byGraders,
                rates: doc.rates,
            }));
        });
    ctx.body = roles;
});

// 打分题目
router.get('/grade', async ctx => {
    const { periodId, graderRoleId, byGraderId, gradeRelationId } = ctx.query;
    const byGrader = byGraderId === 'preview' ? { name: '预览' } : await UserModel.findById(byGraderId, { name: 1 });
    const problems = await ProblemModel.find({ removed: false, period: periodId, graderRole: graderRoleId }).sort('order');
    const period = await PeriodModel.findById(periodId, { name: 1 });
    const graderRole = await GraderRoleModel.findById(graderRoleId, { name: 1 });
    let rateRes = [] as any[];
    let grader = {} as {name: string, _id: string};
    if (gradeRelationId) {
        const gradeRelation = await GradeRelationModel.findById(gradeRelationId).populate('grader', ['name']);
        const rate = gradeRelation!.rates.find(item => item.byGrader.toString() === byGraderId);
        if (rate) {
            rateRes = rate.problems;
        }
        grader = gradeRelation!.grader as any;
    }

    ctx.body = { list: problems, grader, byGraderName: byGrader!.name, periodName: period!.name, graderRoleName: graderRole!.name, rateRes };
});

// 提交打分结果
router.post('/grade', async ctx => {
    const { byGraderId, gradeRelationId } = ctx.query;
    const gradeRelation = await GradeRelationModel.findById(gradeRelationId);
    const rate = gradeRelation!.rates.find(item => item.byGrader.toString() === byGraderId);
    const rateTotal = ctx.request.body.reduce((x: number, y: any) => x + y.rate, 0);
    if (rate) {
        rate.rateTotal = rateTotal;
        rate.problems = ctx.request.body;
    } else {
        gradeRelation!.rates.push({ byGrader: byGraderId, rateTotal, problems: ctx.request.body });
    }
    await gradeRelation!.save();
    ctx.body = { message: '提交成功！' };
});