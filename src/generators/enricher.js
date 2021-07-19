//vendor
import { constantCase, camelCase, capitalCase } from 'change-case'; //For converting different types of variables(camelCase, snake case, etc.)
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
 * Before we start generation we have to enrich generation object - add more fields and pre-generate some variables.
 */
export default (generationObject) => {
    const { moduleName, actions } = generationObject;

    const moduleNameCamelCase = camelCase(moduleName);
    const pageName = capitalCase(`${moduleName} page`);
    const modalName = capitalCase(`${moduleName} page`);
    const enrichedActions = enrichActions(actions);

    return {
        ...generationObject,

        moduleName: moduleNameCamelCase,
        actions: enrichedActions,
        pageName,
        modalName,
    };
}