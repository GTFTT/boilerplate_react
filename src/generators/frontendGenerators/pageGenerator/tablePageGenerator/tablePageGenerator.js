//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';


export default ({pageName, pageTableName, moduleDescription, actions, dataSourceAction, translations}) => {

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
            `import { permissions, isForbidden } from "utils";`,
            `import { setModal, selectModalProps, setModal, resetModal, MODALS } from 'core/modals/duck';`,
            ``,
            `//own`,
            `import Styles from './styles.m.css';`,
            `import { ${pageTableName} } from './components/tables';`,
            `import {`,

            //Print each action separately
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({actionCreators}) => `${actionCreators.set},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({actionCreators, selectors}) => lines([
                    `${actionCreators.fetch},`,
                    `${selectors.value},`,
                    `${selectors.fetchingValue},`,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorSagaAction),
                ({actionCreators}) => `${actionCreators.poorSagaAction},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorReducerAction),
                ({actionCreators}) => `${actionCreators.poorReducerAction},`
            ),
            `} from 'pages/${pageName}/redux/duck';`,
            `\n`
        ]);

        return res;
    }

    const generateMapStateToProps = () => {
        let res = lines([
            `const mapStateToProps = state => ({`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({valueNames, selectors}) => lines([
                    `${valueNames.value}: ${selectors.value}(state),`,
                    `${valueNames.fetchingValue}: ${selectors.fetchingValue}(state),`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({valueNames, selectors}) => `${valueNames.value}: ${selectors.value}(state),`
            ), 
            `});`,
        ]);

        return res;
    }

    const generateMapDispatchToProps = () => {
        let res = lines([
            `const mapDispatchToProps = ({`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({ actionCreators}) => lines([
                    `${actionCreators.fetch},`,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({ actionCreators}) => `${actionCreators.set},`
            ), 
            `});`,
        ]);

        return res;
    }

    const generateClass = () => {
        const titleTranslation = _.get(_.filter(translations, 'isPageTitle'), '[0]');

        let res = lines([
            `/**`,
            ...(
                moduleDescription
                    ? _.map(moduleDescription.split('\n'), (str) => ` * ${str}`)
                    : []
            ),
            ` */`,
            `@injectIntl`,
            `@connect(mapStateToProps, mapDispatchToProps)`,
            `export default class ${pageName} extends Component {`,
                `constructor(props) {`,
                    `super(props);`,
                    ``,
                    `this.props.${_.get(dataSourceAction, 'actionCreators.fetch')}();`,
                `}`,
                ``,
                `render() {`,
                    ``,
                    `return (`,
                        `<div>`,
                            `<Layout`,
                                `title={ ${_.get(titleTranslation, 'formattedMessage')} }`,
                            `>`,
                                `<div>`,
                                    `<${pageTableName} />`,
                                `</div>`,
                            `</Layout>`,
                        `</div>`,
                    `)`,
                `}`,
            `}`,
        ]);

        return res;
    }

    return {
        generateImports,
        generateMapStateToProps,
        generateMapDispatchToProps,
        generateClass,
    };
}