import React,{Component} from 'react'
import {NavLink} from 'react-router-dom'

class StocksNavigation extends Component{
    constructor(){
        super()
        this.state={}
    }

    render(){
        return(
            <div className='container'>
                <div className="row">
                    <div className="col"><NavLink className="center-align btn" to="/products/createProduct">Create product</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="/products/getBOM">Get product BOM</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="/products/deleteProduct">Delete product</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="/products/getProducts">Get all available products</NavLink></div>
                </div>
            </div>
        )
    }
}

export default StocksNavigation
