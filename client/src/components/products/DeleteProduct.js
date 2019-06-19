import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import Dialog from '../modals/Dialog'

class DeleteProduct extends Component{
    constructor(){
        super()
        this.state={
            productNumber:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            showLoader:false
        }
    }

    handleSubmit = (e)=>{
        e.preventDefault()

        if(this.state.productNumber.trim().length == 0){
            this.setState({
                modalContent:{
                    title:'Form error',
                    content:"Please fill the form"
                },
                showModal:true
            })
            return
        }

        this.setState({
            showLoader:true
        })

        axios.post('/products/deleteProduct',{token:this.props.token,productNumber:this.state.productNumber})
            .then(res=>{

                this.setState({
                    modalContent:{
                        title:'Server response',
                        content:res.data.message
                    },
                    showModal:true,
                    showLoader:false
                })
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Server error',
                        content:err.response.data.message
                    },
                    showLoader:false,
                    showModal:true
                })
            })
    }

    handleChange = (event)=>{
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    render(){
        let myClose = (e)=>{
                this.setState({showModal:false})
            }

        let modal = this.state.showModal ? (<Dialog title={this.state.modalContent.title} content={this.state.modalContent.content} close={myClose} />):null

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
                    </div>):(null)


        return(
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <div className="input-field">
                        <label htmlFor="productNumber">Product Number</label>
                        <input onChange={this.handleChange} type="text" id="productNumber" />
                    </div>
                    <div className="input-field">
                        <button className="btn">Delete product</button>
                    </div>
                </form>
                {modal}
                {loader}
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        token:state.auth.token
    }
}

export default connect(mapStateToProps)(DeleteProduct)
