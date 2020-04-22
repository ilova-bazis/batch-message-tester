import React, { Component } from 'react'

export default class Contacts extends Component {

    constructor(props){
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.getAllContacts = this.getAllContacts.bind(this);
    }
    clickHandler(e){
        e.preventDefault();
        console.log('HEY');
        this.props.sendWS((person, specs, uuid)=>{
            let req = {
                id: uuid,
                version: 3,
                method: 'contact.sync',
                params: {
                   contacts: []
                }
            }
            return {request: req, function: console.log};
        });
    }
    getAllContacts(e){
        e.preventDefault();
        console.log('HEY');
        this.props.sendWS((person, specs, uuid)=>{
            let req = {
                id: uuid,
                version: 3,
                method: 'contact.get',
                params: {
                   contacts: []
                }
            }
            return {request: req, function: console.log};
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.clickHandler}>Sync Contact</button>
                <button onClick={this.getAllContacts}>Get All Contacts</button>
            </div>
        )
    }
}
