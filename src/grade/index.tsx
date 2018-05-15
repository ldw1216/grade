import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ChooseByGrader from './chooseByGrader';
import Grade from './grade';
import Exception from 'ant-design-pro/lib/Exception';
import { LoginProvider } from '../login/Provider';
import { LoginConsumer } from '../login/Provider';
import AlterPassword from '../components/AlterPassword';

class Index extends Component {
    render() {
        return (
            <LoginProvider>
                <LoginConsumer>
                    {(user: IPersonalInfo) => (
                        <div style={{ minHeight: '100vh', background: '#fafafa' }}>
                            <div style={{ padding: 15, maxWidth: 1200, margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <AlterPassword firstLogin={user.firstLogin} />  <a onClick={user.logout} href="#">退出</a>
                                </div>
                                <Switch>
                                    <Route key={location.href} exact={true} path="/grade/grade" component={Grade} />
                                    <Route key={location.href} exact={true} path="/grade/chooseByGrader" component={ChooseByGrader} />
                                    <Route path="/" render={() => <Exception type="404" />} />
                                </Switch>
                            </div>
                        </div>
                    )}
                </LoginConsumer>
            </LoginProvider>
        );
    }
}

export default Index;