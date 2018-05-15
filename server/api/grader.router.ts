/**
 * 评分人与被评分人关系
 */

import * as Router from 'koa-router';
import { GradeRelationModel } from '../models/GradeRelation';
const router = new Router({ prefix: '/grader' });
export default router;

// 新增、保存
router.post('/', async ctx => {
    const { _id, ...body } = ctx.request.body;
    console.log(body);
    if (_id) {
        await GradeRelationModel.findByIdAndUpdate(_id, body, { new: true });
    } else await new GradeRelationModel(body).save();
    ctx.body = { message: '保存成功' };
});

// 列表
router.get('/', async ctx => {
    ctx.body = await GradeRelationModel.find({ removed: false, period: ctx.query.periodId });
});

// 删除
router.delete('/:id', async ctx => {
    await GradeRelationModel.findByIdAndRemove(ctx.params.id);
    ctx.body = { message: '删除成功' };
});