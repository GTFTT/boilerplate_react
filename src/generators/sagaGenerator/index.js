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
    const poorSagaActions = _.filter(actions, (obj) => obj.actionType == ACTION_TYPES.poorSagaAction)
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
    ${_.map(fetchActions, ({constants}) => constants.fetch).join(",\n\t")}
    ${_.map(poorSagaActions, ({constants}) => constants.poorSagaAction).join(",\n\t")}

    ${_.map(fetchActions, ({actionCreators}) => actionCreators.fetchSuccess).join(",\n\t")}

    ${_.map(setActions, ({actionCreators}) => actionCreators.set).join(",\n\t")}
} from './duck';
        `
        return result;
    }

    function generateSagas() {
        let result = _.map(actions, ({actionType, propertyName, constants, actionCreators, actionFetchURL, sagas}) => {

            switch (actionType) {
                case ACTION_TYPES.fetch:
                    return `
export function* ${sagas.sagaName}() {
    while (true) {
        try {
            yield take(${constants.fetch});

            yield put(${actionCreators.setFetching}(true));

            const ${propertyName} = yield call(fetchAPI, 'GET', \`${actionFetchURL? actionFetchURL: ""}\`);

            yield put(${actionCreators.fetchSuccess}({${propertyName}}));

        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(${actionCreators.setFetching}(false));
        }
    }
}\n
                    `
                case ACTION_TYPES.poorSagaAction:
                    return `
export function* ${sagas.sagaName}() {
    while (true) {
        try {
            yield take(${constants.poorSagaAction});
        } catch (error) {
            yield put(emitError(error));
        }
    }
}\n
                    `
            }
            
        })
        return result;
    }

    function generateCommonSaga() {
        let result = 

        `
export function* saga() {
    yield all([
        ${
            _.map(actions, ({actionType, sagas}) => {
                switch (actionType) {
                    case ACTION_TYPES.fetch:
                    case ACTION_TYPES.poorSagaAction:
                        return `call(${sagas.sagaName}),\n\t`;
                }
                
            })
        }
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