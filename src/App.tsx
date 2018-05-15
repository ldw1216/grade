import { Layout, Menu, Icon } from 'antd';
import React from 'react';
import { Route, withRouter, Link, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import User from './user';
import Period from './period';
import Exception from 'ant-design-pro/lib/Exception';
import { LoginProvider, LoginConsumer } from './login/Provider';
import GraderRole from './graderRole';
import ByGrader from './byGrader';
import Grader from './grader';
import Problem from './problem';
import Average from './statistics/average';
import Grade from './statistics/grade';
import AlterPassword from './components/AlterPassword';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
export default withRouter(class SiderDemo extends React.Component<RouteComponentProps<{}>, {}> {
    state = {
        collapsed: false,
        userName: ''
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <LoginProvider>
                <div id="components-layout-demo-custom-trigger">
                    <Layout>
                        <style>{`
                #components-layout-demo-custom-trigger{min-height: 100vh}
                #components-layout-demo-custom-trigger .trigger {
                    font-size: 18px;
                    line-height: 64px;
                    padding: 0 24px;
                    cursor: pointer;
                    transition: color .3s;
                  }
                  
                  #components-layout-demo-custom-trigger .trigger:hover {
                    color: #1890ff;
                  }
                  
                  #components-layout-demo-custom-trigger .logo {
                    line-height: 32px;
                    background: rgba(255,255,255,.2);
                    margin: 16px;
                    color: white;
                    textAlign: center;
                  }`}</style>
                        <Sider
                            trigger={null}
                            collapsible={true}
                            collapsed={this.state.collapsed}
                            style={{ minHeight: '100vh' }}
                        >
                            <div className="logo" style={{ color: 'white', textAlign: 'center' }}>莱盛打分系统</div>

                            <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
                                <SubMenu key="/user" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                                    <Menu.Item key="/user/list"><Link to="/user/list"><span>用户列表</span> </Link></Menu.Item>
                                    <Menu.Item key="/user/add"><Link to="/user/add"><span>新增用户</span> </Link></Menu.Item>
                                </SubMenu>
                                <SubMenu key="/period" title={<span><Icon type="bars" /><span>评分周期管理</span></span>}>
                                    <Menu.Item key="/period/list"><Link to="/period/list"><span>评分周期列表</span> </Link></Menu.Item>
                                    <Menu.Item key="/period/add"><Link to="/period/add"><span>新增评分周期</span> </Link></Menu.Item>
                                </SubMenu>
                                <Menu.Item key="3">
                                    <Link to="/grade/chooseByGrader">
                                        <Icon type="star" />
                                        <span>评分</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout>
                            <Header style={{ background: '#fff', padding: 0 }}>
                                <LoginConsumer>
                                    {(ctx: any) => <div style={{ float: 'right', paddingRight: 20 }}>
                                        欢迎您：{ctx.name} &nbsp;&nbsp;&nbsp;&nbsp;
                                        <a onClick={ctx.logout} href="#">退出</a>
                                        <AlterPassword />
                                    </div>}
                                </LoginConsumer>

                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggle}
                                />
                            </Header>
                            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                                <Switch>
                                    <Route path="/user" component={User} />
                                    <Route path="/period" component={Period} />
                                    <Route path="/graderRole" component={GraderRole} />
                                    <Route path="/byGrader" component={ByGrader} />
                                    <Route path="/grader" component={Grader} />
                                    <Route path="/problem" component={Problem} />
                                    <Route path="/statistics/average" component={Average} />
                                    <Route path="/statistics/grade" component={Grade} />
                                    <Route render={() => <Exception type="404" />} />
                                </Switch>
                            </Content>
                        </Layout>
                    </Layout>;
            </div>
            </LoginProvider>
        );
    }
});
