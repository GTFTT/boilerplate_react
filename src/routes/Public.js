// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import {
    FrontendBoilerplateGeneratorPage
 } from 'pages';

import book from './book';

/**
 * All those components will be available by users without authentication
 */
export default class Public extends Component {
    render() {
        return (
            <Switch>
                {/* <Route exact component={ LoginPage } path={ book.login } /> */}
                {/* <Route
                    exact
                    component={ FrontendBoilerplateGeneratorPage }
                    path={ book.frontendBoilerplateGenerator }
                /> */}
                <Route
                    exact
                    render={ props => <FrontendBoilerplateGeneratorPage { ...props } /> }
                    path={ book.frontendBoilerplateGenerator }
                />
                {/* <Redirect to={ book.login } /> */}
            </Switch>
        );
    }
}
