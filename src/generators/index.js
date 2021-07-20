//vendor
import { constantCase, camelCase, capitalCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

//proj
import { ACTION_TYPES, COMPONENT_TYPES } from 'globalConstants';

//own
import enricher from './enricher';
import duckGenerator from './duckGenerator';
import sagaGenerator from './sagaGenerator';
import pageGenerator from './pageGenerator';

/**
 * 
 * @param {*} params.moduleName 
 * @param {*} params.actions  - Array of action objects
 * @example
 *  const actions = [
 *      {
 *          actionName: 'vehicles',
 *          actionType: ACTION_TYPES.fetch,
 *          actionFetchURL: undefined,
 *          actionInitValue: 'undefined',
 *      },
 *      {
 *          actionName: 'vehiclesFetching',
 *          actionType: ACTION_TYPES.set,
 *          actionInitValue: 'undefined',
 *      },
 *  ];
 */
export default (generationObject) => {
    const enrichedGenerationObject = enricher(generationObject);
    const { generatingComponent } = enrichedGenerationObject;

    function generateDuckFile() {
        const {
            generateHeader,
            generateConstants,
            generateReducerInitState,
            generateReducer,
            generateSelectors,
            generateActionCreators,
        } = duckGenerator(enrichedGenerationObject);

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
        } = sagaGenerator(enrichedGenerationObject);

        // Data which will write in a file. 
        let data = ""
            + generateImports() + "\n\n"
            + generateSagas() + "\n"
            + generateCommonSaga() + "\n";

        return data;
    }

    /**
     * Generates pages depending on selected page mode(poor page, modal or something else)
     * @returns Object that contains string representation of different files based on generation mode
     */
    function generatePages() {
        const {
            generatePoorPage,

            generateTablePage,
            generateTable,
            generateTableConfig,
            generateTableStyles,
        } = pageGenerator(enrichedGenerationObject);

        let generatedPages = {};

        switch (generatingComponent) {
            case COMPONENT_TYPES.poorPage:
                generatedPages.poorPage = generatePoorPage();

            case COMPONENT_TYPES.tablePage:
                generatedPages.tablePage = generateTablePage();
                generatedPages.table = generateTable();
                generatedPages.tableConfig = generateTableConfig();
                generatedPages.tableStyles = generateTableStyles();        
        };

        return generatedPages;
    }

    return {
        generateDuckFile,
        generateSagaFile,
        generatePages,
    };
};