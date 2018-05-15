# grade 莱盛打分系统


> 本系统使用node + koa2 + mongodb + react + typescript 技术栈开发 开发工具使用vscode

## 运行方式
+ 开发环境  npm run dev
+ 生产环境  建议使用pm2  pm2 startOrRestart ecosystem.config.js --env production
+ 自动部署  使用git提交代码后，系统会自动更新并部署

## 文件结构
+ src 前端文件
+ server 后端文件
+ server/api 后端接口文件  凡是此文件夹下的文件名包含 .router. 的文件自动加载并挂载到/ 大多数 api 请求地址与当前页面url一致
+ server/models 数据库文件 凡是大写字母开头的文件自动加载



## 添加路由文件
只要增加 .router.ts结尾的文件就可以自动被加载路由，该文件需要导出 default router，
示例：
```javascript
import * as Router from 'koa-router';
const router = new Router({ prefix: '/sign' });
export default router;

router.get('/', async ctx => {
    ctx.body = {
        aa: 33
    };
});
```

# 表单样式
+ .form1 下面的 .formItem 内部自动对齐表单，如果需要控制输入框长度可设置 .formItem 下div的宽度 例：
```html
    <form className="form1">
        <div className="formItem">
            <label>真实姓名</label>
            <div><Input /></div>
        </div>
    </form>
```
+ .form1>table 下面的表格自动 或table.form 自动具备表单样式，如：
```html
<table className="form">
    <tr>
        <td>真实姓名：</td>
        <td><Input /></td>
    </tr>
    <tr>
        <td>真实姓名：</td>
        <td><Input /></td>
    </tr>
</table>
```