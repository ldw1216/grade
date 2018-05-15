import * as Koa from 'koa';
import * as session from 'koa-session';
import * as koaStatic from 'koa-static';
import * as path from 'path';
import { createServer } from 'http';
import api from './api/';
import './models';
import * as fs from 'fs';
import * as shelljs from 'shelljs';

if (process.env.NODE_ENV === 'development') {
    shelljs.exec('ln server/config/** src/config/');
}

const logger = require('koa-logger');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const port = process.env.PORT || 8001;

createServer(app.callback()).listen(port, () => console.log('api 启动： http://localhost:' + port));

if (process.env.NODE_ENV === 'production') {
    const template = fs.readFileSync(path.resolve('build', 'index.html'), 'utf-8');
    app.use(koaStatic(path.resolve('build')));
    app.use(async (ctx, next) => {
        if (ctx.accepts('html', 'json') === 'html') return ctx.body = template;
        return await next();
    });
} else {
    app.use(koaStatic(path.resolve('public')));
}

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
        text: ['text/xml', 'application/xml'],
    },
}));
app.use(json());

app.keys = ['lai sh'];

app.use(session({
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
} as {}, app));

app.use(logger());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { message: err.message, errorCode: ctx.status, name: err.name };
        console.log(err);
    }
});

app.use(api.routes());
export default app;
process.on('unhandledRejection', (reason) => {
    // tslint:disable-next-line:no-console
    console.error('reason:', reason, reason.stack);
});
