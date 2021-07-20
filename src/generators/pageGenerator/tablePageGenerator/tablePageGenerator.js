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
            `import ${pageTableName} from './components/tables';`,
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

    const generateMapStateToProps = () => {
        let res = lines([
            `const mapStateToProps = state => ({`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({valueNames, selectors}) => lines([
                    `\t${valueNames.value}: ${selectors.value}(state),`,
                    `\t${valueNames.fetchingValue}: ${selectors.fetchingValue}(state),`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({valueNames, selectors}) => `\t${valueNames.value}: ${selectors.value}(state),`
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
                    `\t${actionCreators.fetch},`,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({ actionCreators}) => `\t${actionCreators.set},`
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
            `\tconstructor(props) {`,
            `\t\tsuper(props);`,
            `\t}`,
            ``,
            `\trender() {`,
            `\t\tconst {`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({valueNames, selectors}) => lines([
                    `\t\t\t${valueNames.value},`,
                    `\t\t\t${valueNames.fetchingValue},`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({valueNames, selectors}) => `\t\t\t${valueNames.value},`
            ),
            `\t\t} = this.props;`,
            ``,
            `\t\treturn (`,
            `\t\t\t<div>`,
            `\t\t\t\t<Layout`,
            `\t\t\t\t\ttitle={ <FormattedMessage id={ 'generate.generate' } /> }`,
            `\t\t\t\t\tcontrols={}`,
            `\t\t\t\t>`,
            `\t\t\t\t\t<div>`,
            `\t\t\t\t\t\t<${pageTableName} />`,
            `\t\t\t\t\t</div>`,
            `\t\t\t\t</Layout>`,
            `\t\t\t</div>`,
            `\t\t)`,
            `\t}`,
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