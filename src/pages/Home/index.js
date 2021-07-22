//vendor
import React from 'react';
import _ from 'lodash';

//own
import "./styles.css";

/**
 * Home page, contains basic information about the project.
 */
export default class Home extends React.Component {
    render() {

        return (
            <div>
                <p>
                    This project is supposed to reduce boilerplate by providing tool for auto generating code patterns.
                    This program can generate redux files for now.
                </p>
                <p>
                    To navigate hover black box on the top left corner.
                </p>
            </div>
        );
    }
}