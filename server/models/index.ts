import * as fs from 'fs';
import * as mongoose from 'mongoose';

(mongoose as any).Promise = Promise;
mongoose.connect(process.env.MONGOOSE_URI || 'mongodb://localhost/grade', err => {
    // tslint:disable-next-line:no-console
    if (err) { console.log('mongoose链接失败：', err); }
});

if (process.env.MONGOOSE_DEBUG) { mongoose.set('debug', true); }
// mongoose.set('debug', true)
// 加载所有模型（本目录下所有文件）
const files = fs.readdirSync(__dirname);
files.forEach(item => {
    if (/^[A-Z]\w*.[jt]s$/.test(item)) {  // 数据model都是大写字母开头
        require('./' + item);
    }
});
