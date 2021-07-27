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


const validateInitValues = (props) => {
    const { moduleName, generationComponentType, moduleDescription, actions, translations, tableConfigs } = props;

    let isOK = true;

    if(!moduleName ) {
        notification.error({message: "Module name is missing"});
        isOK = false;
    }

    if(_.isEmpty(actions)) {
        notification.error({message: "Actions are not provided"});
        isOK = false;
    }

    const dataSourceAction = _.get(_.filter(actions, 'isDataSource'), '[0]'); //Action which is selected as data source
    if(!dataSourceAction && COMPONENT_TYPES.tablePage === generationComponentType) {
        notification.error({message: "Data source action is not selected"});
        isOK = false;
    }

    return isOK;
}

/**
 * This method is used to create a new zip file based on generated data.
 * Requires initial values
 */
const onGenerateFiles = (props) => {
    const { moduleName, generationComponentType, moduleDescription, actions, translations, tableConfigs } = props;

    if(!validateInitValues(props)) {
        notification.info({message: "Canceled"});
        return;
    };

    const generationObject = { moduleName, generationComponentType, moduleDescription, actions, translations, tableConfigs };

    const { generateDuckFile, generateSagaFile, generatePages, generateMessagesFile, generateStylesFile } = generators(generationObject);

    let fileStructure = undefined;
    const pages = generatePages();
    const enrichedValues = enricher(generationObject);

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
                        {
                            type: TYPES_OF_FILES.file,
                            name: 'styles',
                            extension: '.m.css',
                            content: generateStylesFile(),
                        },
                        {
                            type: TYPES_OF_FILES.file,
                            name: 'messages',
                            extension: '.json',
                            content: generateMessagesFile(),
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
                        {
                            type: TYPES_OF_FILES.file,
                            name: 'styles',
                            extension: '.m.css',
                            content: generateStylesFile(),
                        },
                        {
                            type: TYPES_OF_FILES.file,
                            name: 'messages',
                            extension: '.json',
                            content: generateMessagesFile(),
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

export {
    onGenerateFiles,
};