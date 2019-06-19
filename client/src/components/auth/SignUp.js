import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import M from 'materialize-css'
import Dialog from '../modals/Dialog'

class SignUp extends Component{
    constructor(){
        super()
        this.state = {
            name:'',
            email:'',
            password:'',
            company:'',
            position:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            companies:[],
            showLoader:false,
            formSubmitted:false,
            stayOnPage:true
        }
    }

    componentDidMount(){
        this.setState({
            showLoader:true
        })

        axios.get('company/listAll')
            .then(res=>{
              this.setState({
                companies:res.data
              })
              //this.render()
              this.setState({
                showLoader:false
              })
            })
            .catch(err=>{
              console.log(err)
              this.setState({
                  modalContent:{
                      title:'Server error',
                      content:err.response.data.message
                  },
                  showModal:true,
                  showLoader:false
              })
            })
        let selectElements = document.querySelectorAll('select')
        let instances = M.FormSelect.init(selectElements)
    }

    handleChange = (event)=>{
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    checkForm = ()=>{
        if(this.state.name.trim().length == 0 || this.state.email.trim().length == 0 || this.state.password.trim().length == 0 ||                  this.state.company.trim().length == 0 || this.state.position === ''){
            return false
        }else{
            return true
        }
    }

    handleSubmit = (event)=>{
        event.preventDefault()

        let isFilledCorrectly = this.checkForm()

        if(!isFilledCorrectly){
            this.setState({
                modalContent:{
                    title:'Form error',
                    content:'Please fill the form correctly'
                },
                showModal:true
            })
            return
        }

        this.setState({
          formSubmitted:true
        })

        axios.post('/user/signUp',{
            name:this.state.name,
            email:this.state.email,
            password:this.state.password,
            company:this.state.company,
            position:this.state.position
        })
            .then(res=>{
              this.setState({
                modalContent:{
                    title:'User created',
                    content:'You can now sign in'
                  },
                  showModal:true,
                  formSubmitted:false,
                  stayOnPage:false
                })
              })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Server error',
                        content:err.response.data.message
                    },
                    showModal:true,
                    formSubmitted:false,
                    stayOnPage:true
                })
            })
    }

    componentDidUpdate(){
      let selectElements = document.querySelectorAll('select')
      let instances = M.FormSelect.init(selectElements)
    }

    render(){
        let myClose = this.state.stayOnPage ? (e)=>{
                this.setState({showModal:false})
            }:(e)=>{this.props.history.push('/login')}

        let modal = this.state.showModal ? (<Dialog title={this.state.modalContent.title} content={this.state.modalContent.content} close={myClose} />):null

        let comps = this.state.companies.length > 0 ? (<select onChange={this.handleChange} id="company" ref="dropdown" defaultValue='noValue'>
          <option value="noValue" disabled>Choose your company</option>
          {this.state.companies.map((e, key) => {
            return (<option value={e.name} key={e._id}>{e.name}</option>)
          })}
        </select>):null

        let formLoading = this.state.formSubmitted ? (<div className="container center-align"><div className="preloader-wrapper big active">
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
                    </div></div>):(
                        <div className="container">
                            <form onSubmit={this.handleSubmit} className="white">
                                <h5 className="grey-text text-darken-3">Sign up</h5>
                                <div className="input-field">
                                    <label htmlFor="name">Name</label>
                                    <input onChange={this.handleChange} type="text" id="name" />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="email">Email</label>
                                    <input onChange={this.handleChange} type="email" id="email" />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="password">Password</label>
                                    <input onChange={this.handleChange} type="password" id="password" />
                                </div>
                                {comps}
                                <div className="input-field">
                                  <select onChange={this.handleChange} id="position" ref="dropdown" defaultValue='noValue'>
                                    <option value="noValue" disabled>Choose your position</option>
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                  </select>
                                </div>
                                <div className="input-field">
                                    <button className="btn">Sign up</button>
                                </div>
                            </form>
                            {modal}
                            {formLoading}
                        </div>
                    )
        return loader
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setToken:(token)=>{
            dispatch({type:'SET_TOKEN',token:token})
        }
    }
}

export default connect(null,mapDispatchToProps)(SignUp)
