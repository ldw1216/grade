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
                        title="姓名"
                        dataIndex="name"
                    />
                    <Column
                        title="手机号"
                        dataIndex="phone"
                    />
                    <Column
                        title="角色"
                        dataIndex="role"
                        render={(text) => text.join('， ')}
                    />
                    <Column
                        title="操作"
                        render={
                            (record) => <div>
                                <Link to={`/user/edit/${record._id}`}>
                                    <Button type="primary" size="small">编辑</Button>
                                </Link>
                                <Popconfirm title="确认删除吗？" onConfirm={() => axios.delete('/user/' + record.id).then(this.fetch)} okText="确认" cancelText="取消">
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