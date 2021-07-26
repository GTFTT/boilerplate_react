//vendor
import React from 'react';
import { Input, List, Button, Select, Popover } from 'antd';
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

const Item = List.Item;
const Option = Select.Option;



/**
 * Each action has its additional fields we have to render
 * @param {*} params.key - action identifier
 * @param {*} params.actionType - type of an action
 */
const renderAdditionalFields = ({key, actionType, actionFetchURL, actionInitValue}) => {
    switch (actionType) {
        case ACTION_TYPES.fetch:
            return (
                <div>
                    <Input
                        value={actionFetchURL}
                        className="input"
                        placeholder="Fetching URL"
                        onChange={(e) => this.changeActionProps(key, {actionFetchURL: e.target.value})}
                    />
                    <Select
                        value={actionInitValue}
                        className="select"
                        placeholder="Init value"
                        onChange={(initValue) => this.changeActionProps(key, {actionInitValue: initValue})}
                    >
                        {_.map(DEF_INIT_VALUES, (value, key) => {
                            return (
                                <Option value={value}>{sentenceCase(key)}</Option>
                            )
                        })}
                    </Select>
                </div>
            )
        case ACTION_TYPES.set:
            return (
                <Select
                    value={actionInitValue}
                    className="select"
                    placeholder="Select init value"
                    onChange={(initValue) => this.changeActionProps(key, {actionInitValue: initValue})}
                >
                    {_.map(DEF_INIT_VALUES, (value, key) => {
                        return (
                            <Option value={value}>{sentenceCase(key)}</Option>
                        )
                    })}
                </Select>
            )
        default:
            return undefined;
    }

}
/**
 * Each action has its additional settings we have to render components to make it possible to edit them
 * @param {*} params.key - action identifier
 * @param {*} params.actionType - type of an action
 */
const renderAdditionalSettings = ({key, actionType, actionFetchURL, actionInitValue}) => {
    switch (actionType) {
        case ACTION_TYPES.fetch:
            return (
                <div>
                    <Input
                        value={actionFetchURL}
                        className="input"
                        placeholder="Fetching URL"
                        onChange={(e) => this.changeActionProps(key, {actionFetchURL: e.target.value})}
                    />
                    <Select
                        value={actionInitValue}
                        className="select"
                        placeholder="Init value"
                        onChange={(initValue) => this.changeActionProps(key, {actionInitValue: initValue})}
                    >
                        {_.map(DEF_INIT_VALUES, (value, key) => {
                            return (
                                <Option value={value}>{sentenceCase(key)}</Option>
                            )
                        })}
                    </Select>
                </div>
            )
        case ACTION_TYPES.set:
            return (
                <Select
                    value={actionInitValue}
                    className="select"
                    placeholder="Select init value"
                    onChange={(initValue) => this.changeActionProps(key, {actionInitValue: initValue})}
                >
                    {_.map(DEF_INIT_VALUES, (value, key) => {
                        return (
                            <Option value={value}>{sentenceCase(key)}</Option>
                        )
                    })}
                </Select>
            )
        default:
            return undefined;
    }

}

export {
    renderAdditionalFields,
    renderAdditionalSettings,
};