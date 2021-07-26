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
 * Each action has its additional fields we have to render
 * @param {*} params.key - action identifier
 * @param {*} params.actionType - type of an action
 */
const renderAdditionalFields = ({key, actionType, actionFetchURL }, options) => {
    const { changeActionProps } = options;

    switch (actionType) {
        case ACTION_TYPES.fetch:
            return (
                <div>
                    <Input
                        value={actionFetchURL}
                        className="input"
                        placeholder="Fetching URL"
                        onChange={(e) => changeActionProps(key, {actionFetchURL: e.target.value})}
                    />
                </div>
            )
        case ACTION_TYPES.set:
            return (
                <div>

                </div>
            )
        default:
            return undefined;
    }

}
/**
 * Each action has its additional settings we have to render components to make it possible to edit them
 * @param {*} params.key - action identifier
 * @param {*} params.actionType - type of an action
 * @param {*} options - Additional functions
 */
const renderAdditionalSettings = ({key, actionType, actionInitValue, isDataSource}, options) => {
    const { changeActionProps } = options;

    const initValueSelect = (
        <div>
            <Row>
                <Col span={12}>Initial value: </Col>
                <Col span={12}>
                    <Select
                        value={actionInitValue}
                        className="select"
                        placeholder="Select init value"
                        onChange={(initValue) => changeActionProps(key, {actionInitValue: initValue})}
                    >
                        {_.map(DEF_INIT_VALUES, (value, key) => {
                            return (
                                <Option value={value}>{sentenceCase(key)}</Option>
                            )
                        })}
                    </Select>
                </Col>
            </Row>
        </div>
    );

    switch (actionType) {
        case ACTION_TYPES.fetch:
            return (
                <div>
                    {initValueSelect}
                    <Row>
                        <Col span={12}>Make data source: </Col>
                        <Col span={12}>
                            <Checkbox checked={isDataSource} onChange={(e) => changeActionProps(key, {isDataSource: e.target.checked})} />
                        </Col>
                    </Row>
                </div>
            )
        case ACTION_TYPES.set:
            return (
                <div>
                    {initValueSelect}
                </div>
            );
        default:
            return undefined;
    }

}

export {
    renderAdditionalFields,
    renderAdditionalSettings,
};