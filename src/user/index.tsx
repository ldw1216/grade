import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Show from './show';
import Exception from 'ant-design-pro/lib/Exception';

class Index extends Component {
    render() {
        return (
            <Switch>
                <Route key={location.href} exact={true} path="/user/list" component={List} />
                <Route key={location.href} exact={true} path="/user/add" component={Show} />
                <Route key={location.href} exact={true} path="/user/edit/:_id" component={Show} />
                <Route path="/" render={() => <Exception type="404" />} />
            </Switch>
        );
    }
}

export default Index;