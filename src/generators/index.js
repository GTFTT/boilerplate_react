//vendor
import { constantCase, camelCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

//proj
import { ACTION_TYPES } from 'globalConstants';

//own
import duckGenerator from './duckGenerator';
import sagaGenerator from './sagaGenerator';

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
                break;

            case ACTION_TYPES.set:
                enriched.constants = {
                    set: constantCase(`${action.actionType} ${action.actionName}`),
                }

                enriched.actionCreators = {
                    set: camelCase(`${action.actionType} ${action.actionName}`),
                }
                break;
        }

        return enriched;
    })
    return Object.freeze(enrichedActions);
}


/**
 * 
 * @param {*} params.moduleName 
 * @param {*} params.actions  - Array of action objects
 * @example
 *  const actions = [
 *      {
 *          actionName: 'vehicles',
 *          actionType: ACTION_TYPES.fetch
 *      },
 *      {
 *          actionName: 'recommendations',
 *          actionType: ACTION_TYPES.fetch
 *      },
 *      {
 *          actionName: 'vehiclesFetching',
 *          actionType: ACTION_TYPES.set
 *      },
 *  ];
 */
export default ({moduleName, actions}) => {

    const enrichedActions = enrichActions(actions);

    console.log("enrichedActions: ", enrichedActions);
    
    function generateDuckFile() {
        const {
            generateHeader,
            generateConstants,
            generateReducerInitState,
            generateReducer,
            generateSelectors,
            generateActionCreators,
        } = duckGenerator({moduleName, actions: enrichedActions});

        // Data which will write in a file. 
        let data = ""
            + generateHeader() + "\n\n"
            + generateConstants() + "\n"
            + generateReducerInitState() + "\n"
            + generateReducer() + "\n\n"
            + generateSelectors() + "\n\n"
            + generateActionCreators() + "\n";

        return data;
    }

    function generateSagaFile() {
        const {
            generateImports,
            generateSagas,
            generateCommonSaga,
        } = sagaGenerator({moduleName, actions: enrichedActions});

        // Data which will write in a file. 
        let data = ""
            + generateImports() + "\n\n"
            + generateSagas() + "\n"
            + generateCommonSaga() + "\n";

        return data;
    }

    return {
        generateDuckFile,
        generateSagaFile,
    };
}