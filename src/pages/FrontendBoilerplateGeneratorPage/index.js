//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import ReactJson from 'react-json-view'
import { pascalCase } from 'change-case';
import { connect } from "react-redux";

//proj
import generators from "generators";
import { downloadZipFile } from 'utils';
import { COMPONENT_TYPES, TYPES_OF_FILES } from 'globalConstants';
import enricher from 'generators/enricher';

//own
import InputArray from './InputArray';
import "./styles.css";
import {
    setModuleName,
    setModuleDescription,
    setGenerationComponentType,

    selectModuleName,
    selectModuleDescription,
    selectGenerationComponentType,
    selectActions,
} from './redux/duck';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;


const mapStateToProps = state => ({
    moduleName: selectModuleName(state),
    moduleDescription: selectModuleDescription(state),
    generationComponentType: selectGenerationComponentType(state),
    actions: selectActions(state),
});

const mapDispatchToProps = {
    setModuleName,
    setModuleDescription,
    setGenerationComponentType,
};

class FrontendBoilerplateGeneratorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleName: "test",
            moduleDescription: undefined,
            generationComponentType: COMPONENT_TYPES.poorPage,
            actions: [],
        };
    }

    onGenerateFiles = () => {
        const { moduleName, generationComponentType, moduleDescription, actions } = this.props;

        if(!moduleName || _.isEmpty(actions)) {
            notification.error({message: "Not enough information provided!"});
            return;
        }

        const { generateDuckFile, generateSagaFile, generatePages } = generators({actions, moduleName, generationComponentType, moduleDescription});

        let fileStructure = undefined;
        const pages = generatePages();
        const enrichedValues = enricher({actions, moduleName, generationComponentType, moduleDescription});

        let componentName = "";
        switch (generationComponentType) {
            case COMPONENT_TYPES.poorPage:
                componentName = enrichedValues.pageName;
                fileStructure = [
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
                                content: pages.poorPage,
                            },
                        ]
                    }
                ];
                break;
            case COMPONENT_TYPES.tablePage:
                componentName = enrichedValues.pageName;
                fileStructure = [
                    {
                        type: TYPES_OF_FILES.directory,
                        name: `${componentName}`,
                        content: [
                            {
                                type: TYPES_OF_FILES.directory,
                                name: 'components',
                                content: [
                                    {
                                        type: TYPES_OF_FILES.directory,
                                        name: 'tables',
                                        content: [
                                            {
                                                type: TYPES_OF_FILES.directory,
                                                name: enrichedValues.pageTableName,
                                                content: [
                                                    {
                                                        type: TYPES_OF_FILES.file,
                                                        name: 'index',
                                                        extension: '.js',
                                                        content: pages.table,
                                                    },
                                                    {
                                                        type: TYPES_OF_FILES.file,
                                                        name: 'styles',
                                                        extension: '.m.css',
                                                        content: pages.tableStyles,
                                                    },
                                                    {
                                                        type: TYPES_OF_FILES.file,
                                                        name: 'config',
                                                        extension: '.js',
                                                        content: pages.tableConfig,
                                                    },
                                                ],
                                            },
                                            {
                                                type: TYPES_OF_FILES.file,
                                                name: 'index',
                                                extension: '.js',
                                                content: pages.tablesIndexFile,
                                            }
                                        ],
                                    }
                                ],
                            },
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
                                content: pages.tablePage,
                            },
                        ]
                    }
                ];
                break;
            case COMPONENT_TYPES.modal:
                componentName = pascalCase(`${moduleName} modal`);
                break;
        }
        
        downloadZipFile(fileStructure);

        notification.info({
            message: (
                <div>
                    <div>{`Module: ${moduleName}`}</div>
                </div>
            )
        });
    }

    render() {

        const {
            // actions,
            // moduleName,
            // generationComponentType,
            // moduleDescription,
        } = this.state;

        const {
            actions,
            moduleName,
            moduleDescription,
            generationComponentType,

            setModuleName,
            setModuleDescription,
            setGenerationComponentType,
        } = this.props;

        return (
            <div className="mainConst">
                <Collapse className="collapse" defaultActiveKey={['settings']}>
                    <Panel header="Settings" key="settings">
                        <div className="settingsContainer">
                            <Input
                                placeholder="Module name"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                            />

                            <TextArea
                                placeholder="Module description(comment)"
                                rows={4}
                                className="textArea"
                                onChange={(e) => setModuleDescription(e.target.value)}
                            />

                            <div className="radioCont">
                                Module type:
                                <br /> 
                                <RadioGroup
                                    value={generationComponentType}
                                    onChange={(e) => setGenerationComponentType(e.target.value)}
                                >
                                    <Radio value={COMPONENT_TYPES.poorPage}>Poor page</Radio>
                                    <Radio value={COMPONENT_TYPES.tablePage}>Table page</Radio>
                                    <Radio value={COMPONENT_TYPES.modal}>Modal</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </Panel>
                    <Panel header="Translations" key="translations"></Panel>
                    <Panel header="Table configuration" key="tableConfigs"></Panel>
                    <Panel header="Create actions" key="actions">
                        <div className="settingsContainer">
                            <Tabs className="tabs" tabPosition="left">
                                <TabPane tab="Actions generator" key="1">
                                    <InputArray />
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
                                            src={enricher({actions, moduleName, generationComponentType, moduleDescription})}
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

export default connect(mapStateToProps, mapDispatchToProps)(FrontendBoilerplateGeneratorPage);