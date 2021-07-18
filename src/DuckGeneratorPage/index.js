//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import ReactJson from 'react-json-view'

//proj
import generators from "generators";
import { downloadTxtFile } from '../utils';
import { COMPONENT_TYPES } from 'globalConstants';

//own
import InputArray from './InputArray';
import "./styles.css";

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export default class DuckGeneratorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleName: undefined,
            generatingComponent: COMPONENT_TYPES.poorPage,
            actions: [],
        };
    }

    onGenerateFiles = () => {
        const {moduleName, actions} = this.state;

        if(!moduleName || _.isEmpty(actions)) {
            notification.error({message: "Not enough information provided!"});
            return;
        }

        const { generateDuckFile, generateSagaFile } = generators({actions, moduleName});
        
        downloadTxtFile(generateDuckFile(), "duck.txt");
        downloadTxtFile(generateSagaFile(), "saga.txt");

        notification.info({
            message: (
                <div>
                    <div>{`Module: ${moduleName}`}</div>
                </div>
            )
        });
    }

    render() {

        const { actions, generatingComponent } = this.state;

        return (
            <div>
                <Collapse defaultActiveKey={['1', '2']}>
                    <Panel header="Settings" key="1">
                        <Input
                            placeholder="Module name"
                            onChange={(e) => this.setState({moduleName: e.target.value})}
                        />

                        <div className="radioCont">
                            <RadioGroup value={generatingComponent} onChange={(e) => this.setState({generatingComponent: e.target.value})}>
                                <Radio value={COMPONENT_TYPES.poorPage}>Poor page</Radio>
                                <Radio value={COMPONENT_TYPES.tablePage}>Table page</Radio>
                                <Radio value={COMPONENT_TYPES.modal}>Modal</Radio>
                            </RadioGroup>
                        </div>
                    </Panel>
                    <Panel header="Create actions" key="2">
                        <Tabs tabPosition="left">
                            <TabPane tab="Actions generator" key="1">
                                <InputArray
                                    actionsChanged={(actions) => {
                                        this.setState({ actions });
                                    }}
                                />
                            </TabPane>
                            <TabPane tab="Json viewer" key="2">
                                <div className="jsonContainer">
                                    <ReactJson
                                        name={false}
                                        collapsed={false}
                                        displayObjectSize={false}
                                        displayDataTypes={false}
                                        collapseStringsAfterLength={true}
                                        src={this.state}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
                        
                    </Panel>
                </Collapse>

                <Button className="generateButton" onClick={() => this.onGenerateFiles()}>Generate file</Button>
            </div>
        );
    }
}