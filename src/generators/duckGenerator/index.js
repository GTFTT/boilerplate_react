import { constantCase, camelCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

//proj
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';

function generateConstant({ actionType, constants }) {
    let result = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            result +=`export const ${constants.fetch} = \`\${prefix}/${constants.fetch}\`;\n`;
            result +=`export const ${constants.fetchSuccess} = \`\${prefix}/${constants.fetchSuccess}\`;\n`;
            result +=`export const ${constants.setValueFilters} = \`\${prefix}/${constants.setValueFilters}\`;\n`;
            result +=`export const ${constants.setFetching} = \`\${prefix}/${constants.setFetching}
            \`;\n\n`;
            break;

        case ACTION_TYPES.set:
            result +=`export const ${constants.set} = \`\${prefix}/${constants.set}\`;\n`;
            break;

        case ACTION_TYPES.poorSagaAction:
            result +=`export const ${constants.poorSagaAction} = \`\${prefix}/${constants.poorSagaAction}\`;\n`;
            break;

        case ACTION_TYPES.poorReducerAction:
            result +=`export const ${constants.poorReducerAction} = \`\${prefix}/${constants.poorReducerAction}\`;\n`;
            break;
    }

    return result;
}

/** Reducer snippet is a line that contains variable name */
function generateReducerInitStateSnippet({ actionInitValue, actionType, valueNames }) {
    let res = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            res = lines([
                `\t${valueNames.value}: ${actionInitValue},`,
                `\t${valueNames.filtersValue}: {`,
                'page: 1,',
                `},`,
                `\t${valueNames.statsValue}: {},`,
                `\t${valueNames.fetchingValue}: false,\n`,
            ]);
            break;

        case ACTION_TYPES.set:
            res += `\t${valueNames.value}: ${actionInitValue},\n`;
            break;    
    }

    return res;
}


/**
 * Reducer's state changer inside switch statement
 */
function generateReducerSnippet({ actionType, constants, valueNames }) {
    let result = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            result = lines([
                `\t\tcase ${constants.fetchSuccess}:`,
                `\t\t\tconst { ${valueNames.value}, ${valueNames.statsValue} } = payload;`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                `\t\t\t\t${valueNames.value}: ${valueNames.value},`,
                `\t\t\t\t${valueNames.statsValue}: ${valueNames.statsValue},`,
                '\t\t\t};',

                `\t\tcase ${constants.setValueFilters}:`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                        `${valueNames.filtersValue}: {`,
                            `...state.${valueNames.filtersValue},`,
                            `...payload,`,
                            `},`,
                        '};',

                `\t\tcase ${constants.setFetching}:`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                `\t\t\t\t${valueNames.fetchingValue}: payload,`,
                '\t\t\t};\n\n'
            ]);
            break;

        case ACTION_TYPES.set:
            result = lines([
                `\t\tcase ${constants.set}:`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                `\t\t\t\t${valueNames.value}: payload`,
                '\t\t\t};\n\n'
            ]);
            break;

        case ACTION_TYPES.poorReducerAction:
            result = lines([
                `\t\tcase ${constants.poorReducerAction}:`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                '\t\t\t};\n\n'
            ]);
            break;
    }

    return result;
}

/**
 * Actions are functions that can be called when you want to change the state
 */
