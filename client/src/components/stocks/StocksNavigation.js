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
                    <div className="col"><NavLink className="center-align btn" to="/stocks/productStocks">Check product stocks</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="/stocks/updatePartsStocks">Update parts stocks</NavLink></div>
                    <div className="col"><NavLink className="center-align btn" to="/stocks/checkPartsStocks">Check parts stocks</NavLink></div>
                </div>
            </div>
        )
    }
}

export default StocksNavigation