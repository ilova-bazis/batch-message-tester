import React, { Component } from 'react'
import { Button, Card  } from 'react-bootstrap'

export default class Presence extends Component {

    setPresence(){
        this.props.sendWS((person, specs, id)=>{

            let req = {
                id: id,
                method: "user.set.presence",
                version: 3,
                params: {
                    state: Math.random()>0.5 ? "ON" : "IDL",
                    status: "This is Sparta",
                    emoji: "👨‍🎤",
                    activity: 'Coding'
                }
            }
            return {request: req, function: console.log }
        })
    }

    renderPresenceNotify() {
        return this.props.presence.map(val=>{
            return <Card>
            <Card.Body>
                <Card.Title>{val.state}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{val.emoji}</Card.Subtitle>
                <Card.Text>
                    {val.status}
                </Card.Text>
            </Card.Body>
        </Card>
        });
    }
    getProfile(){
        this.props.sendWS((person, specs, id)=>{

            let req = {
                id: id,
                method: "user.get.profile",
                version: 3, 
                params: {
                    accountIDs: this.props.accountIDs
                }
            }

            return {request: req, function: console.log }
        });
    }

    setInvisible(){
        this.props.sendWS((person, specs, id)=>{
            let req = {
                id: id, 
                method: "user.set.presence",
                version: 3,
                params: {
                    state: "INV",
                    status: "I AM INVISIBLE MAN",
                    activity: "Coding"
                }
            }

            return {request: req, function: console.log}
        })
    }
    render() {
        return (
            <div>
                Presence <Button variant="success" onClick={this.setPresence.bind(this)}>Set Presence</Button>
                <p>
                    <Button onClick={this.getProfile.bind(this)}>Get Profiles</Button>
                    <Button onClick={this.setPresence.bind(this)}>Set Presence</Button>
                    <Button onClick={this.setInvisible.bind(this)}>Set Invisible</Button>
                </p>
                
                Notification: 
                <div>
                    <p>
                        {this.renderPresenceNotify()}
                        
                    </p>
                </div>
            </div>
        )
    }
}
