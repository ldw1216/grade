import * as Router from 'koa-router';
import { PeriodModel } from '../models/Period';
const router = new Router({ prefix: '/period' });
export default router;

// 新增
router.post('/add', async ctx => {
    const doc = await new PeriodModel(ctx.request.body).save();
    ctx.body = { message: '保存成功', _id: doc._id };
});

// 列表
router.get('/list', async ctx => {
    ctx.body = await PeriodModel.find({ removed: false });
});

// 编辑
router.get(['/edit/:id', '/:id'] as any, async ctx => {
    ctx.body = await PeriodModel.findById(ctx.params.id);
});

// 编辑
router.post('/edit/:id', async ctx => {
    await PeriodModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = { message: '保存成功', _id: ctx.params.id };
});

// 删除
router.delete('/:id', async ctx => {
    await PeriodModel.findByIdAndRemove(ctx.params.id);
    ctx.body = { message: '删除成功' };
});
