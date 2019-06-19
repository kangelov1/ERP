import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import ReactTable from "react-table"
import Dialog from '../modals/Dialog'
import "react-table/react-table.css"

class ExecuteOrders extends Component{
    constructor(){
        super()
        this.state={
            orderNumber:'',
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

    handleSubmit = (e)=>{
        e.preventDefault()

        this.setState({
          showLoader:true
        })

        axios.get('/orders/executeOrder/' + this.state.orderNumber)
            .then(res=>{
                this.setState({
                    modalContent:{
                        title:'Order status',
                        content:res.data.message
                    },
                    showModal:true,
                    showLoader:false
                })
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Order status',
                        content:err.response.data.message
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
                    </div></div>):(null)

        return(
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Execute order</h5>
                    <div className="input-field">
                        <label htmlFor="orderNumber">Order number</label>
                        <input onChange={this.handleChange} type="text" id="orderNumber" />
                    </div>
                    <div className="input-field">
                        <button className="btn">Execute order</button>
                    </div>
                </form>
                {loader}
                {modal}
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        authStatus:state.auth.isSignedIn,
        token:state.auth.token
    }
}

export default connect(mapStateToProps)(ExecuteOrders)
