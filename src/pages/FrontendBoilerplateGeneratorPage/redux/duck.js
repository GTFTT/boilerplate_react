//proj
import { COMPONENT_TYPES, TYPES_OF_FILES } from 'globalConstants';

/** Constants **/

export const moduleName = 'frontendBoilerplateGeneratorPage';
const prefix = `cpb/${moduleName}`;

export const SET_MODULE_NAME = `${prefix}/SET_MODULE_NAME`;
export const SET_MODULE_DESCRIPTION = `${prefix}/SET_MODULE_DESCRIPTION`;
export const SET_GENERATION_COMPONENT_TYPE = `${prefix}/SET_GENERATION_COMPONENT_TYPE`;

export const SET_ACTIONS = `${prefix}/SET_ACTIONS`;
export const SET_TRANSLATIONS = `${prefix}/SET_TRANSLATIONS`;
export const SET_TABLE_CONFIGS = `${prefix}/SET_TABLE_CONFIGS`;

/** Reducer **/
const ReducerState = {
    moduleName: "test",
    moduleDescription: undefined,
    generationComponentType: COMPONENT_TYPES.poorPage,
    actions: [],
    translations: [],
    tableConfigs: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_MODULE_NAME:
            return {
                ...state,
                moduleName: payload
            };

        case SET_MODULE_DESCRIPTION:
            return {
                ...state,
                moduleDescription: payload
            };

        case SET_GENERATION_COMPONENT_TYPE:
            return {
                ...state, 
                generationComponentType: payload
            };

        case SET_ACTIONS:
			return {
				...state, 
				actions: payload
			};

        case SET_TRANSLATIONS:
            return {
                ...state, 
                translations: payload
            };
        
        case SET_TABLE_CONFIGS:
			return {
				...state, 
				tableConfigs: payload
			};

        default: return state;
    }
}

/** Selectors **/

export const selectModuleName = state => state[ moduleName ].moduleName;
export const selectModuleDescription = state => state[ moduleName ].moduleDescription;
export const selectGenerationComponentType = state => state[ moduleName ].generationComponentType;

export const selectActions = state => state[ moduleName ].actions;
export const selectTranslations = state => state[ moduleName ].translations;
export const selectTableConfigs = state => state[ moduleName ].tableConfigs;

/** Action Creators **/

export const setModuleName = (value) => ({
	type: 	SET_MODULE_NAME,
	payload: value
});

export const setModuleDescription = (value) => ({
	type: 	SET_MODULE_DESCRIPTION,
	payload: value
});

export const setGenerationComponentType = (value) => ({
	type: 	SET_GENERATION_COMPONENT_TYPE,
	payload: value
});

export const setActions = (value) => ({
	type: 	SET_ACTIONS,
	payload: value
});

export const setTranslations = (value) => ({
	type: 	SET_TRANSLATIONS,
	payload: value
});

export const setTableConfigs = (value) => ({
	type: 	SET_TABLE_CONFIGS,
	payload: value
});