import React from 'react'
import {NavLink} from 'react-router-dom'

const OrderNavigation = ()=>{
    return(
        <div className='container'>
            <div className="row">
                <div className="col s4">
                  <NavLink className="btn" to="orders/createOrder">Create order</NavLink>
                </div>
                <div className="col s4">
                  <NavLink className="btn" to="orders/getOrders">Get orders</NavLink>
                </div>
                <div className="col s4">
                  <NavLink className="btn" to="orders/executeOrder">Execute order</NavLink>
                </div>
            </div>
        </div>
    )
}

export default OrderNavigation