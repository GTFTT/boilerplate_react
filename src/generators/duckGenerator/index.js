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

function generateConstant({ actionType, actionName }) {
    const actionToBeInserted = constantCase(String(`${actionType} ${actionName}`));
    let result = `export const ${actionToBeInserted} = \`\${prefix}/${actionToBeInserted}\`;\n`;

    if(actionType == ACTION_TYPES.fetch) {
        result +=`export const ${actionToBeInserted}_SUCCESS = \`\${prefix}/${actionToBeInserted}_SUCCESS\`;\n`;
    }

    return result;
}

/** Reducer snippet is on line that contains variable name */
function generateReducerInitStateSnippet({ actionName }) {
    const actionToBeInserted = camelCase(String(actionName));
    return `${actionToBeInserted},\n`;
}


/**
 * Reducer's state changer inside swith statement
 */
function generateReducerSnippet({ actionType, actionName }) {
    const actionConstant = constantCase(String(`${actionType} ${actionName}`));
    const actionVariable = camelCase(String(actionName));
    let result = lines([
        `\t\tcase ${actionConstant}:`,
        (actionType == ACTION_TYPES.fetch) ? `\t\t\tconst { ${actionVariable} } = payload;`: undefined,
        '\t\t\treturn {',
        '\t\t\t\t...state, ',
        `\t\t\t\t${actionVariable}: ${(actionType == ACTION_TYPES.fetch) ? `${actionVariable},`: `payload,`}`,
        '\t\t\t};'
    ]);

    result += '\n';

    return result;
}

/**
 * Actions are functions that can be called when you want to change the state
 */
function generateActionSnippet({ actionType, actionName }) {
    const actionConstant = constantCase(String(`${actionType} ${actionName}`));
    const functionName = camelCase(String(`${actionType} ${actionName}`));

    let result = lines([
        `export const ${functionName} = () => ({`,
        `\ttype: \t${actionConstant},`,
        '});\n\n'
    ]);

    if(actionType == ACTION_TYPES.fetch) {
        result += lines([
            '',
            `export const ${functionName}Success = () => ({`,
            `\ttype: \t${actionConstant}_SUCCESS,`,
            '});\n\n'
        ]);
    }

    return result;
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
     * Generate header of a duck file
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
     * @returns 
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
            result+='\t' + generateReducerInitStateSnippet(action);
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
        let result = lines([
            `/* ------------------------------------- Selectors ------------------------------------- */\n`,
        ]);

        _.each(actions, ({ actionType, actionName }) => {
            result += `export const ${camelCase(`select ${actionName}`)} = state => state[ moduleName ].${camelCase(actionName)};\n`;
        });
    
        return result;
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