import { Schema, model, SchemaTypes, Document } from 'mongoose';

// 同一个评分人，在同一个打分周期，可以有不同的角色，先择不同的被打分人
const collectionName = 'GradeRelation';  // 打分人角色
const schema = new Schema({
    grader: { type: SchemaTypes.ObjectId, ref: 'User', required: [true, '评分人必填！'], cn: '评分人' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', required: [true, '确少打分周期！'], cn: '评分人' },
    graderRole: { type: SchemaTypes.ObjectId, ref: 'GraderRole', required: [true, '评分人角色必填！'], cn: '评分人角色' },
    byGraders: [{ type: SchemaTypes.ObjectId, ref: 'User', required: [true, '被评分人必填！'], cn: '被分人' }],
    rates: [{
        byGrader: { type: SchemaTypes.ObjectId, ref: 'User', required: [true, '被评分人必填！'], cn: '被分人' },
        problems: [{
            problem: { type: SchemaTypes.ObjectId, ref: 'Problem', required: [true, '评分项必填！'], cn: '评分项' },
            rate: { type: Number, required: [true, '分数必填'], cn: '分数' },
            description: { type: String, cn: '评分说明' },
        }],
        rateTotal: { type: Number, cn: '总得分' },
    }],
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const GradeRelationModel = model<Document & IGradeRelation>(collectionName, schema);

export {
    GradeRelationModel,
};
