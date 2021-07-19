/**
 * Different types of actions require different processing, for example we have to have at
 * least two duck actions created for "fetch" type - FETCH_SOMETHING and FETCH_SOMETHING_SUCCESS
 */
const ACTION_TYPES = Object.freeze({
    fetch: "fetch",
    set: "set",
    poorSagaAction: "poorSagaAction",
    poorReducerAction: "poorReducerAction",
});

/**
 * Sometimes you have to specify default init values, those are strings.
 * Each of them represent real JS value which often used as default initializing value.
 */
const DEF_INIT_VALUES = Object.freeze({
    undefinedValue: 'undefined',
    nullValue: 'null',
    emptyString: `\"\"`,
    zero: '0',
    emptyObject: '{}',
    emptyArray: '[]',
});

/**
 * There are different types of components to generate. We can generate table, modal or something else.
 */
const COMPONENT_TYPES = Object.freeze({
    poorPage: "poorPage",
    tablePage: "tablePage",
    modal: "modal",
});

const TYPES_OF_FILES = Object.freeze({
    file: 'file',
    directory: 'directory',
});

module.exports = {
    ACTION_TYPES,
    DEF_INIT_VALUES,
    COMPONENT_TYPES,
    TYPES_OF_FILES
};