function generateActionSnippet({ actionType, actionName, actionCreators, constants, valueNames }) {
    let res = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            res += lines([
                `export const ${actionCreators.fetch} = () => ({`,
                `\ttype: \t${constants.fetch},`,
                '});\n',

                `export const ${actionCreators.fetchSuccess} = ({${valueNames.value}, ${valueNames.statsValue}}) => ({`,
                `\ttype: \t${constants.fetchSuccess},`,
                `\tpayload: {${valueNames.value}, ${valueNames.statsValue}}`,
                '});\n',

                `/** Provide object with filters field you want to change, if you will not provide some filed, they will not be changed.`,
                ` * If you provide 'null' or 'undefined', then field will be replaced with appropriate value.`,
                ` * Automatically triggers data refreshing(action for fetching).`,
                ` * @param { Object } filters - filters object, can contain any fields you want to override`,
                ` */`,
                `export const ${actionCreators.setValueFilters} = (filters) => {`,
                `return function(dispatch) {`,
                        `dispatch({`,
                            `type: ${constants.setValueFilters},`,
                            `payload: filters`,
                        `});`,
                        `dispatch(${actionCreators.fetch}());`,
                    `}`,
                `};\n\n`,

                `export const ${actionCreators.setFetching} = (value) => ({`,
                `\ttype: \t${constants.setFetching},`,
                '\tpayload: value',
                '});\n\n'
            ]);
            break;

        case ACTION_TYPES.set:
            res += lines([
                `export const ${actionCreators.set} = (value) => ({`,
                `\ttype: \t${constants.set},`,
                '\tpayload: value',
                '});\n'
            ]);
            break;

        case ACTION_TYPES.poorSagaAction:
            res += lines([
                `export const ${actionCreators.poorSagaAction} = () => ({`,
                `\ttype: \t${constants.poorSagaAction},`,
                '});\n'
            ]);
            break;

        case ACTION_TYPES.poorReducerAction:
            res += lines([
                `export const ${actionCreators.poorReducerAction} = () => ({`,
                `\ttype: \t${constants.poorReducerAction},`,
                '});\n'
            ]);
            break;
    }

    return res;
}

/**
 * Module pattern is used here to generate data. This generator is used for creating duck files.
 * 
 * @param { String } moduleName - name of the module you want to create
 * @param { String } actions - actions, will be used to generate duck actions, constants and reducers
 * @param { String } actions.actionName - 
 * @param { String } actions.actionType - 
 */
export default ({moduleName, actions}) => {

    /**
     * @returns Header of a duck file
     */
    function generateHeader() {
        let result = lines([
            `/** ------------------------------------- Constants ------------------------------------- **/`,
            `export const moduleName = '${moduleName}';`,
            `const prefix = \`cpb/\${moduleName}\`;`,
            '',
        ]);
    
        return result;
    }

    /**
     * @param {*} params.actions - actions to generate constants for
     */
    function generateConstants() {
        let result = "";

        _.each(actions, (action) => {
            result+=generateConstant(action);
        });

        return result;
    }

    function generateReducerInitState() {
        let result = lines([
            '/** ------------------------------------- Reducer ------------------------------------- **/',
            'const ReducerState = {\n',
        ]);

        _.each(actions, (action) => {
            result += generateReducerInitStateSnippet(action);
        });
        result+= '};\n';

        return result;
    }

    function generateReducer() {
        let result = lines([
            `export default function reducer(state = ReducerState, action) {`,
            `\tconst { type, payload } = action;`,
            `\tswitch (type) {\n`,
        ]);

        _.each(actions, (action) => {
            result += generateReducerSnippet(action);
        })

        result += lines([
            `\t\tdefault:`,
            `\t\t\treturn state;`,
            `\t}`,
            `}`,
        ]);
    
        return result;
    }

    function generateSelectors() {
        let res = lines([
            `/* ------------------------------------- Selectors ------------------------------------- */\n`,
        ]);

        _.each(actions, ({ actionType, selectors, valueNames }) => {
            switch (actionType) {
                case ACTION_TYPES.fetch:
                    res += lines([
                        `export const ${selectors.value} = state => state[ moduleName ].${valueNames.value};`,
                        `export const ${selectors.statsValue} = state => state[ moduleName ].${valueNames.statsValue};`,
                        `export const ${selectors.filtersValue} = state => state[ moduleName ].${valueNames.filtersValue};`,
                        `export const ${selectors.fetchingValue} = state => state[ moduleName ].${valueNames.fetchingValue};`,
                        `\n`,
                    ]);
                    break;
        
                case ACTION_TYPES.set:
                    res += `export const ${selectors.value} = state => state[ moduleName ].${valueNames.value};\n`;
                    break;    
            }
        });
    
        return res;
    }

    function generateActionCreators() {
        let result = lines([
            `/* ------------------------------------- Action Creators -------------------------- */\n`,
        ]);

        _.each(actions, (action) => {
            result += generateActionSnippet(action);
        });
    
        return result;
    }

    return {
        generateHeader,
        generateConstants,
        generateReducerInitState,
        generateReducer,
        generateSelectors,
        generateActionCreators,
    }
};