/** Constants **/

export const moduleName = 'vehiclesPage';
const prefix = `cpb/${moduleName}`;

export const SET_MODULE_NAME = `${prefix}/SET_MODULE_NAME`;
export const SET_MODULE_DESCRIPTION = `${prefix}/SET_MODULE_DESCRIPTION`;

/** Reducer **/
const ReducerState = {
    moduleName: undefined,
    moduleDescription: undefined,
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

        default: return state;
    }
}

/** Selectors **/

export const selectModuleName = state => state[ moduleName ].moduleName;
export const selectModuleDescription = state => state[ moduleName ].moduleDescription;

/** Action Creators **/

export const setModuleName = (value) => ({
	type: 	SET_MODULE_NAME,
	payload: value
});

export const setModuleDescription = (value) => ({
	type: 	SET_MODULE_DESCRIPTION,
	payload: value
});
