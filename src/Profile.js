import React, { Component } from 'react'
import { Card } from 'react-bootstrap'

export default class Profile extends Component {
    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>{this.props.profile.presence.state}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.profile.presence.emoji + " " + new Date(this.props.profile.presence.lastChange)}</Card.Subtitle>
                    <Card.Text>
                        {this.props.profile.presence.status}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}
