import React, { Component } from 'react'
import Profile from './Profile';
import getProfile from './functions/getProfile';

export default class User extends Component {

    constructor(props){
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler(e){
        e.preventDefault();
        console.log('HEY');
        this.props.sendWS((person, specs, uuid)=>{
            let req = {
                id: uuid,
                version: 3,
                method: 'user.get.profile',
                params: {
                }
            }
            return {request: req, function: getProfile };
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.clickHandler}>Get Profile</button>
                <Profile profile={this.props.profile}></Profile>
            </div>
        )
    }
}
