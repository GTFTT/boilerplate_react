import { constantCase, camelCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

import { ACTION_TYPES } from 'globalConstants';

/**
 * Module pattern is used here to generate data;
 * 
 * @param { String } moduleName - name of the module you wnat to create
 * @param { String } actions - actions, will be used to generate duck actions, constants and reducers
 * @param { String } actions.actionName - 
 * @param { String } actions.actionType - 
 */
export default ({moduleName, actions}) => {

    const fetchActions = _.filter(actions, (obj) => obj.actionType == ACTION_TYPES.fetch)
    const setActions = _.filter(actions, (obj) => obj.actionType == ACTION_TYPES.set)

    function generateImports() {
        let result = 
        `
// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';
import moment from 'moment';
import { notification } from 'antd';
import history from 'store/history';

//proj
import book from 'routes/book';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    ${_.map(fetchActions, ({actionName, actionType}) => constantCase(`${actionType} ${actionName}`)).join(",\n")}

    ${_.map(fetchActions, ({actionName, actionType}) => camelCase(`${actionType} ${actionName} success`)).join(",\n")}

    ${_.map(setActions, ({actionName, actionType}) => camelCase(`${actionType} ${actionName}`)).join(",\n")}
} from './duck';
        `
        return result;
    }

    function generateSagas() {
        let result = _.map(fetchActions, ({actionName, actionType, actionFetchURL}) => {
            return `
export function* ${camelCase(`${actionType} ${actionName} saga`)}() {
    while (true) {
        try {
            yield take(${constantCase(`${actionType} ${actionName}`)});

            yield put(${camelCase(`set fetching ${actionName}`)}(true));

            const ${camelCase(`${actionName}`)} = yield call(fetchAPI, 'GET', \`${actionFetchURL? actionFetchURL: ""}\`);

            yield put(${camelCase(`${actionType} ${actionName} success`)}({${camelCase(`${actionName}`)}}));

        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(${camelCase(`set fetching ${actionName}`)}(false));
        }
    }
}\n
            `
        })
        return result;
    }

    function generateCommonSaga() {
        let result = 

        `
export function* saga() {
    yield all([
        ${_.map(fetchActions, ({actionName, actionType, actionFetchURL}) => `call(${camelCase(`${actionType} ${actionName} saga`)}),\n`)}
    ]);
}
        `
        return result;
    }

    return {
        generateImports,
        generateSagas,
        generateCommonSaga,
    }
};