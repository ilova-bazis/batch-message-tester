import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap';

export default class ChatItems extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
        this.itemClickHanlder = this.itemClickHanlder.bind(this);
    }
    itemClickHanlder(ev, val){
       
        this.props.selectChannels(ev, val);
        
    }
    renderUserName(user){
        if(user.title !== undefined) {
            return user.title
        }
        else {
            
        }
    }
    render() {
        return (
            <div>
                <ListGroup>
                    
                </ListGroup>
                {this.props.conversations.map(val=>{
                    return this.props.selected[val.id] !== undefined ? <ListGroup.Item onClick={(ev)=>this.itemClickHanlder(ev, val)} as="li" key={val.id} active>
                    {val.channelType !== "DM" ? val.title : this.renderUserName(val)}
                </ListGroup.Item> :  <ListGroup.Item onClick={(ev)=>this.itemClickHanlder(ev, val)} as="li" key={val.id}>
                            {val.channelType !== "DM" ? val.title : this.renderUserName(val)}
                        </ListGroup.Item>;
                })}

            </div>
        )
    }
}
