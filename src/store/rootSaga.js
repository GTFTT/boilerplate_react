// vendor
import { all } from 'redux-saga/effects';

//own

import { saga as duckGeneratorPage } from 'DuckGeneratorPage/redux/saga';

export default function* rootSaga() {
    yield all([
        duckGeneratorPage(),
    ]);
}