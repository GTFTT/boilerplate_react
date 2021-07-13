import { constantCase, camelCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

import { ACTION_TYPES } from 'globalConstants';

/**
 * Geerate lines with new line at the end of each piece of text
 * @param {*} text - array of strings
 */
function lines(text) {
    return _.compact(text).join("\n");
}

function generateConstant({ actionType, constants }) {
    let result = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            result +=`export const ${constants.fetch} = \`\${prefix}/${constants.fetch}\`;\n`;
            result +=`export const ${constants.fetchSuccess} = \`\${prefix}/${constants.fetchSuccess}\`;\n`;
            result +=`export const ${constants.setFetching} = \`\${prefix}/${constants.setFetching}\`;\n\n`;
            break;

        case ACTION_TYPES.set:
            result +=`export const ${constants.set} = \`\${prefix}/${constants.set}\`;\n`;
            break;
    }

    return result;
}

/** Reducer snippet is a line that contains variable name */
function generateReducerInitStateSnippet({ actionName, actionType, valueNames }) {
    let res = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            res += `\t${valueNames.value},\n`;
            res += `\t${valueNames.fetchingValue},\n\n`;
            break;

        case ACTION_TYPES.set:
            res += `\t${valueNames.value},\n`;
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
                `\t\t\tconst { ${valueNames.value} } = payload;`,
                '\t\t\treturn {',
                '\t\t\t\t...state, ',
                `\t\t\t\t${valueNames.value}: ${valueNames.value},`,
                '\t\t\t};',
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
    }

    return result;
}

/**
 * Actions are functions that can be called when you want to change the state
 */
function generateActionSnippet({ actionType, actionName, actionCreators, constants, valueNames }) {
    const actionConstant = constantCase(String(`${actionType} ${actionName}`));
    const functionName = camelCase(String(`${actionType} ${actionName}`));

    let res = "";

    switch (actionType) {
        case ACTION_TYPES.fetch:
            res += lines([
                `export const ${actionCreators.fetch} = () => ({`,
                `\ttype: \t${constants.fetch},`,
                '});\n',
                `export const ${actionCreators.fetchSuccess} = ({${valueNames.value}}) => ({`,
                `\ttype: \t${constants.fetchSuccess},`,
                `\tpayload: {${valueNames.value}}`,
                '});\n',
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
    }

    return res;
}

/**
 * Module pattern is used here to generate data;
 * 
 * @param { String } moduleName - name of the module you wnat to create
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

        _.each(actions, ({ actionType, actionName, selectors, valueNames }) => {
            switch (actionType) {
                case ACTION_TYPES.fetch:
                    res += `export const ${selectors.value} = state => state[ moduleName ].${valueNames.value};\n`;
                    res += `export const ${selectors.fetchingValue} = state => state[ moduleName ].${valueNames.fetchingValue};\n\n`;
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