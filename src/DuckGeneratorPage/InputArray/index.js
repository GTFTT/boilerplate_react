//vendor
import React from 'react';
import { Input, List, Button, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import _ from 'lodash';
import { v4 } from 'uuid';
import { constantCase } from 'change-case';

//proj
import { ACTION_TYPES } from 'globalConstants';

//own
import './styles.css';

const Item = List.Item;
const Option = Select.Option;

/**
 * Generate array which represents one action.
 * 
 * @property { Function(actions) } actionsChanged - callback, called when actions are changed
 */
export default class InputArray extends React.Component {
    constructor(props) {
        super(props);

        //Init state obj
        this.state = {
            actions: []
        };
    }

    /**
     * Used to update state and perform additional actions.
     * Call callback functions if something changed.
     * @param {*} newState 
     */
    updateState = (newState) => {
        const { actionsChanged } = this.props;

        this.setState(newState, () => actionsChanged && actionsChanged(_.get(this, 'state.actions')))
    }

    createNewItem = () => {
        this.updateState({
            actions: [
                ..._.get(this, 'state.actions'),
                {
                    actionName: "vehicles",
                    actionType: ACTION_TYPES.fetch,
                    key: v4(),
                }
            ]
        })
    }

    deleteItem = (key) => {
        this.updateState({
            actions: [
                ..._.filter(_.get(this, 'state.actions'), (item) => item.key != key),
            ]
        })
    }

    /**
     * When changed input value of an action.
     * Values will be replaced only if they are provided
     * @param {*} key - uuid
     * @param {*} params - action
     */
    onChangeInputValue = (key, {actionName, actionType}) => {
        const actions = _.get(this, 'state.actions');

        const newInputValues = _.map(actions, (item) => {
            if(item.key == key)
                return {
                    ...item,
                    actionName: actionName? actionName: item.actionName,
                    actionType: actionType? actionType: item.actionType,
                }
            else
                return item;
        })

        this.updateState({
            actions: newInputValues
        })
    } 


    render() {

        return (
            <div>
                <List
                    size={"small"}
                    bordered
                    dataSource={_.get(this, 'state.actions')}
                    header={
                        <Button onClick={() => this.createNewItem()} type="primary">Create a new one</Button>
                    }
                    renderItem={item => (
                        <Item
                            actions={[
                                <Button onClick={() => this.deleteItem(item.key)}><DeleteTwoTone /></Button>
                            ]}
                        >
                            <div className={"item"}>
                                <Input
                                    className="input"
                                    value={_.get(item, 'actionName')}
                                    onChange={(e) => this.onChangeInputValue(item.key, {actionName: e.target.value})}
                                />

                                <Select
                                    value={_.get(item, 'actionType')}
                                    className="select"
                                    onChange={(key) => this.onChangeInputValue(item.key, {actionType: key})}
                                >
                                    <Option value={ACTION_TYPES.fetch}>{constantCase(ACTION_TYPES.fetch)}</Option>
                                    <Option value={ACTION_TYPES.set}>{constantCase(ACTION_TYPES.set)}</Option>
                                </Select>
                            </div>
                        </Item>
                    )}
                />
            </div>
        );
    }
}