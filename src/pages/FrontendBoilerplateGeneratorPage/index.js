//vendor
import React from 'react';
import { Collapse, Input, Button, notification, Tabs, Radio } from 'antd';
import _ from 'lodash';
import ReactJson from 'react-json-view'
import { pascalCase, camelCase } from 'change-case';
import { connect } from "react-redux";

//proj
import generators from "generators/frontendGenerators";
import { downloadZipFile } from 'utils';
import { COMPONENT_TYPES, TYPES_OF_FILES } from 'globalConstants';
import enricher from 'generators/frontendGenerators/enricher';
import { ControlsContainer } from 'UI';

//own
import "./styles.css";
import { onGenerateFiles } from './fileBuilder';
import {
    ActionsArray,
    TranslationsArray,
    TableConfigurationsArray,
} from './components';
import {
    setModuleName,
    setModuleDescription,
    setGenerationComponentType,

    selectModuleName,
    selectModuleDescription,
    selectGenerationComponentType,
    selectActions,
    selectTranslations,
    selectTableConfigs,
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
    translations: selectTranslations(state),
    tableConfigs: selectTableConfigs(state),
});

const mapDispatchToProps = {
    setModuleName,
    setModuleDescription,
    setGenerationComponentType,
};

class FrontendBoilerplateGeneratorPage extends React.Component {
    constructor(props) {
        super(props);
    }

   

    render() {
        const {
            actions,
            moduleName,
            moduleDescription,
            generationComponentType,
            translations,
            tableConfigs,

            setModuleName,
            setModuleDescription,
            setGenerationComponentType,
        } = this.props;
        
        const generationObject = { moduleName, generationComponentType, moduleDescription, actions, translations, tableConfigs };
        const enrichedValues = enricher(generationObject);
        const parentComponentName = (enrichedValues.generationComponentType == COMPONENT_TYPES.poorPage || enrichedValues.generationComponentType == COMPONENT_TYPES.tablePage)? camelCase(enrichedValues.pageName): camelCase(enrichedValues.modalName);

        return (
            <div className="mainConst">
                <ControlsContainer>
                    <Button onClick={() => onGenerateFiles(generationObject)}>Generate</Button>
                </ControlsContainer>
                <div style={{width: '90vw'}}>
                    <p style={{width: '90vw', textAlign: 'left', fontSize: '0.6em'}}>
                        Connect messages: {`import ${ pascalCase(parentComponentName) } from 'pages/${pascalCase(parentComponentName)}/messages';`}
                        <br />
                        Connect saga: {`import { saga as ${ parentComponentName }Saga } from 'pages/${pascalCase(parentComponentName)}/redux/saga';`}
                        <br />
                        Connect duck: {`import ${ parentComponentName }Reducer, {moduleName as ${parentComponentName}Module} from 'pages/${pascalCase(parentComponentName)}/redux/duck';`}
                    </p>
                </div>
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
                                rows={2}
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

                    <Panel header="Translations" key="translations">
                        <TranslationsArray />
                    </Panel>

                    <Panel header="Table configuration" key="tableConfigs">
                        <TableConfigurationsArray />
                    </Panel>
                    
                    <Panel header="Create actions" key="actions">
                        <div className="settingsContainer">
                            <Tabs className="tabs" tabPosition="top">
                                <TabPane tab="Actions generator" key="1">
                                    <ActionsArray />
                                </TabPane>
                                <TabPane tab="Input" key="2">
                                    <div className="jsonContainer">
                                        <ReactJson
                                            name={false}
                                            displayObjectSize={false}
                                            displayDataTypes={false}
                                            collapseStringsAfterLength={true}
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
                                            src={enrichedValues}
                                        />
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrontendBoilerplateGeneratorPage);