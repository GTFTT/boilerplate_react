//vendor

//proj
import { ACTION_TYPES } from 'globalConstants';

//own
import duckGenerator from './duckGenerator';

export default ({moduleName, actions}) => {

    /**
     * 
     * @param {*} actions  - Array of action objects
     * @param {*} filepath  - where to save generated outpu
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

    return {
        generateDuckFile,
    };
}