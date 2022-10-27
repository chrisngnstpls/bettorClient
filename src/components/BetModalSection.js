import react, {Component} from 'react';

import BetModal from './BetModal';
import { Button, Grid } from 'semantic-ui-react';


class BetModalSection extends Component {
    
    constructor(props){
        super(props);
        
        
        this.state = {
            modalOpen:false,
            valueIntoModal:'sdfsfsdfsdf',
            initiator : props.initiator,
            syncedAddress : props.user,
            key:props.rowKey,
            web3:props.web3,
            contractLocation : props.location,
            gas:props.gas
        }
        console.log('inside modal section', props)
    }

    render(){
        return([
            <Button
                key={this.state.key}
                primary
                content='view'
                onClick={
                    ()=>{
                        this.setState({modalOpen:true})
                    }
                }
                />,
                <BetModal
                    key='closemodal'
                    web3={this.state.web3}
                    modalOpen={this.state.modalOpen}
                    initiator={this.state.initiator}
                    syncedAddress = {this.props.myAddress}
                    contractLocation = {this.state.contractLocation}
                    gas={this.state.gas}
                    handleClose={
                        ()=> {
                            this.setState({modalOpen:false})
                        }
                    }
                    valueIntoModal={this.state.initiator}
                />
        ])
    }
}

export default BetModalSection