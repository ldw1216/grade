import * as Router from 'koa-router';
import { UserModel } from '../models/User';
const router = new Router({ prefix: '/user' });
export default router;

// 新增
router.post('/add', async ctx => {
    await new UserModel(ctx.request.body).save();
    ctx.body = { message: '保存成功！' };
});

// 列表
router.get('/list', async ctx => {
    const role = ctx.query.role;
    const condition = role ? { role } : { removed: false };
    ctx.body = await UserModel.find(condition, { password: 0 });
});

// 编辑
router.get('/edit/:id', async ctx => {
    ctx.body = await UserModel.findById(ctx.params.id, { name: 1, phone: 1, role: 1, remark: 1 });
});

// 编辑
router.post('/edit/:id', async ctx => {
    await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = { message: '保存成功！' };
});

// 重置密码
router.get('/resetPassword/:id', async ctx => {
    await UserModel.findByIdAndUpdate(ctx.params.id, { password: '111111' }, { new: true });
    ctx.body = { message: '重置密码成功！' };
});

router.delete('/:id', async ctx => {
    await UserModel.findByIdAndUpdate(ctx.params.id, {removed: true});
    ctx.body = { message: '删除成功' };
});