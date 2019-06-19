import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import Dialog from '../modals/Dialog'

class SignIn extends Component{
    constructor(){
        super()
        this.state = {
            email:'',
            password:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            showLoader:false
        }
    }

    handleChange = (event)=>{
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    handleSubmit = (event)=>{
        event.preventDefault()

        if(this.state.password.length <= 0 || this.state.email.length <= 0){
            this.setState({
                    modalContent:{
                        title:'Form error',
                        content:'Fill the form correctly'
                    },
                    showModal:true
                })
            return
        }

        this.setState({
          showLoader:true
        })

        axios.post('/user/login',{email:this.state.email,password:this.state.password})
            .then(res=>{
                this.setState({
                  showLoader:false
                })
                this.props.setToken(res.data.token)
                this.props.history.push('/')
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Server error',
                        content:'Wrong username or password'
                    },
                    showModal:true,
                    showLoader:false
                })

            })
    }

    render(){
        let myClose = (e)=>{
                this.setState({showModal:false})
            }

        let modal = this.state.showModal ? (<Dialog title={this.state.modalContent.title} content={this.state.modalContent.content} close={myClose} />):null

        let loader = this.state.showLoader ? (<div className="container center-align"><div className="preloader-wrapper big active">
                      <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>
                    </div></div>):null

        return(
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Login</h5>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input onChange={this.handleChange} type="email" id="email" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input onChange={this.handleChange} type="password" id="password" />
                    </div>
                    <div className="input-field">
                        <button className="btn">Login</button>
                    </div>
                </form>
                {loader}
                {modal}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setToken:(token)=>{
            dispatch({type:'SET_TOKEN',token:token})
        }
    }
}

export default connect(null,mapDispatchToProps)(SignIn)
