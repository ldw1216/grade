/**
 * 打分人角色
 */

import * as Router from 'koa-router';
import { PeriodModel } from '../models/Period';
const router = new Router({ prefix: '/byGrader' });
export default router;

// 新增、保存
router.post('/', async ctx => {
    const byGraders = ctx.request.body;
    await PeriodModel.findByIdAndUpdate(ctx.query.periodId, { byGraders }, { new: true });
    ctx.body = { message: '保存成功' };
});

// 列表
router.get('/', async ctx => {
    ctx.body = await PeriodModel.findOne({ removed: false, _id: ctx.query.periodId }).populate('byGraders.uid', ['name']);
});
