import React from 'react'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'

const SignedInLinks = (props)=>{
    return(
        <ul className="right">
            <li><NavLink to="/stocks">Stocks</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/orders">Orders</NavLink></li>
            <li><NavLink to="/parts">Purchased parts</NavLink></li>
            <li><NavLink to='/' onClick={props.logOut}>Logout</NavLink></li>
            <li><NavLink to="/" className="btn btn-floating pink lighten-1">NN</NavLink></li>
        </ul>
    )
}

const mapDispatchToProps = (dispatch)=>{
    return{
        logOut:(props)=>{
            dispatch({type:'LOG_OUT'})
        }
    }
}

export default connect(null,mapDispatchToProps)(SignedInLinks)