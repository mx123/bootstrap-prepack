
import React, { Component, PropTypes } from 'react';

import '../assets/css/bootstrap.css';
import '../assets/css/font-awesome.css';
import '../assets/css/app.css';
import '../assets/js/bootstrap.js';

import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';
import SmartPanel from '../containers/Demo/SmartPanel.jsx';
import FetchSmartButton from '../containers/Demo/FetchSmartButton.jsx';


class HomePage extends Component {

    render() {
        return (
            <div>
                <p style={ {    marginTop: '2em'} }
                   className="text-center"
                   params={ this.props.params }>
                    <span params={ this.props.params }>Click on the button below to fetch data from the server, if you see an Error, please check if you have started local server from the root folder of current project: node ./server.js</span>
                </p>
                <div style={ {    width: '90%',    margin: '0 5% 0 5%'} } params={ this.props.params }>
                    <div style={ {    width: '100%'} } params={ this.props.params }>
                        <div style={ {    display: 'table',    width: '100%'} } params={ this.props.params }>
                            <div style={ {    display: 'table-row'} } params={ this.props.params }>
                                <div style={ {    display: 'table-cell',    textAlign: 'center'} } params={ this.props.params }>
                                    <FetchSmartButton bsStyle="warning" params={ this.props.params }></FetchSmartButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Grid fluid={ true }
                      style={ {    marginTop: '2em'} }
                      params={ this.props.params }>
                    <Row style={ {    padding: 0} } params={ this.props.params }>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header="Panel with header"
                                   bsStyle="danger"
                                   params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header="Panel with header"
                                   bsStyle="primary"
                                   params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header="Panel with header"
                                   bsStyle="success"
                                   params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                    </Row>
                    <Row style={ {    padding: 0} } params={ this.props.params }>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header="Panel with header"
                                   bsStyle="info"
                                   params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header="Panel with header"
                                   bsStyle="warning"
                                   params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                        <Col xs={ 12 }
                             md={ 4 }
                             sm={ 4 }
                             lg={ 4 }
                             style={ {    margin: 0,    padding: 10} }
                             params={ this.props.params }>
                            <Panel header={ <h3 params={ this.props.params }><span params={ this.props.params }>Empty h3</span></h3> } params={ this.props.params }>
                                <SmartPanel style={ {    textAlign: 'center'} } params={ this.props.params }></SmartPanel>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
            );
    }
}

export default HomePage;

