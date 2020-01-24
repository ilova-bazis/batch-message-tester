import React, { Component } from 'react'
import { Container, Row, Col, Button, InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import ChatItems from './ChatItems';
import channelsGetAll from './functions/channelGetAll';

export default class Chat extends Component {


    constructor(props){
        super(props);
        this.state = {
            interval: 1,
            count: 100,
            selected:{}
        };

        this.getConversation = this.getConversation.bind(this);
        this.intervalChangeHandler = this.intervalChangeHandler.bind(this);
        this.messageChangeHandler = this.messageChangeHandler.bind(this);
        this.selectChannels = this.selectChannels.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(){

        Object.values(this.state.selected).map(val=>{
            for(let i = 0; i < this.state.count; i++){
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
                        return {request: req, function: (e)=>{}}
                    });
                },this.state.interval)
            }
        })
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
    render() {
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
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ChatItems selected={this.state.selected} selectChannels={this.selectChannels} conversations={this.props.conversations}></ChatItems>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
