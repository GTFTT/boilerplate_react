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
import { renderAdditionalFields, renderAdditionalSettings } from "./actionsAdditionalFields";
import './styles.css';

const Item = List.Item;
const Option = Select.Option;


const mapStateToProps = state => ({
    actions: selectActions(state),
});

const mapDispatchToProps = {
    setActions,
};


/**
 * Generate array which represents one action. This action contains basic variables gained from the user.
 * 
 * @property { Function(actions) } actionsChanged - callback, called when actions are changed
 */
class ActionsArray extends React.Component {
    /**
     * Used to update actions.
     * @param {*} params.actions - new actions to replace old with 
     */
    updateActions = ({ actions }) => {
        const { actionsChanged, setActions } = this.props;

        setActions( actions );

        // this.setState({actions}, () => actionsChanged && actionsChanged(_.get(this, 'state.actions')))
    }

    /**
     * Generate new action with initial values setup
     */
    createNewAction = () => {
        const { actions } = this.props;

        this.updateActions({
            actions: [
                ...actions,
                {
                    actionName: "test",
                    actionType: ACTION_TYPES.fetch,
                    actionFetchURL: undefined,
                    actionInitValue: DEF_INIT_VALUES.undefinedValue,
                    key: v4(),
                }
            ]
        })
    }

    deleteAction = (key) => {
        const { actions } = this.props;

        this.updateActions({
            actions: [
                ..._.filter(actions, (item) => item.key != key),
            ]
        })
    }

    /**
     * When changed input value of an action.
     * Values will be replaced only if they are provided
     * @param {*} key - uuid
     * @param {*} params - action
     */
    changeActionProps = (key, {actionName, actionType, actionInitValue, actionFetchURL}) => {
        const { actions } = this.props;

        const updatedActions = _.map(actions, (item) => {
            if(item.key == key)
                return {
                    ...item,
                    actionName: (actionName || actionName === "")? actionName: item.actionName,
                    actionFetchURL: (actionFetchURL || actionFetchURL === "")? actionFetchURL: item.actionFetchURL,
                    
                    actionType: actionType? actionType: item.actionType,
                    actionInitValue: actionInitValue? actionInitValue: item.actionInitValue,
                }
            else
                return item;
        })

        this.updateActions({
            actions: updatedActions
        })
    } 

    render() {
        const { actions } = this.props;

        return (
            <div>
                <List
                    size={"small"}
                    bordered
                    dataSource={actions}
                    locale={{emptyText: (<div>No actions</div>)}}
                    header={
                        <div>
                            <Button onClick={() => this.createNewAction()} type="primary">Create a new one</Button>
                        </div>
                    }
                    renderItem={item => (
                        <Item
                            actions={[
                                (
                                    <Popover
                                        content={
                                            <div className={"popoverContent"}>
                                                {renderAdditionalSettings(item, {changeActionProps: this.changeActionProps})}
                                            </div>
                                        }
                                        title="Additional settings"
                                        trigger="click"
                                    >
                                        <Button onClick={() => console.log("OK")} type="primary"><SettingOutlined /></Button>
                                    </Popover>
                                ),
                                (
                                    <Button onClick={() => this.deleteAction(item.key)}><DeleteTwoTone /></Button>
                                ),
                            ]}
                            key={item.key}
                        >
                            <div className={"item"}>
                                <Input
                                    value={_.get(item, 'actionName')}
                                    className="input"
                                    onChange={(e) => this.changeActionProps(item.key, {actionName: e.target.value})}
                                />

                                <Select
                                    value={_.get(item, 'actionType')}
                                    className="select"
                                    onChange={(key) => this.changeActionProps(item.key, {actionType: key})}
                                >
                                    {_.map(ACTION_TYPES, (value, key) => (<Option value={value}>{constantCase(key)}</Option>))}
                                </Select>

                                <div>
                                    {renderAdditionalFields(item, {changeActionProps: this.changeActionProps})}
                                </div>
                            </div>
                        </Item>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsArray);