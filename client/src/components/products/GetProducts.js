import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import ReactTable from 'react-table'
import Dialog from '../modals/Dialog'

class GetProducts extends Component{
    constructor(){
        super()
        this.state={
            products:[],
            showModal:false,
            modalContent:{
                title:'',
                content:''
            },
            showLoader:false
        }
    }

    componentDidMount(){

        this.setState({
            showLoader:true
        })

        axios.get('/products/getProducts')
            .then(res=>{
                this.setState({
                  products:res.data.products,
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

                    let table = this.state.products.length > 0 ? ( < ReactTable data = {
                        this.state.products
                      }
                      columns = {
                        [{
                            Header: "Product number",
                            accessor: 'productNumber'
                          },
                          {
                            Header: "Description",
                            accessor: 'productDescription'
                          }
                        ]
                      }
                      />):(null)

        return(
            <div className="container">
                {table}
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

export default connect(mapStateToProps)(GetProducts)
