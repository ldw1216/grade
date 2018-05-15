import React, { Component } from 'react';
import { Input, Button, Checkbox } from 'antd';
import Role from '../config/role';
import model from '../lib/model';
import axios from 'axios';
import { RouteComponentProps } from 'react-router';

const CheckboxGroup = Checkbox.Group;

class Show extends Component<RouteComponentProps<{ _id?: string }>> {
    state = {
        form: {} as {
            name: string,
            phone: string,
            role: string[],
            remark: string,
        }
    };
    fetch = () => {
        if (this.props.match.params._id) {
            axios.get(location.pathname).then(res => this.setState({ form: res.data }));
        }
    }
    componentDidMount() {
        this.fetch();
    }
    private handelSaveAndClear = () => {
        axios.post(location.pathname, this.state.form).then(res => {
            this.setState({form: {}});
        });
    }
    private handleSave = () => {
        axios.post(location.pathname, this.state.form).then(res => {
            this.props.history.goBack();
        });
    }
    render() {
        return (
            <div>
                <table className="form">
                    <tbody>
                        <tr>
                            <td>真实姓名：</td>
                            <td><Input {...model(this, 'form.name')} /></td>
                        </tr>
                        <tr>
                            <td>手机号：</td>
                            <td><Input {...model(this, 'form.phone')} /></td>
                        </tr>
                        <tr>
                            <td>角色：</td>
                            <td>
                                <CheckboxGroup {...model(this, 'form.role')} options={Object.keys(Role).map(item => ({ label: Role[item], value: Role[item] }))} />
                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td>
                                <Input.TextArea style={{ width: '40vw' }} {...model(this, 'form.remark')} />
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <Button onClick={this.handleSave} type="primary">保存并返回</Button>

                                {this.props.match.params._id ?
                                    <Button onClick={e => axios.get(`/user/resetPassword/${this.props.match.params._id}`)} type="primary">重置密码</Button> :
                                    <Button onClick={this.handelSaveAndClear} type="primary">保存并新增</Button>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Show;