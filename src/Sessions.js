import React, { Component } from 'react';
import {Dropdown, DropdownButton, ButtonGroup} from 'react-bootstrap';

export default class Sessions extends Component {

    constructor(props){
        super(props);
        this.state = {
            session: null
        }
    }
    setSession = (event, id)=>{

        this.props.setPerson(getPerson(this.props.people, id));
    }
    renderSessions(){
        return this.props.people.map((val)=>(<Dropdown.Item eventKey={val._id} key={val._id} onClick={(e)=>this.setSession(e,val._id)}>{val.firstName + " " + val.lastName}</Dropdown.Item>));
    }

    render() {
        return (
            <DropdownButton
                as={ButtonGroup}
                key={"sessions"}
                id={`dropdown-variants-${"sessions"}`}
                variant={"secondary"}
                title={ this.props.person === null ? "Select Session" : this.props.person.firstName + " " + this.props.person.lastName }
            >
                {this.props.people !== null ? this.renderSessions() : <Dropdown.Item>List is empty</Dropdown.Item>}
            </DropdownButton>
        )
    }
}


const getPerson = (people, id)=>{

    let person = people.filter((val)=>(val._id === id));

    return person.length > 0 ? person[0] : null;
}
