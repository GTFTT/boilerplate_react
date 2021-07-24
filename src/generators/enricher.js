//vendor
import { constantCase, camelCase, capitalCase, pascalCase, snakeCase } from 'change-case'; //For converting different types of variables(camelCase, snake case, etc.)
import _ from 'lodash';

//proj
import { ACTION_TYPES, COMPONENT_TYPES } from 'globalConstants';

/**
 * Actions enriching - generating more fields that can be used later
 * @param {*} actions 
 * @returns Enriched actions
 */
function enrichActions(actions) {
    const enrichedActions = _.map(actions, (action) => {
        let enriched =  {
            ...action,
            constants: {}, //Constant names, can be more than one
            actionCreators: {}, //Action function names, different for different types of actions
            sagas: {}, //Action function names, different for different types of actions
        };

        switch (action.actionType) {
            case ACTION_TYPES.fetch:
                enriched.constants = {
                    setFetching: constantCase(`set fetching ${action.actionName}`),
                    fetch: constantCase(`${action.actionType} ${action.actionName}`),
                    fetchSuccess: constantCase(`${action.actionType} ${action.actionName} success`),
                }

                enriched.actionCreators = {
                    setFetching: camelCase(`set fetching ${action.actionName}`),
                    fetch: camelCase(`${action.actionType} ${action.actionName}`),
                    fetchSuccess: camelCase(`${action.actionType} ${action.actionName} success`),
                }

                enriched.sagas = {
                    sagaName: camelCase(`${action.actionType} ${action.actionName} saga`)
                }

                //Used to store data inside them
                enriched.valueNames = {
                    value: camelCase(`${action.actionName}`),
                    fetchingValue: camelCase(`fetching ${action.actionName}`)
                }

                enriched.selectors = {
                    value: camelCase(`select ${action.actionName}`),
                    fetchingValue: camelCase(`select fetching ${action.actionName}`)
                }

                enriched.propertyName = camelCase(action.actionName);
                break;

            case ACTION_TYPES.set:
                enriched.constants = {
                    set: constantCase(`${action.actionType} ${action.actionName}`),
                }

                enriched.actionCreators = {
                    set: camelCase(`${action.actionType} ${action.actionName}`),
                }

                enriched.valueNames = {
                    value: camelCase(`${action.actionName}`)
                }

                enriched.selectors = {
                    value: camelCase(`select ${action.actionName}`),
                }

                enriched.propertyName = camelCase(action.actionName);
                break;

            case ACTION_TYPES.poorSagaAction:
                enriched.constants = {
                    poorSagaAction: constantCase(`${action.actionName}`),
                }

                enriched.sagas = {
                    sagaName: camelCase(`${action.actionName} saga`)
                }

                enriched.actionCreators = {
                    poorSagaAction: camelCase(`${action.actionName}`),
                }
                break;

            case ACTION_TYPES.poorReducerAction:
                enriched.constants = {
                    poorReducerAction: constantCase(`${action.actionName}`),
                }

                enriched.actionCreators = {
                    poorReducerAction: camelCase(`${action.actionName}`),
                }
                break;
        }

        return enriched;
    })
    return Object.freeze(enrichedActions);
}

/**
 * Enrich translations that will be used for a whole generated module
 * @param {*} componentName - name of a component for which translations are generated
 * @param {*} translations - translations object
 * @returns 
 */
function enrichTranslations(componentName, translations) {

    const enrichedTranslations = _.map(translations, (translation) => {
        let enriched =  {
            ...translation,
            constantEn: `"${snakeCase(componentName )}.${snakeCase(translation.translationName)}": "${translation.translationEn || ''}"`,
            constantUk: `"${snakeCase(componentName )}.${snakeCase(translation.translationName)}": "${translation.translationUk || ''}"`,
            constantRu: `"${snakeCase(componentName )}.${snakeCase(translation.translationName)}": "${translation.translationRu || ''}"`,
            formattedMessage: `<FormattedMessage id="${snakeCase(componentName )}.${snakeCase(translation.translationName)}" />`,
            formatMessage: `formatMessage({ id: '${snakeCase(componentName )}.${snakeCase(translation.translationName)}' })`,
        };

        return enriched;
    })
    return Object.freeze(enrichedTranslations);
}

function enrichTableConfigs(tableConfigs, enrichedTranslations) {

    const enrichedTableConfigs = _.map(tableConfigs, (tableConfig) => {
        const translationOfCurrentConfig = _.get(_.filter(enrichedTranslations, obj => obj.key === tableConfig.tableConfigTranslationKey), '[0]')
        let enriched =  {
            ...tableConfig,
            tableConfigName: camelCase(`${tableConfig.tableConfigName} col`),
            formattedMessage: _.get(translationOfCurrentConfig, 'formattedMessage'),
            formatMessage: _.get(translationOfCurrentConfig, 'formatMessage'),
        };

        return enriched;
    })
    return Object.freeze(enrichedTableConfigs);
}


/**
 * Before we start generation we have to enrich generation object - add more fields and pre-generate some variables.
 */
export default (generationObject) => {
    const { moduleName, generationComponentType, actions, translations, tableConfigs } = generationObject;

    const moduleNameCamelCase = camelCase(moduleName);
    const pageName = pascalCase(`${moduleName} page`);
    const pageTableName = pascalCase(`${moduleName} table`);
    const modalName = pascalCase(`${moduleName} modal`);

    //Component name for generating translations
    const translationComponentName = ([COMPONENT_TYPES.poorPage, COMPONENT_TYPES.tablePage].includes(generationComponentType))
        ? pageName
        : modalName;

    const enrichedActions = enrichActions(actions);
    const enrichedTranslations = enrichTranslations(translationComponentName, translations);
    const enrichedTableConfigs = enrichTableConfigs(tableConfigs, enrichedTranslations);

    const componentName = (generationComponentType == COMPONENT_TYPES.poorPage)
        ? pageName
        : (generationComponentType == COMPONENT_TYPES.tablePage)
            ? pageTableName
            : modalName;

    return Object.freeze({
        ...generationObject,

        moduleName: moduleNameCamelCase,
        componentName, //Current component name

        actions: enrichedActions,
        translations: enrichedTranslations,
        tableConfigs: enrichedTableConfigs,

        pageName,
        pageTableName,
        modalName,
    });
}