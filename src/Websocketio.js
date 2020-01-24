import React from 'react';

import uuid from 'uuid/v4';
// import util, {TextEncoder} from 'util';
import * as util from 'text-encoding';
import { Button, Spinner, Container } from 'react-bootstrap';
import Chat from './Chat';
// import './App.css';
// import {startApplication} from './functions/ApplicationActions';
// import {getPeople} from './functions/GetPeople';
// import { submitDocument } from './functions/SubmitDocument';

// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";
 

const wsState = [<Spinner animation="grow" variant="success"/>, <span className="dotGreen"></span>];
const person = {
    "contacts": [],
    "device": [
        {
            // "_id": "5dff12951e80a835c1fcc35a",
            // "device_name": "Winfield_Nicolas60",
            // "device_id": "054f38a4-bf95-4c3c-808a-c626cb2c9e40",
            // "platform": "ios",
            // "app_version": "v2.2.4 (2)",
            // "ip": "232.16.48.125",
            // "api_key": "4f54b7c3-2431-4ac1-807f-c5acd4ec1ed3",
            // "__v": 0,
            // "session_id": "470d3b0d-c40d-4f53-b27a-651ffbdd6e81",

            // api_key: "71a7ec52-f0ad-420b-9f61-e9d31e4d5b2c",
            // app_version: "v1.0.0 (beta)",
            // device_id: "D25S407VGQ17",
            // device_name: "Apple Inc., iMac17,1",
            // platform: "macOS",
            // session_id: "61bd252c-9be8-4b3a-b408-b045d862aad2",
            /// NABI
            // api_key: "71a7ec52-f0ad-420b-9f61-e9d31e4d5b2c",
            // app_version: "v1.0.0 (beta)",
            // device_id: "D25S407VGQ17",
            // device_name: "Apple Inc., iMac17,1",
            // platform: "macOS",
            // session_id: "a2e7854d-55de-4922-ae62-cbd6d68b98d7",
            // END OF NABI
            "_id": "5dff12951e80a835c1fcc35a",
            "device_name": "Winfield_Nicolas60",
            "device_id": "054f38a4-bf95-4c3c-808a-c626cb2c9e40",
            "platform": "ios",
            "app_version": "v2.2.4 (2)",
            "ip": "232.16.48.125",
            "api_key": "4f54b7c3-2431-4ac1-807f-c5acd4ec1ed3",
            "__v": 0,
            "session_id": "470d3b0d-c40d-4f53-b27a-651ffbdd6e81"
        }
    ],
    "accountList": [],
    "_id": "5dff12961e80a835c1fcc541",
    "firstName": "Walker",
    "lastName": "Spencer",
    "phone": "+9928810524131",
    "email": "walker1@gmail.com",
    "__v": 0,
    "account_id": null
};


