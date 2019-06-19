import React from 'react'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'

const Navbar = (props)=>{
    const {authStatus} = props
    
    const links = authStatus ? <SignedInLinks />:<SignedOutLinks />
    
    return(
        <nav className="nav-wrapper grey darken-3" style={{marginBottom:'1rem'}}>
            <div className="container">
                <NavLink to='/' className="brand-logo">Simple ERP</NavLink>
                {links}
            </div>
        </nav>
    )
}

const mapStateToProps = (state)=>{
    return{
        authStatus:state.auth.isSignedIn
    }
}

export default connect(mapStateToProps)(Navbar)