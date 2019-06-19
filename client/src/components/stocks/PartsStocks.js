import React,{Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import M from 'materialize-css'
import Dialog from '../modals/Dialog'

class PartsStocks extends Component{
    constructor(){
        super()
        this.state={
            stocks:[],
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
        axios.post('/stocks/getPartsStocks',{token:this.props.token})
            .then(res=>{

                this.setState({
                    stocks:res.data.stocks,
                    showLoader:false
                },()=>{
                    let selectEl = document.querySelectorAll('select')
                    let instances = M.FormSelect.init(selectEl)
                })
            })
            .catch(err=>{
              this.setState({
                  modalContent:{
                      title:"Error occured",
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

        let table = this.state.stocks.length > 0 ? (<ReactTable
                        data={this.state.stocks}
                        columns={[
                            {
                                Header:"Product Number",
                                accessor:'productNumber'
                            },
                            {
                                Header:"Description",
                                accessor:'description'
                            },
                            {
                                Header:"Price",
                                accessor:"price"
                            },
                            {
                                Header:"Quantity",
                                accessor:"quantity"
                            }
                        ]}
                    />):(null)


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
                <h3>Purchased parts stocks</h3>
                {table}
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

export default connect(mapStateToProps)(PartsStocks)
