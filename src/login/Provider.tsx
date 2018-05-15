import React, { Component, createContext } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const { Provider, Consumer } = createContext({ name: 'test' });

const LoginProvider = withRouter(class extends Component<RouteComponentProps<{}>> {
    state = {
        name: '',
    };
    actions = {
        logout: () => {
            axios.post('/sign/logout').then(res => {
                message.warning(res.data.msg);
                this.props.history.push('/login');
            });
        }
    };
    componentDidMount() {
        // 请求个人信息
        axios.get('/sign/me').then(res => {
            this.setState({ ...res.data });
        });
    }
    render() {
        if (!this.state.name) return null;
        return (
            <Provider value={{...this.state, ...this.actions}}>
                {this.props.children}
            </Provider>
        );
    }
});

export {
    LoginProvider,
    Consumer as LoginConsumer,
};
