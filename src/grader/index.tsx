import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Table, Button, Popconfirm, Select, message } from 'antd';
import axios from 'axios';
import model from '../lib/model';
import PeriodTab from '../components/PeriodTab';
import url from 'url';

const { Column } = Table;
const Option = Select.Option;

export default withRouter(class extends React.Component<RouteComponentProps<{ _id?: string }>> {
    state = {
        list: [] as any[],
        graderRoles: [] as any[],
        graders: [] as any[],
        byGraders: [] as any[],
    };
    componentDidMount() {
        const periodId = url.parse(location.href, true).query.periodId;
        // 获取所有被评分人
        axios.get('/user/list?role=评分人').then(res => this.setState({ graders: res.data }));
        axios.get('/byGrader?periodId=' + periodId).then(res => this.setState({ byGraders: res.data.byGraders }));
        axios.get('/graderRole?periodId=' + periodId).then(res => this.setState({ graderRoles: res.data.list }));
        this.fetch();
    }
    private fetch = () => {
        axios.get(location.href).then(res => res.data)
            .then(list => list.map((item: any) => ({ ...item, id: item._id })))
            .then(list => this.setState({ list }));
    }
    private add = () => {
        this.setState({ list: [...this.state.list, { id: Math.random() }] });
    }
    private save = (index: number) => {
        const grader = this.state.list[index];
        if (this.state.list.filter(item => typeof item.id === 'string' && item.id !== grader.id).some(item => item.grader === grader.grader && item.graderRole === grader.graderRole)) return message.error('同一个打分人及同一个角色不能添加两次！');
        const periodId = url.parse(location.href, true).query.periodId;
        return axios.post(location.href, { ...this.state.list[index], period: periodId }).then(this.fetch);
    }
    private remove = (id: string) => {
        axios.delete('/grader/' + id).then(this.fetch);
    }
    render() {
        return (
            <div>
                <PeriodTab currentTab="grader" />
                <div className="toolbar">
                    <Button onClick={this.add} type="primary">添加评分人</Button>
                </div>

                <Table pagination={false} rowKey="id" dataSource={this.state.list} >
                    <Column
                        title="评分人"
                        dataIndex="name"
                        width="10%"
                        render={(text, record, index) => {
                            const graders = this.state.graders.map(item => <Option title={item.name} key={item._id} value={item._id}>{item.name}</Option>);
                            const roles = this.state.graderRoles.map(item => <Option title={item.name} key={item._id} value={item._id}>{item.name}</Option>);
                            return <div>
                                <Select showSearch={true} placeholder="评分人姓名"  style={{ width: 130, marginBottom: 8 }} optionFilterProp="children" {...model(this, ['list', index, 'grader'])} >
                                    {graders}
                                </Select>
                                <Select placeholder="评分角色" style={{ width: 130 }} optionFilterProp="children" {...model(this, ['list', index, 'graderRole'])} >
                                    {roles}
                                </Select>
                            </div>;
                        }}
                    />
                    <Column
                        title="评分人电话"
                        width="10%"
                        render={(text, record: any, index) => record.grader && this.state.graders.find(item => item._id === record.grader).phone}
                    />
                    <Column
                        title="被评分人"
                        width="*"
                        render={(text, record, index) => {
                            const byGraders = this.state.byGraders.map(item => <Option title={item.uid.name} key={item.uid._id} value={item.uid._id}>{item.uid.name}</Option>);
                            return <div>
                                <Select mode="multiple" placeholder="被评分人姓名" style={{ width: '100%', marginRight: 8 }} optionFilterProp="children" {...model(this, ['list', index, 'byGraders'])} >
                                    {byGraders}
                                </Select>
                            </div>;
                        }}
                    />
                    <Column
                        title="操作"
                        width="16%"
                        render={
                            (record, record1, index) => <div>
                                <Button onClick={() => this.save(index)} type="primary" size="small">保存</Button>
                                {record._id && <Popconfirm title="确认删除吗？" onConfirm={() => this.remove(record._id)} okText="确认" cancelText="取消">
                                    <Button type="danger" size="small">删除</Button>
                                </Popconfirm>}
                            </div>}
                    />
                </Table>
            </div>
        );
    }
});