// const LinkO = (props)=>(<Link to="/document" />);
export default class WebSocketio extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            conversations:[],
            reply: [],
            ws: null,
            people: null,
            person: person,
            requests: {},
            anchorEl: null,
        }

       
       
        this.disconnectWS = this.disconnectWS.bind(this);
        this.setWebSocketRules = this.setWebSocketRules.bind(this);


    }
    // const [reply, setReply] = React.useState([]);
    // const [ws, setWs] = React.useState(null);
    // let ws = null;

    async onMessage(e){
        // console.log(temp);
        let temp = this.state.reply;
        let reqs = this.state.requests;
        if(e.id !== undefined){
            try{
                // this.state.requests[e.id.toLowerCase()](e, this.state.person, this.state.specs).then(data=>{
                //     this.setState({specs:{...this.state.specs, ...data}});
                // });
                this.state.requests[e.id.toLowerCase()](e).then(data=>{
                    // this.setState({specs:{...this.state.specs, ...data}});
                    console.log(data);
                    this.setState(data);
                });
            }
            catch{
                console.log("Function not found.");
            }
            delete reqs[e.id.toLowerCase()];
        }
        temp.unshift(e);
        this.setState({reply:[...temp], requests: reqs});
    }

    componentDidMount() {
        // getPeople().then(response=>{
        //     // console.log(response.data.persons.filter(val=>val.device[0].session_id !== undefined));
        //     this.setState({people: response.data.persons.filter(val=>val.device[0].session_id !== undefined)});
        // }).catch(err=>console.log(err));
    }
    
    disconnectWS() {
        let t = this.state.ws;
        if(t !== null){
            t.close();
        }
        this.setState({ws: null});
        
    }
    clearLog(){

        this.setState({reply:[]});
    }

    converter = (json) => {
        let encoder = new util.TextEncoder();

        let data = encoder.encode(JSON.stringify(json));
        // return new util.TextEncoder().encode(JSON.stringify(json));
        return data;

    }
    wsDisconnected = (data)=>{
        // console.log(data);
        this.setState({ws: null});
    }

    connectWS = ()=> {
        let temp = new WebSocket("wss://wssdev.nexustls.com/wssprox1/http");
        // let temp = new WebSocket("ws://localhost:8088/http");
        // let temp = new WebSocket("ws://cs.nexus:8088/http");

        
        temp.binaryType = 'arraybuffer';
        
        temp.onopen = (data) => sendHeaders(data);
        temp.onerror = (e) => console.log(e);
        temp.onmessage = (e) => {
            try{

                let dd = JSON.parse(new util.TextDecoder('utf-8').decode(e.data));
                
                console.log(dd);
                if(dd.id !== undefined){
                    if(dd.params !== undefined){
                        console.log('sending ack');
                        let ack = {
                            id: dd.id,
                            method: "ack",
                            version: 3,
                            params:{
                                receivedMSG: dd.params.length
                            }
                        };
                        console.log(ack)
                        temp.send(this.converter(ack));
                    }
                   
                }
                this.onMessage(dd);
            }
            catch(error) {
                console.log("Message Error while parsing", error);
                // console.log(error);
            }
        };

        temp.onclose = (e)=> this.wsDisconnected(e);
    
        const sendHeaders = (data) => {
            temp.send(this.converter({
                version: 3,
                id: uuid(),
                method: 'client.authorization',
                params: {
                    api_key: this.state.person.device[0].api_key,
                    app_version: this.state.person.device[0].app_version,
                    platform: this.state.person.device[0].platform,
                    device_id: this.state.person.device[0].device_id,
                    device_name: this.state.person.device[0].device_name,
                    session_id: this.state.person.device[0].session_id
                }
            }));
        }

        this.setState({ws:temp});
    }

    // startApplication = ()=>{
    //     let reqUUID = uuid();
    //     let req = {
    //         version: 3, 
    //         id: reqUUID,
    //         method: "document.application.start",
    //         params: {
    //             isoCode: "TJ",
    //             country: "TJ"
    //         }
    //     }
  
    //     this.state.ws.send(this.converter(req));
    //     this.setState({requests: {...this.state.requests, [reqUUID.toLowerCase()]: startApplication }});
    // }
    sendWS = (cb) => {
        
        let id = uuid();
        let p = cb(this.state.person, this.state.specs, id);
        // console.log(p.request);
        this.state.ws.send(this.converter(p.request));
        this.setState({requests: {...this.state.requests, [id.toLowerCase()]: p.function}});
        // cb()
    }

    // submitDocument = (filename) => {
    //     let reqUUID = uuid();
    //     let req = {
    //         version: 3, 
    //         id: reqUUID,
    //         method: "document.submit",
    //         params: {
    //             applicationID: this.state.specs.application.applicationID,
    //             documentType: this.state.specs.type,
    //             countryCode: "TJ",
    //             set: '8a7cf1fb-36a6-4b0a-ac61-97a9b9bd106b',
    //             filename: filename
    //         }
    //     }
  
    //     // console.log(req);
    //     this.state.ws.send(this.converter(req));
    //     this.setState({requests: {...this.state.requests, [reqUUID.toLowerCase()]: submitDocument }, specs: {...this.state.specs, filename: filename}});
    // }

   
    setWebSocketRules(e) {
        let person = this.state.people.filter(val=>val._id === e.target.value)
        this.setState({person: person[0]});
    }

   

    // [anchorEl, setAnchorEl] = React.useState(null);

    renderChat(ws){
        return (ws.readyState === 1 ? <div><Chat sendWS={this.sendWS} conversations={this.state.conversations}></Chat></div> : <div></div>);
    }

    // console.log(ws);
    render(){
        // console.log(this.state);
        return (<>
            <Container>
                <div>
                    <p>Select session:</p>
                    {/* <Select onChange={this.setWebSocketRules}>
                        { this.state.people === null ? <MenuItem>No Sessions</MenuItem> : this.state.people.map(val=>(<MenuItem value={val._id}>{val.lastName + " " + val.firstName}</MenuItem>)) }
                    </Select> */}
                    <h3 variant='h6'>WebSocket Status: { this.state.ws ? wsState[this.state.ws.readyState] :<span className="dotRed"></span>}</h3>
                    {/* <Button></Button> */}
                    <Button variant="success"  disabled={ this.state.ws !== null } onClick={this.connectWS}>Connect</Button>
                    <Button variant="danger" disabled={ this.state.ws === null } onClick={this.disconnectWS}>Disconnect</Button>
                    {/* <button variant='contained' onClick={this.clearLog}>Clear Log</button> */}
                </div>
                <hr></hr>
                { this.state.ws ? this.renderChat(this.state.ws): ""}
            </Container>
        </>)
    }
    





}