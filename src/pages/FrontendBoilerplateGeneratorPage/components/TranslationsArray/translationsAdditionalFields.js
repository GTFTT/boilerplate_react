//vendor
import React from 'react';
import { Input, List, Button, Select, Popover, Row, Col, Checkbox } from 'antd';
import { DeleteTwoTone, SettingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { v4 } from 'uuid';
import { camelCase, constantCase, sentenceCase } from 'change-case';
import { connect } from "react-redux";

//proj
import { ACTION_TYPES, DEF_INIT_VALUES } from 'globalConstants';
import {
    setActions,
    selectActions,
} from 'pages/FrontendBoilerplateGeneratorPage/redux/duck';

//own
import './styles.css';

const Option = Select.Option;

/**
 * Each action has its additional settings we have to render components to make it possible to edit them
 * @param {*} params.key - action identifier
 * @param {*} params.actionType - type of an action
 * @param {*} options - Additional functions
 */
const renderAdditionalSettings = ({key, isPageTitle}, options) => {
    const { changeTranslation } = options;

    return (
        <div>
            <Row>
                <Col span={12}>Make page title: </Col>
                <Col span={12}>
                    <Checkbox checked={isPageTitle} onChange={(e) => changeTranslation(key, {isPageTitle: e.target.checked})} />
                </Col>
            </Row>
        </div>
    )

}

export {
    renderAdditionalSettings,
};