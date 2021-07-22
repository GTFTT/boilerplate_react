//proj
import { COMPONENT_TYPES, TYPES_OF_FILES } from 'globalConstants';

/** Constants **/

export const moduleName = 'vehiclesPage';
const prefix = `cpb/${moduleName}`;

export const SET_MODULE_NAME = `${prefix}/SET_MODULE_NAME`;
export const SET_MODULE_DESCRIPTION = `${prefix}/SET_MODULE_DESCRIPTION`;
export const SET_GENERATION_COMPONENT_TYPE = `${prefix}/SET_GENERATION_COMPONENT_TYPE`;

/** Reducer **/
const ReducerState = {
    moduleName: undefined,
    moduleDescription: undefined,
    generationComponentType: COMPONENT_TYPES.poorPage,
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

        default: return state;
    }
}

/** Selectors **/

export const selectModuleName = state => state[ moduleName ].moduleName;
export const selectModuleDescription = state => state[ moduleName ].moduleDescription;
export const selectGenerationComponentType = state => state[ moduleName ].generationComponentType;

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