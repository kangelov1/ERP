import React,{Component} from 'react'
import {NavLink} from 'react-router-dom'

class PartsNavigation extends Component{
    constructor(){
        super()
        this.state={}
    }

    render(){
        return(
            <div className='container'>
                <div className="row">
                    <div className="col"><NavLink className="center-align btn" to="parts/purchasedMaterials">Create purchased material</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="parts/getParts">Get all existing parts</NavLink></div>
                </div>
            </div>
        )
    }
}

export default PartsNavigation
