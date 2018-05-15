/**
 * 评分项管理
 */

import * as Router from 'koa-router';
import { ProblemModel } from '../models/Problem';
const router = new Router({ prefix: '/problem' });
export default router;

// 新增、保存
router.post('/', async ctx => {
    const { _id, ...body } = ctx.request.body;
    if (_id) {
        await ProblemModel.findByIdAndUpdate(_id, body, { new: true });
    } else await new ProblemModel(body).save();
    ctx.body = { message: '保存成功' };
});

// 列表
router.get('/', async ctx => {
    const { periodId: period, graderRoleId } = ctx.query;
    const condition = { removed: false, period } as any;
    if (graderRoleId) condition.graderRole = graderRoleId;
    ctx.body = await ProblemModel.find(condition).sort('order');
});

// 删除
router.delete('/:id', async ctx => {
    await ProblemModel.findByIdAndRemove(ctx.params.id);
    ctx.body = { message: '删除成功' };
});

// const a = {
//     id: 0.13047370872810315,
//     name: '323322',
//     remark: '32233',
//     periodId: '5acf85c3c4bb181182822afe'
// };

// GraderRoleModel.findByIdAndUpdate()
