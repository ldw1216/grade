import { Document, model, Schema } from 'mongoose';
import Role from '../config/role';
const collectionName = 'User';

const schema = new Schema({
    name: { type: String, required: [true, '用户姓名必填'], unique: true, cn: '姓名' },
    phone: { type: String, required: [true, '手机号必填'], unique: true, cn: '手机号' },
    role: { type: [String], required: [true, '角色必填'], enum: Object.keys(Role), cn: '角色' },
    removed: { type: Boolean, default: false },
    password: { type: String, default: '111111' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const UserModel = model<Document & IUser>(collectionName, schema);

export {
    UserModel,
    Role,
};

// 如果没有管理员用户，启动时自动增加一个管理员
UserModel.findOne({ role: Role.管理员 }).then(doc => {
    if (doc === null) {
        new UserModel({ name: 'admin', phone: '123456', role: Role.管理员 }).save();
    }
});
