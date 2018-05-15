import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login/';
import axios from 'axios';
import { message } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import './style.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import 'moment/locale/zh-cn';
import Grade from './grade';

axios.defaults.timeout = 4000;
axios.defaults.headers['Content-Type'] = 'application/json';
// axios.defaults.baseURL = '/api';
axios.interceptors.response.use(
    res => {
        if (res.data.message) message.success(res.data.message);
        return res;
    },
    err => {
        const { response, config } = err;
        if (response && response.status === 401) {
            message.error(config.url + ' 没有权限');
            if (response.data.message === 'NOT LOGIN') {
                return location.href = '/login/';
            }
        }
        console.log(err.message, ' 请求地址： ', config.url, ' data: ', config.data);
        if (response && response.data) message.error(response.data.error || response.data.message || response.data);
        else message.error(err.message);
        return Promise.reject(err);
    });

render(
    <LocaleProvider locale={zhCN}>
        <div>
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/grade" component={Grade} />
                    <Route path="/" component={App} />
                </Switch>
            </Router>
        </div>
    </LocaleProvider>
    ,
    document.getElementById('root') as HTMLElement
);
