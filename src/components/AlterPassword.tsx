import * as React from 'react';
import { Modal, Input, message } from 'antd';
import model from '../lib/model';
import axios from 'axios';

export default class AlterPassword extends React.Component<{ firstLogin?: boolean }> {
    static defaultProps = {
        firstLogin: false // 如果没有修改过密码主动弹出修改密码
    };
    state = {
        modalVisible: this.props.firstLogin,
        originalPassword: '',
        newPassword1: '',
        newPassword2: '',
    };
    private showModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.setState({ modalVisible: true });
    }
    private alter = () => {
        // 修改密码
        if (!this.state.originalPassword) return message.error('原密码必填！');
        if (!this.state.newPassword1 || !this.state.newPassword2) return message.error('新密码必填！');
        if (this.state.newPassword1 !== this.state.newPassword2) return message.error('两次输入新密码不一致！');
        axios.post('/sign/alertPassword', { password: this.state.newPassword2, originalPassword: this.state.originalPassword }).then(res => res.data).then(console.log);
        return;
    }

    render() {
        const inputStyle = { margin: '8px 0', display: 'block' };
        return (
            <div style={{ display: 'inline-block', paddingLeft: 8 }}>
                <a onClick={this.showModal} href="#">修改密码</a>
                <Modal
                    title={this.props.firstLogin ? '您使用的是原始密码，请修改密码' : '修改密码'}
                    visible={this.state.modalVisible}
                    onOk={this.alter}
                    onCancel={() => this.setState({ modalVisible: false })}
                >
                    <Input {...model(this, 'originalPassword')} type="password" style={inputStyle} placeholder="输入原密码" />
                    <Input {...model(this, 'newPassword1')} type="password" style={inputStyle} placeholder="输入新密码" />
                    <Input {...model(this, 'newPassword2')} type="password" style={inputStyle} placeholder="再次输入新原密码" />
                </Modal>
            </div>
        );
    }
}