import { Schema, model, SchemaTypes, Document } from 'mongoose';

const collectionName = 'Problem';  // 打分人角色
const schema = new Schema({
    title: { type: String, required: [true, '标题必填！'], cn: '标题' },
    order: { type: Number, default: 0, cn: '排序' },
    score: { type: Number, required: [true, '分数必填'], cn: '分数' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', required: [true, '分数必填'], cn: '打分周期' },
    graderRole: { type: SchemaTypes.ObjectId, ref: 'GraderRole', required: [true, '分数必填'], cn: '打分角色' },
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const ProblemModel = model<IProblem & Document>(collectionName, schema);

export {
    ProblemModel,
};
