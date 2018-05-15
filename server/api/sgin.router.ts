import * as Router from 'koa-router';
import { UserModel } from '../models/User';
import Role from '../config/role';
const router = new Router({ prefix: '/sign' });
export default router;

/**
 * 登录
 * 如果是管理员则跳转到后台管理页面
 * 如果是评分人员，则跳转到评分页面
 */
router.post('/login', async ctx => {
    const { name, password } = ctx.request.body;
    let redirect = '/';
    const user = await UserModel.findOne({ $or: [{ name }, { phone: name }], password, removed: false }, { password: 0 });
    if (user === null) { return ctx.throw(403, '用户名或密码错误，登录失败'); }
    // 将user 保存到session
    ctx.session!.user = user.toJSON();
    if (user.role!.includes(Role.管理员)) redirect = '/period/list';
    else if (user.role!.includes(Role.评分人)) redirect = '/grade/chooseByGrader';
    return ctx.body = { message: '登录成功', redirect };
});

// 退出登录
router.all('/logout', async ctx => {
    ctx.session!.user = null;
    ctx.body = { msg: '退出成功！' };
});

// 获取用户个人信息
router.get('/me', async ctx => {
    const user = await UserModel.findById(ctx.session!.user._id);
    const { password, ...userInfo } = user!.toJSON();
    ctx.body = { ...userInfo, firstLogin: password === '111111' };
});

// 修改密码
router.post('/alertPassword', async ctx => {
    const { password, originalPassword } = ctx.request.body;
    const user = await UserModel.findById(ctx.session!.user._id);
    if (user!.password !== originalPassword) return ctx.throw('原密码输入不正确！');
    user!.password = password;
    await user!.save().then(console.log);
    return ctx.body = { message: '修改密码成功' };
});