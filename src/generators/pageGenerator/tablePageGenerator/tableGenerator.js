//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';


export default ({pageTableName, moduleDescription, actions}) => {

    const generateImports = () => {
        let res = "";

        res+= lines([
            `// vendor`,
            `import React, {Component} from 'react';`,
            `import {FormattedMessage, injectIntl } from 'react-intl';`,
            `import { connect } from 'react-redux';`,
            `import { Tabs, Icon, Col, Row, Input, Select, Button, Table } from 'antd';`,
            `import _ from 'lodash';`,
            `import { fetchAPI } from 'utils';`,
            `import { v4 } from 'uuid';`,
            ``,
            `// proj`,
            `import { Layout, StyledButton } from 'commons';`,
            `import { setModal, MODALS } from 'core/modals/duck';`,
            ``,
            `//own`,
            `import { columnsConfig } from './config';`,
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
            `export default class ${pageTableName} extends Component {`,
            `\tconstructor(props) {`,
            `\t\tsuper(props);`,
            `\t}`,
            ``,
            `\trender() {`,
            `\t\tconst {`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({ valueNames }) => lines([
                    `\t\t\t${valueNames.value},`,
                    `\t\t\t${valueNames.fetchingValue},`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({ valueNames }) => `\t\t\t${valueNames.value},`
            ),
            `\t\t} = this.props;`,
            ``,
            `\t\treturn (`,
            `\t\t\t<div className={Styles.tableContainer}>`,
            `\t\t\t\t<${pageTableName}`,
            `\t\t\t\t\tclassName={Styles.table}`,
            `\t\t\t\t\tdataSource={ inspectionIntervals }`,
            `\t\t\t\t\tcolumns={columnsConfig()}`,
            `\t\t\t\t\tpagination={pagination}`,
            `\t\t\t\t\tloading={fetchingVehicleInspectionIntervals}`,
            `\t\t\t\t\trowKey={() => v4()}`,
            `\t\t\t\t\tbordered`,
            `\t\t\t\t/>`,
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