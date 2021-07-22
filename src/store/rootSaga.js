// vendor
import { all } from 'redux-saga/effects';

//own

import { saga as frontendBoilerplateGeneratorPage } from 'pages/FrontendBoilerplateGeneratorPage/redux/saga';

export default function* rootSaga() {
    yield all([
        frontendBoilerplateGeneratorPage(),
    ]);
}