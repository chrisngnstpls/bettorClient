
import React, {Component} from 'react'
import {Modal, Header, Button, Icon, Table, Form, Input, Label, Segment, TableBody, TableCell, TableRow, Menu} from 'semantic-ui-react'
import Bet from '../contracts/Bet.json'
import getWeb3 from '../ethereum/web3'
import Web3 from 'web3'
import './Modal.css'

// import PropTypes from 'prop-types'

class BetModal extends Component {
    
    constructor(props){
        super(props)
        // console.log('props inside bet modal', props)
        
        this.state = {
            gas:props.gas,
            betWinner:'',
            betInstance:null,
            betStatus:null,
            syncedAddress:props.myAddress,
            web3:props.web3,
            contractLocation:props.contractLocation,
            contractBalance:0,
            betStatus:null,
            betReason:''
        }
    }
    

    convertEth = async(_value) => {
        let finalValue = Web3.utils.fromWei(_value, 'ether');
        return await finalValue;
    }

    componentDidMount = async() => {
        const _betInstance = await new this.state.web3.eth.Contract(
            Bet.abi, this.state.contractLocation
        )
        let _contractBalance = await _betInstance.methods.getBalance().call({gas:this.state.gas})
        let _betStatus = await _betInstance.methods.getBetStatus().call({gas:this.state.gas})
        let _betReason = await _betInstance.methods.reason().call({gas:this.state.gas})
        let finalValue = Web3.utils.fromWei(_contractBalance, 'ether')
        this.setState({ betInstance:_betInstance, contractBalance:finalValue, betReason:_betReason,})
        this.getBetStatus()
    }

    confirmClick = (event, data) => {
        //console.log('state values : ' + this.state.betWinner)
        this.props.handleClose();
    }
    resolveBet = (event, data) => {
        console.log(this.state.myaddress)
        
    }

    acceptBet = async (event, data) => {
        try{
            //console.log(this.props)
            await this.state.betInstance.methods.acceptBet().send({from:this.props.syncedAddress[0], gas:this.state.gas, value:this.state.contractBalance})
            .on('transactionHash', (hash) => {
                console.log('transaction hash : ', hash)

            })
            .on('error', (err) => {
                console.log('error : ',err )
            })
        } catch(err){
            alert(await err.message)

        }

    }

    agreedCancel = async(event, data) => {
        try{
            //console.log(this.state.gas)
            await this.state.betInstance.methods.agreedCancel().call({from:this.props.syncedAddress[0], gas:this.state.gas})
            .then((result) => {
                console.log(result)
            })
        } catch(err){
            alert(await err.message)
        }

    }

    revertBet = async(event,data) => {
        try{
            await this.state.betInstance.methods.revertBet().call({gas:this.state.gas})
        } catch(err){
            alert(await err.message)
        }

    }

    getContractBalance = async(event, data) => {
        try{
            const _contractBalance = await this.state.betInstance.methods.getBalance().call({gas:this.state.gas}) 
            const final = Web3.utils.fromWei(_contractBalance, 'ether')
            this.setState({contractBalance:final})
        } catch(err){
            alert(await err.message)
        }

        
    }
    
    getBetStatus = async(event, data) => {

        try{
            let status;
            const _betStatus = await this.state.betInstance.methods.getBetStatus().call({gas:this.state.gas})
            
            if (_betStatus == 0){
                status = 'Initiated'
            } else if (_betStatus == 1){
                status = 'Running'
            } else if (_betStatus == 2){
                status = 'Resolved'
            }
            this.setState({betStatus:status})
        } catch(err){
            console.log(err)
            alert(await err.message)
        }


    }

    keyMasterSign = async(event, data) =>{
        const _add = await this.state.myaddress
        console.log(_add)
    }

    render() {
        const {Cell, Row} = Table

        return (
            <Modal
                open={this.props.modalOpen}
                size='small'
                closeOnEscape={false}
                id='wholeModal'
            >
            <Segment>
                <Segment.Group style={{padding:'10px'}} raised>                
                <Header id='modalHeader' as={'h3'} conent={'confirm?'}>Bet : {this.state.contractLocation}</Header>
                </Segment.Group>
            </Segment>
            
                <Modal.Content>
                <Segment raised>
                    <Segment.Group> 
                        <Menu secondary>
                            <Menu.Item position='left'>
                                <Modal.Header as={'h3'} id='modalReason'> Reason: {this.state.betReason}</Modal.Header>
                            </Menu.Item>
                            <Menu.Item position='right' as={'h4'}>
                                <img alt='logo' src="./logo192.png"/>
                            </Menu.Item>
                        </Menu>
                    </Segment.Group>
                </Segment>
                    <Segment raised>
                        <Segment.Group>
                            <Table celled columns={4}>
                                <Table.Body style={{overflow:'auto'}}>
                                    <Table.Row  mobile={16} tablet={8} computer={5} textAlign='center'>
                                        <Table.Cell><Button color='green' onClick={this.acceptBet}>Accept Bet</Button></Table.Cell>
                                        <Table.Cell><Button color = 'yellow' onClick={this.agreedCancel}>Aggreed Cancel</Button></Table.Cell>
                                        
                                        <Table.Cell>                                    
                                        <Form onSubmit={this.resolveBet}> 
                                        <Segment >
                                        <Header id='winnerHeader' as={'h4'}>Bet Winner</Header>                 
                                            <Form.Group widths="equal"> 
                                                <Form.Field
                                                    id="form-input-control-betWinner"
                                                    value={this.state.betWinner}
                                                    type='text'
                                                    control={Input}
                                                    maxLength='42'
                                                    placeholder='0x00...00'
                                                    onChange={event => this.setState({betWinner:event.target.value})}
                                                />   
                                                </Form.Group>
                                                </Segment>
                                                <Segment><Button color='red'>Resolve Bet</Button></Segment>
                                            </Form>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row textAlign='center'>
                                        <Table.Cell><Button onClick={this.revertBet}>Revert Bet</Button></Table.Cell>
                                        <Table.Cell>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>{this.state.contractBalance} ⟠ Eth </h4>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell><Button onClick={this.getContractBalance}>Get Balance</Button></Table.Cell>
                                            </Table.Row>
                                        </Table.Cell>
                                        
                                        <Table.Cell>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>{this.state.betStatus}</h4>                                            
                                                </Table.Cell>
                                            </Table.Row>                                 
                                            <Table.Row>
                                                <Table.Cell><Button onClick={this.getBetStatus}>Get Status</Button></Table.Cell>
                                            </Table.Row> 
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row textAlign='center'>
                                    <Table.Cell></Table.Cell>
                                        <Table.Cell>
                                            <Button onClick={this.keyMasterSign}>I am the key master</Button>
                                        </Table.Cell>
                                    <Table.Cell></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment.Group>
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        positive
                        type='button'
                        icon='remove'
                        onClick={this.props.handleClose}
                        content='Cancel'
                    />
                    <Button
                        positive
                        type='button'
                        icon='checkmark'
                        onClick={this.confirmClick}
                        conent='EISAI PETSA'
                    />

                </Modal.Actions>
            
            </Modal>
        )
    }
}


export default BetModal