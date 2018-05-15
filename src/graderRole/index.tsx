import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Table, Button, Popconfirm, Input } from 'antd';
import axios from 'axios';
import model from '../lib/model';
import PeriodTab from '../components/PeriodTab';
import url from 'url';

const { Column } = Table;

export interface GradeRoleProps {

}

export default withRouter(class extends React.Component<GradeRoleProps & RouteComponentProps<{ _id?: string }>, any> {
    state = {
        published: false,
        list: [] as any[]
    };
    componentDidMount() {
        this.fetch();
    }
    private fetch = () => {
        axios.get(location.href).then(res => res.data).then(data => this.setState({ published: data.published, list: data.list }));
    }
    private add = () => {
        this.setState({ list: [...this.state.list, { id: Math.random() }] });
    }
    private save = (index: number) => {
        const periodId = url.parse(location.href, true).query.periodId;
        axios.post(location.href, { ...this.state.list[index], period: periodId }).then(this.fetch);
    }
    render() {
        return (
            <div>
                <PeriodTab currentTab="graderRole" />
                <div className="toolbar">
                    <Button onClick={this.add} type="primary">新增角色</Button>
                </div>

                <Table pagination={false} rowKey="id" dataSource={this.state.list} >
                    <Column title="角色id" dataIndex="id" />
                    <Column
                        title="角色名称"
                        dataIndex="name"
                        render={(text, record, index) => {
                            return <div>
                                <Input {...model(this, `list[${index}].name`)} />
                            </div>;
                        }}
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
                                <Button onClick={() => this.save(index)} type="primary" size="small">保存</Button>
                                {record._id && <Popconfirm title="确认删除吗？" onConfirm={() => axios.delete(location.pathname + '/' + record._id).then(this.fetch)} okText="确认" cancelText="取消">
                                    <Button disabled={this.state.published} type="danger" size="small">删除</Button>
                                </Popconfirm>}
                            </div>}
                    />
                </Table>

            </div>
        );
    }
});
