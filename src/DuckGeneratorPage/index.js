//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import ReactJson from 'react-json-view'
import { pascalCase } from 'change-case';

//proj
import generators from "generators";
import { downloadZipFile } from 'utils';
import { COMPONENT_TYPES, TYPES_OF_FILES } from 'globalConstants';
import enricher from 'generators/enricher';

//own
import InputArray from './InputArray';
import "./styles.css";

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

export default class DuckGeneratorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleName: "test",
            moduleDescription: undefined,
            generatingComponent: COMPONENT_TYPES.poorPage,
            actions: [],
        };
    }

    onGenerateFiles = () => {
        const {moduleName, generatingComponent, moduleDescription, actions} = this.state;

        if(!moduleName || _.isEmpty(actions)) {
            notification.error({message: "Not enough information provided!"});
            return;
        }

        const { generateDuckFile, generateSagaFile, generatePage } = generators({actions, moduleName, generatingComponent, moduleDescription});

        let componentName = "";
        switch (generatingComponent) {
            case COMPONENT_TYPES.poorPage:
            case COMPONENT_TYPES.tablePage:
                componentName = pascalCase(`${moduleName} page`)
                break;
            case COMPONENT_TYPES.modal:
                componentName = pascalCase(`${moduleName} modal`)
                break;
        
            default:
                componentName = "UNKNOWN"
                break;
        }

        const fileStructure = [
            {
                type: TYPES_OF_FILES.directory,
                name: `${componentName}`,
                content: [
                    {
                        type: TYPES_OF_FILES.directory,
                        name: 'redux',
                        content: [
                            {
                                type: TYPES_OF_FILES.file,
                                name: 'duck',
                                extension: '.js',
                                content: generateDuckFile(),
                            },
                            {
                                type: TYPES_OF_FILES.file,
                                name: 'saga',
                                extension: '.js',
                                content: generateSagaFile(),
                            },
                        ]
                    },
                    {
                        type: TYPES_OF_FILES.file,
                        name: 'index',
                        extension: '.js',
                        content: generatePage(),
                    },
                ]
            }
        ];

        downloadZipFile(fileStructure);
        
        // downloadTxtFile(generateDuckFile(), "duck.txt");
        // downloadTxtFile(generateSagaFile(), "saga.txt");
        // downloadTxtFile(generatePage(), "page.txt");

        notification.info({
            message: (
                <div>
                    <div>{`Module: ${moduleName}`}</div>
                </div>
            )
        });
    }

    render() {

        const {actions, moduleName, generatingComponent, moduleDescription} = this.state;

        return (
            <div className="mainConst">
                <Collapse className="collapse" defaultActiveKey={['1', '2']}>
                    <Panel header="Settings" key="1">
                        <div className="settingsContainer">
                            <Input
                                placeholder="Module name"
                                value={moduleName}
                                onChange={(e) => this.setState({moduleName: e.target.value})}
                            />

                            <TextArea
                                placeholder="Module description(comment)"
                                rows={4}
                                className="textArea"
                                onChange={(e) => this.setState({moduleDescription: e.target.value})}
                            />

                            <div className="radioCont">
                                Module type:
                                <br /> 
                                <RadioGroup value={generatingComponent} onChange={(e) => this.setState({generatingComponent: e.target.value})}>
                                    <Radio value={COMPONENT_TYPES.poorPage}>Poor page</Radio>
                                    <Radio value={COMPONENT_TYPES.tablePage}>Table page</Radio>
                                    <Radio value={COMPONENT_TYPES.modal}>Modal</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </Panel>
                    <Panel header="Create actions" key="2">
                        <div className="settingsContainer">
                            <Tabs className="tabs" tabPosition="left">
                                <TabPane tab="Actions generator" key="1">
                                    <InputArray
                                        actionsChanged={(actions) => {
                                            this.setState({ actions });
                                        }}
                                    />
                                </TabPane>
                                <TabPane tab="Input" key="2">
                                    <div className="jsonContainer">
                                        <ReactJson
                                            name={false}
                                            displayObjectSize={false}
                                            displayDataTypes={false}
                                            collapseStringsAfterLength={true}
                                            src={this.state}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tab="Generation object" key="3">
                                    <div className="jsonContainer">
                                        <ReactJson
                                            name={false}
                                            displayObjectSize={false}
                                            displayDataTypes={false}
                                            collapseStringsAfterLength={true}
                                            src={enricher({actions, moduleName, generatingComponent, moduleDescription})}
                                        />
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Panel>
                </Collapse>

                <Button className="generateButton" onClick={() => this.onGenerateFiles()}>Generate</Button>
            </div>
        );
    }
}