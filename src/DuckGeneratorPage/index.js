//vendor
import React from 'react';
import { Collapse, Input, Button, notification } from 'antd';
import _ from 'lodash';
import ReactJson from 'react-json-view'

//proj
import generators from "generators";
import { downloadTxtFile } from '../utils';

//own
import InputArray from './InputArray';
import "./styles.css";

const Panel = Collapse.Panel;

export default class DuckGeneratorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moduleName: undefined,
            actions: [],
        };
    }

    onGenerateFiles = () => {
        const {moduleName, actions} = this.state;

        if(!moduleName || _.isEmpty(actions)) {
            notification.error({message: "Not enough information provided!"});
            return;
        }

        const { generateDuckFile, generateSagaFile } = generators({actions, moduleName});
        
        downloadTxtFile(generateDuckFile(), "duck.txt");
        downloadTxtFile(generateSagaFile(), "saga.txt");

        notification.info({
            message: (
                <div>
                    <div>{`Module: ${moduleName}`}</div>
                    <div>
                        <ReactJson src={actions} />
                    </div>
                </div>
            )
        });
    }

    render() {

        const { actions } = this.state;

        return (
            <div>
                <Collapse defaultActiveKey={['1', '2']}>
                    <Panel header="Enter module name" key="1">
                        <Input
                            placeholder="Module name"
                            onChange={(e) => this.setState({moduleName: e.target.value})}
                        />
                    </Panel>
                    <Panel header="Create actions" key="2">
                        <InputArray
                            actionsChanged={(actions) => {
                                this.setState({ actions });
                            }}
                        />
                    </Panel>
                </Collapse>

                <Button className="generateButton" onClick={() => this.onGenerateFiles()}>Generate file</Button>

                <div className="jsonContainer">
                    <ReactJson
                        name={false}
                        collapsed={false}
                        displayObjectSize={false}
                        displayDataTypes={false}
                        collapseStringsAfterLength={true}
                        style={{fontSize: '0.5em', justifyContent: 'flex-start'}} src={actions} />
                </div>
            </div>
        );
    }
}