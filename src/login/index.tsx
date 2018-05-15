import React, { Component, ChangeEvent } from 'react';
import { message, Input, Button, Alert } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

export default class Login extends Component<RouteComponentProps<{}>> {
    state = {
        name: undefined,
        password: undefined
    };
    submit = (e: any) => {
        e.preventDefault();
        const { name, password } = this.state;
        if (!name || !password) { return message.error(<span style={{ color: 'red' }}>账号密码必填！</span>); }
        return axios.post('/sign/login', { name, password }).then(res => (res.data))
            .then(data => {
                console.log(data);
                return this.props.history.push(data.redirect);
            });
    }
    handelChange(key: string, value: string | ChangeEvent<HTMLInputElement>) {
        if (typeof value === 'object' && value.type === 'change' && value.target) { value = value.target.value; }
        this.setState({ [key]: value });
    }
    render() {
        return (
            <div style={{ background: '#f5f7f9', position: 'absolute', height: '100%', width: '100%', display: 'flex' }}>
                <div style={{ width: 320, margin: 'auto' }}>
                    <header style={{ background: '#324157', height: 60, padding: 12, textAlign: 'center' }}><img style={{ height: 36 }} src="//m-res.levect.com/img/192x192.png" /></header>
                    <div style={{ padding: 15, background: 'white' }}>
                        <h4 style={{ textAlign: 'center', color: '#656565' }}>欢迎登录莱盛打分系统</h4>
                        {navigator.userAgent.indexOf('Chrome') === -1 && <Alert message="建议使用新版chrome 已获得更好的体验" type="error" />}
                        <div style={{ margin: '20px 0' }}>
                            <Input value={this.state.name} onChange={this.handelChange.bind(this, 'name')} placeholder="用户名或手机号" />
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            <Input value={this.state.password} type="password" onChange={this.handelChange.bind(this, 'password')} placeholder="密码" />
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            <Button onClick={this.submit} style={{ width: '100%' }} type="primary">登录</Button>
                        </div>
                        <div style={{ textAlign: 'center', padding: 10 }}>
                            created by www.laser-inc.com.cn
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
