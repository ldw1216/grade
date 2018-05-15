import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Table, Button, Popconfirm, Input, Select } from 'antd';
import axios from 'axios';
import model from '../lib/model';
import PeriodTab from '../components/PeriodTab';

const { Column } = Table;
const Option = Select.Option;

export default withRouter(class extends React.Component<RouteComponentProps<{ _id?: string }>> {
    state = {
        list: [] as any[],
        users: [] as any[],
    };
    componentDidMount() {
        // 获取所有被评分人
        axios.get('/user/list?role=被评分人').then(res => this.setState({ users: res.data }));
        this.fetch();
    }
    private fetch = () => {
        axios.get(location.href).then(res => res.data.byGraders)
            .then(list => list.map((item: any) => ({ ...item, id: item._id })))
            .then(list => list.map((item: any) => ({...item, uid: item.uid._id})))
            .then(list => this.setState({ list }));
    }
    private add = () => {
        this.setState({ list: [...this.state.list, { id: Math.random() }] });
    }
    private save = () => {
        axios.post(location.href, this.state.list).then(this.fetch);
    }
    render() {
        return (
            <div>
                <PeriodTab currentTab="byGrader" />
                <div className="toolbar">
                    <Button onClick={this.add} type="primary">添加被评分人</Button>
                    <Button onClick={this.save} type="primary">保存</Button>
                </div>

                <Table pagination={false} rowKey="id" dataSource={this.state.list} >
                    <Column title="角色id" dataIndex="_id" />
                    <Column
                        title="被评分人姓名"
                        dataIndex="name"
                        render={(text, record, index) => {
                            const options = this.state.users.map(item => <Option disabled={this.state.list.map(item1 => item1.uid).includes(item._id)} title={item.name} key={item._id} value={item._id}>{item.name}</Option>);
                            return <Select showSearch={true} style={{ width: 300 }} optionFilterProp="children" {...model(this, ['list', index, 'uid'])} >
                                {options}
                            </Select>;
                        }}
                    />
                    <Column
                        title="被评分人电话"
                        render={(text, record: any, index) => record.uid && this.state.users.find(item => item._id === record.uid).phone}
                    />
                    <Column
                        title="备注"
                        dataIndex="remark"
                        render={(text, record, index) => {
                            return <div>
                                <Input {...model(this, `list[${index}].remark`)} />
                            </div>;
                        }}
                    />
                    <Column
                        title="操作"
                        render={
                            (record, record1, index) => <div>
                                {record.uid && <Popconfirm title="确认删除吗？删除后请记得点保存按钮哦！" onConfirm={() => this.setState({ list: this.state.list.filter(item => item.uid !== record.uid) })} okText="确认" cancelText="取消">
                                    <Button type="danger" size="small">删除</Button>
                                </Popconfirm>}
                            </div>}
                    />
                </Table>

            </div>
        );
    }
});
