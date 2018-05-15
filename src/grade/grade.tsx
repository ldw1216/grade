import * as React from 'react';
import url from 'url';
import axios from 'axios';
import { Rate, Input, Button } from 'antd';
import model from '../lib/model';
import { LoginConsumer } from '../login/Provider';
import html2canvas from 'html2canvas';

/**
 * 需要querystring中包含 被评分人、评分人角色、评分周期
 */
export default class App extends React.Component<{}> {
    state = {
        byGraderId: 'preview',
        byGraderName: '预览',
        graderRoleId: '',
        graderRoleName: '',
        periodId: '',
        list: [] as IProblem[],
        periodTitle: '',
        grader: { name: '', _id: '' },
        gradeRelationId: '',
        rateRes: [] as { _id: string, problem: string, rate: number, description: string }[],
    };
    async componentDidMount() {
        const { byGraderId, graderRoleId, periodId, gradeRelationId } = url.parse(location.href, true).query;
        // 请求评分项
        const data = await axios.get(location.href).then(res => res.data);
        this.setState({ byGraderId, gradeRelationId, graderRoleId, periodId, byGraderName: data.byGraderName, grader: data.grader, periodTitle: data.periodName, list: data.list, graderRoleName: data.graderRoleName, rateRes: data.rateRes });
        console.log(data);
    }
    private submit = () => {
        const data = this.state.list.map((item, index) => {
            const rate = this.state.rateRes[index];
            if (!rate) {
                alert(item.title + '未评分！');
                throw new Error(item.title + '未评分！');
            }
            return { problem: item._id, ...rate };
        });
        axios.post(location.href, data);
        this.componentDidMount();
    }

    private screenshot = () => { // 截图
        html2canvas(document.getElementById('download') as any).then(canvas => {
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = this.state.periodTitle + '.png';
            a.click();
        });
    }
    render() {
        return (
            <LoginConsumer>
                {(user: IPersonalInfo) => (
                    <div>
                        <div id="download">
                            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                                <h2>{this.state.periodTitle}</h2>
                                <div>评分人：{this.state.grader.name}  &nbsp;&nbsp;&nbsp; 评分人角色：{this.state.graderRoleName}  &nbsp;&nbsp;&nbsp;&nbsp;  被评分人：{this.state.byGraderName}   </div>
                            </div>
                            <ol className="problem">
                                {this.state.list.map((item, index) => {
                                    const rate = this.state.rateRes[index];
                                    const disabled = !!(rate && rate._id) || this.state.grader._id !== user._id;
                                    return <li style={{ margin: '20px 0' }} key={item._id}>
                                        <div style={{ color: '#1757a1', fontSize: 20 }}>{item.title}</div>
                                        <div style={{ margin: '5px 0' }}><Rate disabled={disabled} count={item.score} {...model(this, ['rateRes', index, 'rate'])} /></div>
                                        <div>
                                            <Input.TextArea disabled={disabled} autosize={{ minRows: 2, maxRows: 16 }} {...model(this, ['rateRes', index, 'description'])} />
                                        </div>
                                    </li>;
                                })}
                            </ol>
                        </div>

                        <div style={{ textAlign: 'center', margin: '30px 0' }}>
                            {this.state.byGraderId !== 'preview' && !this.state.rateRes.filter(item => item._id).length && this.state.grader._id === user._id && <Button onClick={this.submit} type="primary">提交</Button>}
                            {!!this.state.rateRes.filter(item => item._id).length && <Button onClick={this.screenshot} type="primary">下载</Button>}
                        </div>
                    </div>
                )}
            </LoginConsumer>
        );
    }
}
