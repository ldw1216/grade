/**
 * 打分人角色
 */

import * as Router from 'koa-router';
import { GraderRoleModel } from '../models/GraderRole';
import { PeriodModel } from '../models/Period';
const router = new Router({ prefix: '/graderRole' });
export default router;

// 新增、保存
router.post('/', async ctx => {
    const { _id, ...body } = ctx.request.body;
    if (_id) {
        await GraderRoleModel.findByIdAndUpdate(_id, body, { new: true });
    } else await new GraderRoleModel(body).save();
    ctx.body = { message: '保存成功' };
});

// 列表
router.get('/', async ctx => {
    const period = await PeriodModel.findById(ctx.query.periodId, { published: 1 });
    const list = await GraderRoleModel.find({ removed: false, period: ctx.query.periodId });
    ctx.body = { list, published: period!.published };
});

// 删除
router.delete('/:id', async ctx => {
    await GraderRoleModel.findByIdAndUpdate(ctx.params.id, { removed: true });
    ctx.body = { message: '删除成功' };
});

// const a = {
//     id: 0.13047370872810315,
//     name: '323322',
//     remark: '32233',
//     periodId: '5acf85c3c4bb181182822afe'
// };

// GraderRoleModel.findByIdAndUpdate()
