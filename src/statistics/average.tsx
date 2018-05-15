import * as React from 'react';
import axios from 'axios';
import PeriodTab from '../components/PeriodTab';
import { Table } from 'antd';

const Column = Table.Column;

export default class App extends React.Component {
    state = {
        rates: [] as { byGrader: string, graderRole: string, averageRate: number }[],
        roles: [] as { id: string, name: string }[],
        byGraders: [] as { id: string, name: string }[],
    };
    componentDidMount() {
        axios.get(location.href).then(res => this.setState({ rates: res.data.rates, roles: res.data.roles, byGraders: res.data.byGraders }));
    }
    render() {
        console.log(this.state.rates);
        const list = this.state.byGraders.map(item => {
            const data = {} as { id: string, byGrader: string, [roleName: string]: number | string, sum: number };
            data.byGrader = item.name;
            data.id = item.id;
            data.sum = 0;
            this.state.roles.map(role => {
                const rate = this.state.rates.find(item1 => item1.graderRole === role.id && item1.byGrader === item.id);
                data[role.name] = rate ? rate.averageRate : 0;
                data.sum += data[role.name] as number;
            });
            return data;
        });
        console.log(list);
        return (
            <div>
                <PeriodTab currentTab="statistics" />
                <Table rowKey="id" dataSource={list}>
                    <Column
                        title="被评分人"
                        dataIndex="byGrader"
                    />
                    {this.state.roles.map(role => <Column key={role.id} title={role.name} dataIndex={role.name} />)}
                    <Column
                        title="总分"
                        dataIndex="sum"
                    />
                </Table>
            </div>
        );
    }
}
