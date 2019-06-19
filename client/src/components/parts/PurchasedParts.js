import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import Dialog from '../modals/Dialog'

class PurchasedParts extends Component{
    constructor(){
        super()
        this.state={
            description:'',
            price:'',
            matNumber:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            showLoader:false
        }
    }

    checkForm = ()=>{
        if(this.state.description.trim().length == 0 || this.state.price.trim().length == 0 || this.state.matNumber.trim().length == 0){
            return false
        }else{
            return true
        }
    }

    handleChange = (event)=>{
        this.setState({
            [event.target.id]:event.target.value
        })
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
          showLoader:true
        })

        //console.log(this.state)
        axios.post('/purchasedMaterials/addMaterial',{
            description:this.state.description,
            price:this.state.price,
            productNumber:this.state.matNumber
        })
            .then(res=>{
                this.setState({
                    modalContent:{
                        title:'Part created',
                        content:res.data.message
                    },
                    showModal:true,
                    showLoader:false
                })
                document.getElementById('description').value = ''
                document.getElementById('price').value = ''
                document.getElementById('matNumber').value = ''
                //this.props.setToken(res.data.token)
            })
            .catch(err=>{
                this.setState({
                    modalContent:{
                        title:'Server error',
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
                    </div></div>):null

        return(
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create purchased material</h5>
                    <div className="input-field">
                        <label htmlFor="email">Description</label>
                        <input onChange={this.handleChange} type="text" id="description" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="price">Price</label>
                        <input onChange={this.handleChange} type="text" id="price" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="matNumber">Material number</label>
                        <input onChange={this.handleChange} type="text" id="matNumber" />
                    </div>
                    <div className="input-field">
                        <button className="btn">Create part</button>
                    </div>
                </form>
                {loader}
                {modal}
            </div>
        )
    }
}

export default PurchasedParts
