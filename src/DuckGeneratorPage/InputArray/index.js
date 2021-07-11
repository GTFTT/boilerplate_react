//vendor
import React from 'react';
import { Input, List, Button, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import _ from 'lodash';
import { v4 } from 'uuid';
import { constantCase } from 'change-case';

//proj
import { ACTION_TYPES } from './../constants';

//own
import './styles.css';

const Item = List.Item;
const Option = Select.Option;

export default class InputArray extends React.Component {
    constructor(props) {
        super(props);

        //Init state obj
        this.state = {
            inputValues: [
                {
                    value: "test action",
                    key: v4(),
                }
            ]
        };
    }

    createNewItem = () => {
        this.setState({
            inputValues: [
                ..._.get(this, 'state.inputValues'),
                {
                    value: "new action",
                    key: v4(),
                }
            ]
        })
    }

    deleteItem = (key) => {
        this.setState({
            inputValues: [
                ..._.filter(_.get(this, 'state.inputValues'), (item) => item.key != key),
            ]
        })
    }

    onChangeInputValue = (key, newText) => {
        const inputValues = _.get(this, 'state.inputValues');

        const newInputValues = _.map(inputValues, (item) => {
            if(item.key == key) return {...item, value: newText}
            return item
        })

        this.setState({
            inputValues: newInputValues
        })
    } 


    render() {

        return (
            <div>
                <button onClick={() => this.createNewItem()}>Press</button>
                <List
                    size={"small"}
                    bordered
                    dataSource={_.get(this, 'state.inputValues')}
                    renderItem={item => (
                        <Item
                            actions={[
                                <Button onClick={() => this.deleteItem(item.key)}><DeleteTwoTone /></Button>
                            ]}
                        >
                            <div className={"item"}>
                                <Input className="input" value={_.get(item, 'value')} onChange={(e) => this.onChangeInputValue(item.key, e.target.value)} />

                                <Select defaultValue={ACTION_TYPES.fetch} className="select">
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