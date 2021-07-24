//vendor
import React from 'react';
import { Input, List, Button, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import _ from 'lodash';
import { v4 } from 'uuid';
import { connect } from "react-redux";

//proj
import {
    setTableConfigs,
    selectTableConfigs,
    selectTranslations,
} from 'pages/FrontendBoilerplateGeneratorPage/redux/duck';

//own
import './styles.css';
import { ALIGN } from './constants';

const Item = List.Item;
const Option = Select.Option;


const mapStateToProps = state => ({
    tableConfigs: selectTableConfigs(state),
    translations: selectTranslations(state),
});

const mapDispatchToProps = {
    setTableConfigs,
};


/**
 * Generate array of table configurations. Used to generate tables and their configs.
 */
class TableConfigurationsArray extends React.Component {


    updateTableConfigs = ({ tableConfigs }) => {
        const { setTableConfigs } = this.props;

        setTableConfigs( tableConfigs );
    }

    createTableConfig = () => {
        const { tableConfigs } = this.props;

        this.updateTableConfigs({
            tableConfigs: [
                ...tableConfigs,
                {
                    tableConfigTranslationKey: undefined,
                    tableConfigName: "test",
                    tableConfigWidth: undefined,
                    tableConfigDataIndex: undefined,
                    tableConfigAlign: ALIGN.right,
                    key: v4(),
                }
            ]
        })
    }

    deleteTableConfig = (key) => {
        const { tableConfigs } = this.props;

        this.updateTableConfigs({
            tableConfigs: [
                ..._.filter(tableConfigs, (item) => item.key != key),
            ]
        })
    }

    changeTableConfig = (key, options) => {
        const { tableConfigs } = this.props;

        const updatedTableConfigs = _.map(tableConfigs, (item) => {
            if(item.key == key)
                return {
                    ...item,
                    tableConfigTranslationKey: ("tableConfigTranslationKey" in options)
                        ? options.tableConfigTranslationKey
                        : item.tableConfigTranslationKey,

                    tableConfigName: ("tableConfigName" in options)
                        ? options.tableConfigName
                        : item.tableConfigName,

                    tableConfigWidth: ("tableConfigWidth" in options)
                        ? options.tableConfigWidth
                        : item.tableConfigWidth,

                    tableConfigDataIndex: ("tableConfigDataIndex" in options)
                        ? options.tableConfigDataIndex
                        : item.tableConfigDataIndex,

                    tableConfigAlign: ("tableConfigAlign" in options)
                        ? options.tableConfigAlign
                        : item.tableConfigAlign,
                }
            else
                return item;
        })

        this.updateTableConfigs({
            tableConfigs: updatedTableConfigs
        })
    } 


    render() {
        const { tableConfigs, translations } = this.props;

        return (
            <div>
                <List
                    size={"small"}
                    bordered
                    dataSource={tableConfigs}
                    locale={{emptyText: (<div>No table configs</div>)}}
                    header={
                        <Button onClick={() => this.createTableConfig()} type="primary">Create a new one</Button>
                    }
                    renderItem={item => (
                        <Item
                            actions={[
                                <Button onClick={() => this.deleteTableConfig(item.key)}><DeleteTwoTone /></Button>
                            ]}
                            key={item.key}
                        >
                            <div className={"item"}>
                                <Select
                                    value={_.get(item, 'tableConfigTranslationKey')}
                                    className="select"
                                    onChange={(key) => this.changeTableConfig(item.key, {tableConfigTranslationKey: key})}
                                >
                                    {_.map(translations, (translation) => (<Option value={translation.key}>{_.get(translation, 'translationName')}</Option>))}
                                </Select>
                                
                                <Input
                                    value={_.get(item, 'tableConfigName')}
                                    placeholder="Name"
                                    className="input"
                                    onChange={(e) => this.changeTableConfig(item.key, {tableConfigName: e.target.value})}
                                />

                                <Input
                                    value={_.get(item, 'tableConfigWidth')}
                                    placeholder="Width"
                                    className="input"
                                    onChange={(e) => this.changeTableConfig(item.key, {tableConfigWidth: e.target.value})}
                                />

                                <Input
                                    value={_.get(item, 'tableConfigDataIndex')}
                                    placeholder="Data index"
                                    className="input"
                                    onChange={(e) => this.changeTableConfig(item.key, {tableConfigDataIndex: e.target.value})}
                                />

                                <Select
                                    value={_.get(item, 'tableConfigAlign')}
                                    className="select"
                                    onChange={(align) => this.changeTableConfig(item.key, {tableConfigAlign: align})}
                                >
                                    {_.map(ALIGN, (align) => (<Option value={align}>{align}</Option>))}
                                </Select>
                            </div>
                        </Item>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableConfigurationsArray);