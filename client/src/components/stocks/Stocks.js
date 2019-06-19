import React,{Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Dialog from '../modals/Dialog'

class Stocks extends Component{
    constructor(){
        super()
        this.state = {
            stocks:[],
            material:'',
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

        this.setState({
            ...this.state,
            stocks:[...this.state.stocks,{
                ['material']:this.state.material,
                ['quantity']:this.state.quantity
            }],
            material:'',
            quantity:''
        })

        document.getElementById('material').value = ''
        document.getElementById('quantity').value = ''
    }

    createMaterial = (e)=>{
        e.preventDefault()

        if(this.state.stocks.length == 0){
            this.setState({
                modalContent:{
                    title:"Form error",
                    content:"Please add at least one material to table"
                },
                showModal:true
            })
            return
        }

        this.setState({
          showLoader:true
        })
        axios.post('/stocks/updateStocks',{
            token:this.props.token,
            stocks:this.state.stocks
        })
            .then(res=>{
                this.setState({
                    modalContent:{
                        title:'Records updated',
                        content:"The parts which exist were updated",
                        missingParts:"The following parts do no exist and were not updated: " + res.data.missingParts
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
                    showModal:true,
                    showLoader:false
                })
                //console.log(err)
            })
    }

    renderEditable = cellInfo => {
        return (
          <div
            style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning

            onBlur={e => {
              console.log(cellInfo)
              const stocks = [...this.state.stocks];
              stocks[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
              this.setState({ stocks });
            }}
          >{cellInfo.value}</div>
        )
    }

    render(){
        let myClose = (e)=>{
                this.setState({showModal:false})
            }

        let modal = this.state.showModal ? (<Dialog style={{bottom:'0',top:'auto'}} title={this.state.modalContent.title} content={this.state.modalContent.content} missingParts={this.state.modalContent.missingParts} close={myClose} />):null

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
                <form className='white' onSubmit={this.handleSubmit}>
                    <h5 className="grey-text text-darken-3">Update stock</h5>
                    <div className="input-field">
                        <label htmlFor="material">Material number</label>
                        <input onChange={this.handleChange} id='material' type='text'/>
                    </div>

                    <div className="input-field">
                        <label htmlFor="quantity">Quantity</label>
                        <input onChange={this.handleChange} id='quantity' type='text'/>
                    </div>
                    <button className="btn" style={{marginBottom:'0.5rem'}} type='submit'>Add to table</button>
                </form>

                <ReactTable
                    data={this.state.stocks}
                    columns={[
                        {
                            Header:"Material",
                            accessor:'material',
                            Cell: this.renderEditable
                        },
                        {
                            Header:"Quantity",
                            accessor:'quantity',
                            Cell: this.renderEditable
                        }
                    ]}
                />
                {loader}
                <div className="input-field center-align">
                    <button onClick={this.createMaterial} className="btn">Update stock</button>
                </div>
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

export default connect(mapStateToProps)(Stocks)
