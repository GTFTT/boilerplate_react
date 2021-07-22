//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import logo from "./logo.svg";

//proj

//own
import "./styles.css";
import config from './config';
import NavigationButton from './components/NavigationButton';

/**
 * Central navigation file, contains controls and commonly used stuff.
 * To configure available nav buttons visit config.js file.
 */
export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.navigationConfig = config();
    }

    render() {
        const { children } = this.props;

        return (
            <div className="mainCont">
                <header className="header">
                    <img src={logo} className="logo" alt="logo" />
                    <div className="title">
                        Boilerplate reducer
                    </div>
                </header>
                <div className="sideMenu">
                    <div className="sideMenuContent">
                        {this.navigationConfig && _.map(this.navigationConfig, ({title, path}) => {
                            return (
                                <NavigationButton
                                    label={title}
                                    path={path}
                                />
                            );
                        })}
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}