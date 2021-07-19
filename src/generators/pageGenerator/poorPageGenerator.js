//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';


export default ({pageName, moduleDescription, actions}) => {

    const generateImports = () => {
        let res = "";

        res+= lines([
            `// vendor`,
            `import React, {Component} from 'react';`,
            `import {FormattedMessage, injectIntl } from 'react-intl';`,
            `import { connect } from 'react-redux';`,
            `import { Tabs, Icon, Col, Row, Input, Select, Button } from 'antd';`,
            `import _ from 'lodash';`,
            `import { fetchAPI } from 'utils';`,
            ``,
            `// proj`,
            `import { Layout, StyledButton } from 'commons';`,
            `import { setModal, MODALS } from 'core/modals/duck';`,
            ``,
            `//own`,
            `import Styles from './styles.m.css';`,
            `import {`,

            //Print each action separately
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({actionCreators}) => `\t${actionCreators.set},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({actionCreators}) => `\t${actionCreators.fetch},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorSagaAction),
                ({actionCreators}) => `\t${actionCreators.poorSagaAction},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorReducerAction),
                ({actionCreators}) => `\t${actionCreators.poorReducerAction},`
            ),
            `};`,
            `\n`
        ]);

        return res;
    }

    return {
        generateImports,
    };
}