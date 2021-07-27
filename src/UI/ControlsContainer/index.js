//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

//proj

//own
import "./styles.css";

/**
 * Container for controls buttons
 */
export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div className="controlsMainCont">
                {children}
            </div>
        );
    }
}