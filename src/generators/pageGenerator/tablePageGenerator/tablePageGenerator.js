//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';


export default ({pageName, pageTableName, moduleDescription, actions}) => {

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
                ({actionCreators}) => `${actionCreators.fetch},`
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
            `const mapDispatchToProps = state => ({`,
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
            `}`,
            ``,
            `render() {`,
            `const {`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({valueNames, selectors}) => lines([
                    `${valueNames.value},`,
                    `${valueNames.fetchingValue},`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({valueNames, selectors}) => `${valueNames.value},`
            ),
            `} = this.props;`,
            ``,
            `return (`,
            `<div>`,
            `<Layout`,
            `title={ <FormattedMessage id={ 'generate.generate' } /> }`,
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