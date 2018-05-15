import * as React from 'react';
import PeriodTab from '../components/PeriodTab';
import axios from 'axios';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import url from 'url';

const Column = Table.Column;

export default class App extends React.Component {
    state = {
        periodId: url.parse(location.href, true).query.periodId,
        graders: [] as IGradeRelation[],
    };
    async componentDidMount() {
        const data = await axios.get('/statistics/grade' + location.search).then(res => res.data);
        this.setState(data);
    }
    render() {
        console.log(this.state);
        return (
            <div>
                <PeriodTab currentTab="grade" />
                <Table
                    rowKey="_id"
                    dataSource={this.state.graders}
                    pagination={false}
                    expandedRowRender={(record: any) => (
                        <Table rowKey="_id" dataSource={record.byGraders} pagination={false}>
                            <Column
                                title="被评分人"
                                dataIndex="name"
                                render={(text, record1: any) => <Link to={`/grade/grade?byGraderId=${record1._id}&graderRoleId=${record.graderRole._id}&periodId=${this.state.periodId}&gradeRelationId=${record._id}`}>{text}</Link>}
                            />
                            <Column
                                title="得分"
                                dataIndex="_id"
                                render={byGraderId => {
                                    const rate = record.rates.find((item: any) => item.byGrader === byGraderId);
                                    return rate ? rate.rateTotal : '未评分';
                                }}
                            />
                        </Table>
                    )}
                >
                    <Column
                        title="评分人"
                        dataIndex="grader.name"
                    />
                    <Column
                        title="评分人角色"
                        dataIndex="graderRole.name"
                    />
                    <Column
                        title="已评分人数/总评分人数"
                        render={record => <div>{record.rates.length}/{record.byGraders.length}</div>}
                    />
                </Table>
            </div>
        );
    }
}
