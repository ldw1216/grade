import { Schema, model, SchemaTypes, Document } from 'mongoose';

const collectionName = 'GraderRole';  // 打分人角色
const schema = new Schema({
    name: { type: String, required: [true, '角色名称必填！'], unique: true, cn: '名称' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', cn: '打分周期'},
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const GraderRoleModel = model<IGraderRole & Document>(collectionName, schema);

export {
    GraderRoleModel,
};
