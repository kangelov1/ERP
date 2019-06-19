import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import ReactTable from "react-table"
import "react-table/react-table.css"
import Dialog from '../modals/Dialog'


class GetOrders extends Component{
    constructor(){
        super()
        this.state={
            orderStatus:'',
            orders:[],
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
        if(this.state.orderStatus == ''){
            this.setState({
                    modalContent:{
                        title:'Form error',
                        content:"Please choose order status"
                    },
                    showModal:true,
                })
            return
        }

        let requestBody = {
            orderStatus:this.state.orderStatus,
            token:this.props.token
        }

        this.setState({
            showLoader:true,
            orders:[]
        })

        axios.post('/orders/getOrders',requestBody)
            .then(res=>{

                if(res.data.length == 0){
                    this.setState({
                        modalContent:{
                            title:'Notification',
                            content:"No orders with such status"
                        },
                        showModal:true,
                        showLoader:false
                    })
                    return
                }
                this.setState({
                    orders:res.data,
                    showLoader:false
                })
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:"Error occured",
                        content:err.response.message
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

        let ordersTable = <ReactTable
                    data={this.state.orders}
                    columns={[
                        {
                            Header:'Order id',
                            accessor:'_id'
                        },
                        {
                            Header:"Product",
                            accessor:'product'
                        },
                        {
                            Header:"Quantity",
                            accessor:'quantity'
                        },
                        {
                            Header:'Order status',
                            accessor:'status'
                        }
                    ]}
                />

        let loader = this.state.showLoader ? (<div className="preloader-wrapper big active">
                      <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>
                    </div>):<h1>No order status chosen</h1>

        let table = this.state.orders.length ? ordersTable:(null)
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Get orders</h5>
                    <div className="input-field">
                      <select className="browser-default" onChange={this.handleChange} id="orderStatus" ref="dropdown" defaultValue='noValue'>
                        <option value="noValue" disabled>Choose order status</option>
                        <option value="created">Created</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="input-field">
                        <button className="btn">Get orders</button>
                    </div>
                </form>
                {table}
                {modal}
                {loader}
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

export default connect(mapStateToProps)(GetOrders)
