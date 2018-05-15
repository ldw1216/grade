import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Input, Switch, DatePicker, Button } from 'antd';
import PeriodTab from '../components/PeriodTab';
import axios from 'axios';
import moment from 'moment';
import model from '../lib/model';

class Show extends Component<RouteComponentProps<{ _id?: string }>> {
    state = {
        published: false,
        form: {} as IPeriod
    };
    componentDidMount() {
        this.fetch();
    }
    private fetch = () => {
        if (this.props.match.params._id) {
            axios.get(location.pathname).then(res => {
                res.data.begin = moment(res.data.begin);
                res.data.end = moment(res.data.end);
                if (res.data.published) this.setState({ published: true });
                this.setState({ form: res.data });
            });
        }
    }
    private handleSave = () => {
        axios.post(location.href, this.state.form).then(res => {
            this.props.history.push(`/period/edit/${res.data._id}?periodId=${res.data._id}`);
        });
    }
    render() {
        return (
            <div>
                <PeriodTab currentTab="base" />
                <table className="form">
                    <tbody>
                        <tr>
                            <td>打分周期名称:</td>
                            <td><Input {...model(this, 'form.name')} /></td>
                        </tr>
                        <tr>
                            <td>打分开始时间:</td>
                            <td><DatePicker {...model(this, 'form.begin')} /></td>
                        </tr>
                        <tr>
                            <td>打分结束时间:</td>
                            <td>
                                <DatePicker {...model(this, 'form.end')} />
                            </td>
                        </tr>
                        <tr>
                            <td>是否发布:</td>
                            <td>
                                <Switch {...model(this, 'form.published')} />
                                &nbsp;&nbsp;&nbsp;&nbsp;发布后将不能在修改打分周期的相关信息
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
                                <Button disabled={this.state.published} onClick={this.handleSave} type="primary">保存</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Show;
