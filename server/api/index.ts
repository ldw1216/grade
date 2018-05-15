import * as Router from 'koa-router';
import * as recursive from 'recursive-readdir';
import Role, { permissions } from '../config/role';
const api = new Router();
export default api;

api.use(async (ctx, next) => {
    console.log(ctx.path, ctx.method);
    if (['/sign/login'].includes(ctx.url)) return await next();
    if (!ctx.session!.user) ctx.throw(401, 'NOT LOGIN');

    if (ctx.session!.user.role.includes(Role.管理员)) return await next();
    // 权限 评分人可以访问的接口
    if (ctx.session!.user.role.includes(Role.评分人) && permissions[Role.评分人].some(item => item.method.includes(ctx.method) && item.path.test(ctx.path))) return await next();
    ctx.throw('401', '您没有权限');
    console.log(ctx.session);
    await next();
});

// 加载所有路由
recursive(__dirname)
    .then(files => files.filter(item => item.includes('.router.') && !item.includes('.js.map')))
    .then(files => files.map(item => item.replace(__dirname, '.')))
    .then(routers => routers.map(routeFile => {
        const router = require(routeFile).default || require(routeFile);
        if (router && router.routes) {
            api.use(router.routes());
        }
    }));