import { constantCase, camelCase } from 'change-case'; //For convering different types of variables(camelcase, snake case, etc.)
import _ from 'lodash';

import { ACTION_TYPES } from 'globalConstants';
import { lines } from "utils";

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
        let result = lines([
            `// vendor`,
            `import { call, put, all, take, select } from 'redux-saga/effects';`,
            `import nprogress from 'nprogress';`,
            `import _ from 'lodash';`,
            `import moment from 'moment';`,
            `import { notification } from 'antd';`,
            ``,
            `//proj`,
            `import history from 'store/history';`,
            `import book from 'routes/book';`,
            `import { emitError } from 'core/ui/duck';`,
            `import { fetchAPI } from 'utils';`,
            ``,
            `// own`,
            `import {`,
            ..._.map(fetchActions, ({constants}) => `${constants.fetch},`),
            ``,
            ..._.map(fetchActions, ({constants}) => `${constants.fetchSuccess},`),
            ``,
            ..._.map(poorSagaActions, ({constants}) => `${constants.poorSagaAction},`),
            ``,
            ..._.map(setActions, ({constants}) => `\t${constants.set},`),
            ``,
            ``,
            ..._.map(fetchActions, ({selectors}) => `${selectors.filtersValue},`),
            ``,
            ..._.map(fetchActions, ({actionCreators}) => `${actionCreators.setFetching},`),
            ..._.map(fetchActions, ({actionCreators}) => `${actionCreators.fetchSuccess},`),
            `} from './duck';`,
            `\n`,
        ]);
        return result;
    }

    function generateSagas() {
        let result = _.map(actions, ({actionType, propertyName, selectors, constants, actionCreators, actionFetchURL, sagas}) => {

            switch (actionType) {
                case ACTION_TYPES.fetch:
                    return lines([
                        `export function* ${sagas.sagaName}() {`,
                        `\twhile (true) {`,
                        `\t\ttry {`,
                        `\t\t\tyield take(${constants.fetch});`,
                        ``,
                            `yield put(${actionCreators.setFetching}(true));`,
                            `const filters = yield select(${selectors.filtersValue});`,
                        ``,
                        `\t\t\tconst {${propertyName}, stats} = yield call(fetchAPI, 'GET', \`${actionFetchURL? actionFetchURL: ""}\`, { filters });`,
                        ``,
                        `\t\t\tyield put(${actionCreators.fetchSuccess}({${propertyName}, stats}));`,
                        `\t\t} catch (error) {`,
                        `\t\t\tyield put(emitError(error));`,
                        `\t\t} finally {`,
                        `\t\t\tyield put(${actionCreators.setFetching}(false));`,
                        `\t\t}`,
                        `\t}`,
                        `}`,
                        `\n`
                    ]);
                case ACTION_TYPES.poorSagaAction:
                    return lines([
                        `export function* ${sagas.sagaName}() {`,
                        `\twhile (true) {`,
                        `\t\ttry {`,
                        `\t\t\tyield take(${constants.poorSagaAction});`,
                        `\t\t} catch (error) {`,
                        `\t\t\tyield put(emitError(error));`,
                        `\t\t}`,
                        `\t}`,
                        `}\n`,
                    ]);
            }
            
        }).join("");

        return result;
    }

    function generateCommonSaga() {
        let result = lines([
            `export function* saga() {`,
            `\tyield all([`,

            ..._.map(actions, ({actionType, sagas}) => {
                switch (actionType) {
                    case ACTION_TYPES.fetch:
                    case ACTION_TYPES.poorSagaAction:
                        return `\t\tcall(${sagas.sagaName}),`;
                }
                
            }),

            `\t]);`,
            `}`,
        ]);

        return result;
    }

    return {
        generateImports,
        generateSagas,
        generateCommonSaga,
    }
};