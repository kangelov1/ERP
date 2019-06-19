import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import Dialog from '../modals/Dialog'

class CreateOrder extends Component{
    constructor(){
        super()
        this.state = {
            product:'',
            quantity:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            showLoader:false
        }
    }

    handleChange = (e)=>{
        this.setState({
            ...this.state,
            [e.target.id]:e.target.value
        })
    }

    handleSubmit = (e)=>{
        e.preventDefault()

        if(this.state.product.trim().length == 0 || this.state.quantity <= 0){
            this.setState({
                modalContent:{
                    title:'Form error',
                    content:"Please provide a product number and a positive number quantity"
                },
                showModal:true
            })
            return
        }

        this.setState({
          showLoader:true
        })

        axios.post('/orders/createOrder',{
            product:this.state.product,
            quantity:this.state.quantity,
            token:this.props.token
        })
            .then(res=>{
                this.setState({
                    modalContent:{
                        title:'Order created',
                        content:'Order id' + ':' +res.data.order._id
                    },
                    showModal:true,
                    showLoader:false
                })
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Error occured',
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
                    <h5 className="grey-text text-darken-3">Create order</h5>
                    <div className="input-field">
                        <label htmlFor="product">Product</label>
                        <input onChange={this.handleChange} type="text" id="product" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="quantity">Quantity</label>
                        <input onChange={this.handleChange} type="text" id="quantity" />
                    </div>
                    <div className="input-field">
                        <button className="btn">Create</button>
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
        token:state.auth.token
    }
}

export default connect(mapStateToProps)(CreateOrder)
