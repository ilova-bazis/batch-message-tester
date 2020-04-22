import React, { Component } from 'react'
import { Container, Row, Col, Button, InputGroup, FormControl, Dropdown, ProgressBar } from 'react-bootstrap'
import ChatItems from './ChatItems';
import channelsGetAll from './functions/channelGetAll';
import Contacts from './Contacts';
import User from './User';
import Presence from './Presence';

export default class Chat extends Component {


    constructor(props){
        super(props);
        this.state = {
            interval: 100,
            count: 10,
            selected:{},
            progress: 0
        };

        this.getConversation = this.getConversation.bind(this);
        this.intervalChangeHandler = this.intervalChangeHandler.bind(this);
        this.messageChangeHandler = this.messageChangeHandler.bind(this);
        this.selectChannels = this.selectChannels.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.resetProgress = this.resetProgress.bind(this);
    }

    sendMessage(){
        this.resetProgress((mal=>{
            this.setState({ progress: 0 });

        let total = Object.values(this.state.selected).length * this.state.count;
        let counter = 0;
        console.log(total);
        
        Object.values(this.state.selected).forEach(val=>{
            for(let i = 0; i < this.state.count; i++){
                counter++;
                console.log(counter);
                this.setState({progress: Math.round(counter/total * 100)}, hal=>{
                    setTimeout(()=>{
                        this.props.sendWS((person, specs, uuid)=>{
                            let req = {
                                id: uuid,
                                version: 3,
                                method: "message.send",
                                params: {
                                    body: "Itiration " + i + ", Test Message, Time: " + new Date().toTimeString(),
                                    channelId: val.id,
                                    type: 1
                                }
                            }
                            
                            return {request: req, function: (counter)=>{
                                console.log("JANIVAR");
                                
                            }}
                        });
                        
                    },1+this.state.interval*i);
                });
               
                
                console.log(Math.round(counter/total * 100));
               
            }
        });

        }));
        
    }
    resetProgress = (cb)=>{

        return this.setState({progress: 0}, cb);
    }
    getConversation(){
        // this.props.sendWS();
        this.props.sendWS((person, specs, uuid)=>{
            let req = {
                id: uuid,
                version: 3,
                method: 'channel.getAll',
                params: {
                   
                }
            }
            return {request: req, function: channelsGetAll};
        });
    }
    getUser(user,cb){

        this.sendWS((person, specs, id)=>{

        })
    }
    componentDidMount(){
        this.getConversation();
    }
    intervalChangeHandler(e){
        console.log(e.target.value);
        this.setState({interval: Number(e.target.value) > 0 ? Number(e.target.value) : 1 })
    }
    messageChangeHandler(e){
        console.log(e.target.id);
        this.setState({count: Number(e.target.id)})
    }
    selectChannels(ev, val){
        console.log(val.id, ev.target);
        let temp = this.state.selected;
        if (temp[val.id] !== undefined) {
            delete temp[val.id];
            this.setState({selected: temp})
        }
        else{
            this.setState({selected: { ...this.state.selected, [val.id]: val }});
        }
    }
    // resetProgressBar(){
    //     this.setState({progress: 0});
    // }
    render() {
        console.log(this.state.progress);
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <Button onClick={this.getConversation}>Reload chat</Button>
                        </Col>
                        <Col>
                        <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="hello">
                        Messages: { this.state.count}
                        </Dropdown.Toggle>

                        <Dropdown.Menu onClick={this.messageChangeHandler}>
                            <Dropdown.Item id={1}>1</Dropdown.Item>
                            <Dropdown.Item id={10}>10</Dropdown.Item>
                            <Dropdown.Item id={100}>100</Dropdown.Item>
                            <Dropdown.Item id={500}>500</Dropdown.Item>
                            <Dropdown.Item id={1000}>1000</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                        </Col>
                        <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Interval</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Default"
                                onChange={this.intervalChangeHandler}
                                type="number"
                                value={this.state.interval}
                                aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                        </Col>
                        <Col>
                            <Button variant="warning" onClick={this.sendMessage}>Send</Button>
                            <Button variant="success" onClick={()=>this.setState({progress: 0})}>Reset</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ProgressBar now={this.state.progress} animated />
                        </Col>
                       
                    </Row>
                    <Row>
                        <Col>
                            <ChatItems selected={this.state.selected} selectChannels={this.selectChannels} conversations={this.props.conversations}></ChatItems>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Contacts sendWS={this.props.sendWS}></Contacts><User  profile={this.props.profile} sendWS={this.props.sendWS}></User>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Presence sendWS={this.props.sendWS} accountIDs={this.props.accountIDs} presence={this.props.presence}></Presence>
                        </Col> 
                    </Row>
                </Container>
            </div>
        )
    }
}
