import * as React from 'react';
import { Link } from 'react-router-dom';
import url from 'url';

export interface PeriodTabProps {
    currentTab: string;
}

export default class PeriodTab extends React.Component<PeriodTabProps, any> {
    render() {
        const { currentTab } = this.props;
        const periodId = url.parse(location.href, true).query.periodId;
        if (!periodId) return null;
        return (
            <div>
                <ul className="my-tab" style={{ display: 'flex' }}>
                    <li className={currentTab === 'base' ? 'active' : ''}>
                        <Link to={`/period/edit/${periodId + location.search}`}>评分周期基本信息</Link>
                    </li>
                    <li className={currentTab === 'graderRole' ? 'active' : ''}>
                        <Link to={`/graderRole${location.search}`}>角色</Link>
                    </li>
                    <li className={currentTab === 'byGrader' ? 'active' : ''}>
                        <Link to={`/byGrader${location.search}`}>被评分人</Link>
                    </li>
                    <li className={currentTab === 'grader' ? 'active' : ''}>
                        <Link to={`/grader${location.search}`}>评分人</Link>
                    </li>
                    <li className={currentTab === 'problem' ? 'active' : ''}>
                        <Link to={`/problem${location.search}`}>评分项</Link>
                    </li>
                    <li className={currentTab === 'statistics' ? 'active' : ''}>
                        <Link to={`/statistics/average${location.search}`}>平均分统计</Link>
                    </li>
                    <li className={currentTab === 'grade' ? 'active' : ''}>
                        <Link to={`/statistics/grade${location.search}`}>评分详情</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
