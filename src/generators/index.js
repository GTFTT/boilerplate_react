//vendor

//proj
import { ACTION_TYPES } from 'globalConstants';

//own
import duckGenerator from './duckGenerator';
import sagaGenerator from './sagaGenerator';

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

    
    function generateDuckFile() {
        const {
            generateHeader,
            generateConstants,
            generateReducerInitState,
            generateReducer,
            generateSelectors,
            generateActionCreators,
        } = duckGenerator({moduleName, actions});

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
        } = sagaGenerator({moduleName, actions});

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