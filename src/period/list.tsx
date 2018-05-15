import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
const { Column } = Table;

class List extends Component {
    state = {
        list: [],
    };
    componentDidMount() {
        this.fetch();
    }
    fetch = () => {
        axios.get(location.pathname).then(res => this.setState({ list: res.data }));
    }
    render() {
        return (
            <div>
                <Table rowKey="_id" dataSource={this.state.list}>
                    <Column
                        title="打分周期名称"
                        dataIndex="name"
                    />
                    <Column
                        title="开始时间"
                        dataIndex="begin"
                    />
                    <Column
                        title="结束时间"
                        dataIndex="end"
                    />
                    <Column
                        title="是否发布"
                        dataIndex="published"
                        render={text => text ? '已发布' : '未发布'}
                    />
                    <Column
                        title="操作"
                        render={
                            (record) => <div>
                                <Link to={`/period/edit/${record._id}?periodId=${record._id}`}>
                                    <Button type="primary" size="small">编辑</Button>
                                </Link>
                                <Popconfirm title="确认删除吗？" onConfirm={() => axios.delete('/period/' + record.id).then(this.fetch)} okText="确认" cancelText="取消">
                                    <Button type="danger" size="small">删除</Button>
                                </Popconfirm>
                            </div>}
                    />
                </Table>
            </div>
        );
    }
}

export default List;