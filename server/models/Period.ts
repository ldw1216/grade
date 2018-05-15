import { Schema, model, Document, SchemaTypes } from 'mongoose';

const collectionName = 'Period';

const schema = new Schema({
    name: { type: String, required: [true, '打分周期名称必填'], unique: true, cn: '打分周期名称' },
    begin: { type: Date, required: [true, '开始时间必填'], cn: '打分开始时间' },
    end: { type: Date, required: [true, '结束时间必填'], cn: '打分结束时间' },
    published: { type: Boolean, default: false, cn: '是否发布' },
    removed: { type: Boolean, default: false },
    byGraders: {
        type: [{
            uid: { type: SchemaTypes.ObjectId, ref: 'User', required: [true, '被评分人为空！'] }, // 用户id
            remark: String
        }], cn: '被评分人'
    },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const PeriodModel = model<IPeriod & Document>(collectionName, schema);

export {
    PeriodModel,
};
