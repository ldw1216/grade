import * as React from 'react';
import { Fragment } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Table, Button, Popconfirm, Input, Select } from 'antd';
import axios from 'axios';
import model from '../lib/model';
import PeriodTab from '../components/PeriodTab';
import url from 'url';

const { Column } = Table;
const Option = Select.Option;

export interface GradeRoleProps {

}

export default withRouter(class extends React.Component<GradeRoleProps & RouteComponentProps<{ _id?: string }>, any> {
    state = {
        published: false, // 打分周期是否已经发布
        list: [] as any[],
        graderRoles: [] as any[],
    };
    componentDidMount() {
        const periodId = url.parse(location.href, true).query.periodId;
        axios.get('/graderRole?periodId=' + periodId).then(res => this.setState({ graderRoles: res.data.list, published: res.data.published }));
        this.fetch();
    }
    private fetch = () => {
        axios.get(location.href).then(res => res.data).then(list => this.setState({ list }));
    }
    private add = () => {
        this.setState({ list: [...this.state.list, { id: Math.random() }] });
    }
    private save = (index: number) => {
        const periodId = url.parse(location.href, true).query.periodId;
        axios.post(location.href, { ...this.state.list[index], period: periodId }).then(this.fetch);
    }
    render() {
        const periodId = url.parse(location.href, true).query.periodId;
        return (
            <div>
                <PeriodTab currentTab="problem" />
                <div className="toolbar">
                    <Button disabled={this.state.published} onClick={this.add} type="primary">新增评分项</Button>
                </div>

                <Table pagination={false} rowKey="id" dataSource={this.state.list} >
                    <Column
                        title="排序"
                        width="10%"
                        dataIndex="order"
                        render={(text, record, index) => {
                            return <div>
                                <Input style={{ width: 90 }} type="number" {...model(this, `list[${index}].order`)} />
                            </div>;
                        }}
                    />
                    <Column
                        title="角色"
                        width="10%"
                        dataIndex="graderRole"
                        render={(text, record, index) => {
                            const roles = this.state.graderRoles.map(item => <Option title={item.name} key={item._id} value={item._id}>{item.name}</Option>);
                            return <Select placeholder="评分角色" style={{ width: 130 }} optionFilterProp="children" {...model(this, ['list', index, 'graderRole'])} >
                                {roles}
                            </Select>;
                        }}
                    />
                    <Column
                        title="标题"
                        width="*"
                        dataIndex="title"
                        render={(text, record, index) => {
                            return <div>
                                <Input {...model(this, `list[${index}].title`)} />
                            </div>;
                        }}
                    />
                    <Column
                        title="分值"
                        width="10%"
                        dataIndex="score"
                        render={(text, record, index) => {
                            const { onChange, value } = model(this, `list[${index}].score`);
                            return <div>
                                <Input style={{ width: 90 }} type="number" value={value} onChange={e => +e.target.value > 0 && onChange(e)} />
                            </div>;
                        }}
                    />
                    <Column
                        title="操作"
                        width="200px"
                        render={
                            (record, record1, index) => <div>
                                <Button disabled={this.state.published} onClick={() => this.save(index)} type="primary" size="small">保存</Button>
                                {record._id &&
                                    <Fragment>
                                        <Link to={`/grade/grade?byGraderId=preview&graderRoleId=${record.graderRole}&periodId=${periodId}`}>
                                            <Button type="primary" size="small">预览</Button>
                                        </Link>
                                        <Popconfirm title="确认删除吗？" onConfirm={() => axios.delete(location.pathname + '/' + record._id).then(this.fetch)} okText="确认" cancelText="取消">
                                            <Button disabled={this.state.published} type="danger" size="small">删除</Button>
                                        </Popconfirm>
                                    </Fragment>
                                }
                            </div>}
                    />
                </Table>

            </div>
        );
    }
});
