import * as React from 'react';
import { Select, Table, Button } from 'antd';
import axios from 'axios';
import { LoginConsumer } from '../login/Provider';
import { Link } from 'react-router-dom';

const Option = Select.Option;
const Column = Table.Column;

/**
 * 选择打分周期、角色、被打分人列表
 */
export default class Grade extends React.Component {
    state = {
        periods: [] as IPeriod[],
        selectedPeriod: undefined as string | undefined,
        roles: [] as { _id: string, graderRoleName: string, rates: { byGrader: string, rateTotal: number }[], graderRoleId: string, list: { _id: string, name: string }[] }[],
    };
    async componentDidMount() {
        // 获取所有当前的打分周期
        const periods = await axios.get('/grade/choosePeriod').then(res => res.data);
        if (periods.length === 1) this.handlePeriodChange(periods[0]._id);
        this.setState({ periods });
    }
    handlePeriodChange = async (periodId: string) => {
        const roles = await axios.get('/grade/byGrader?periodId=' + periodId).then(res => res.data);
        this.setState({ roles, selectedPeriod: periodId });
    }
    render() {
        return (
            <div>
                <div style={{ textAlign: 'center', margin: 30 }}>
                    <h2>莱盛打分系统 </h2>
                    <LoginConsumer>{(ctx: IPersonalInfo) => <small>打分人：{ctx.name}</small>}</LoginConsumer>
                </div>
                <div>
                    请选择评分周期：
                        <Select dropdownMatchSelectWidth={false} value={this.state.selectedPeriod} onChange={periodId => this.handlePeriodChange(periodId as any)} style={{ minWidth: 300 }}>
                        {this.state.periods.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                    </Select>
                </div>
                {this.state.roles.map(item => <div key={item._id}>
                    <Table title={() => <h3 style={{ textAlign: 'center' }}>参与评分角色： {item.graderRoleName}</h3>} style={{ margin: '25px 0' }} pagination={false} rowKey="_id" dataSource={item.list}>
                        <Column title="被评分人" dataIndex="name" />
                        <Column
                            title="分数"
                            dataIndex="id"
                            render={(text: string) => {
                                const rate = item.rates.find((item1: any) => item1.byGrader === text);
                                return rate ? rate.rateTotal : '';
                            }}
                        />
                        <Column
                            title="操作"
                            dataIndex="_id"
                            render={(text) => <div>
                                <Link to={`/grade/grade?gradeRelationId=${item._id}&byGraderId=${text}&graderRoleId=${item.graderRoleId}&periodId=${this.state.selectedPeriod}`}>
                                    <Button size="small" type="primary">
                                        {item.rates.some((item1: any) => item1.byGrader === text) ? '查看' : '评分'}
                                    </Button>
                                </Link>
                            </div>}
                        />
                    </Table>
                </div>)}
            </div>
        );
    }
}