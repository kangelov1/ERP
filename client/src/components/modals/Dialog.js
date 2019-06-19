import React,{Component} from 'react'
import './dialog.css'

class Dialog extends Component{
    render(){
        return(
            <div className="myTest2 valign-wrapper center-align" style={this.props.style}>
                <div className="container white darken-2 modal-content">
                    <p>{this.props.title}</p>
                    <p>{this.props.content}</p>
                    <p>{this.props.missingParts}</p>
                    <button className="btn" onClick={this.props.close}>Close</button>
                </div>
            </div>
        )
    }
}

export default Dialog