import React,{Component} from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import M from 'materialize-css'
import Dialog from '../modals/Dialog'

class Products extends Component{
    constructor(){
        super()
        this.state = {
            records:[],
            description:'',
            productNumber:'',
            material:'',
            quantity:'',
            showModal:false,
            modalContent:{
                title:'',
                content:''
            }
        }
    }

    checkForm = ()=>{
        if(this.state.description.trim().length == 0 || this.state.productNumber.trim().length == 0 || this.state.records.length == 0){
            return false
        }else{
            return true
        }
    }

    componentDidMount(){
        let selectEl = document.querySelectorAll('select')
        let instance = M.FormSelect.init(selectEl)
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
            records:[...this.state.records,{
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

        let isFilled = this.checkForm()
        if(!isFilled){
            this.setState({
                modalContent:{
                    title:'Form error',
                    content:"Please fill the form correctly - product number and description are required and BOM can't be empty"
                },
                showModal:true,
            })
            return
        }

        axios.post('/products/addProduct',{
            description:this.state.description,
            productNumber:this.state.productNumber,
            partsQuantities:this.state.records
        })
            .then(res=>{

                this.setState({
                    modalContent:{
                        title:'Product created',
                        content:res.data.message,
                        missingParts:"The following parts do no exist and were not added to BOM: " + res.data.missingParts
                    },
                    showModal:true,
                })
            })
            .catch(err=>{
                console.log(err.response)
                this.setState({
                    modalContent:{
                        title:'Server error',
                        content:err.response.data.message,
                        missingParts:"The following parts do no exist and were not added to BOM: " + err.response.data.missingParts
                    },
                    showModal:true
                })
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
              const records = [...this.state.records];
              records[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
              this.setState({ records });
            }}
          >{cellInfo.value}</div>
        )
    }

    render(){
        let myClose = (e)=>{
                this.setState({showModal:false})
            }

        let modal = this.state.showModal ? (<Dialog style={{bottom:'0',top:'auto'}} title={this.state.modalContent.title} content={this.state.modalContent.content} missingParts={this.state.modalContent.missingParts} close={myClose} />):null

        return(
            <div className="container">
                <h3 className='center-align'>Create product</h3>
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Define product</h5>
                    <div className="input-field">
                        <label htmlFor="email">Description</label>
                        <input onChange={this.handleChange} type="text" id="description" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="productNumber">Product number</label>
                        <input onChange={this.handleChange} type="text" id="productNumber" />
                    </div>
                </form>

                <form className='white' onSubmit={this.handleSubmit}>
                    <h5 className="grey-text text-darken-3">Define Bill of materials</h5>
                    <div className="input-field">
                        <label htmlFor="material">Material number</label>
                        <input onChange={this.handleChange} id='material' type='text'/>
                    </div>

                    <div className="input-field">
                        <label htmlFor="quantity">Quantity</label>
                        <input onChange={this.handleChange} id='quantity' type='text'/>
                    </div>
                    <button className="btn" style={{marginBottom:'0.5rem'}} type='submit'>Add to BOM</button>
                </form>

                <ReactTable
                    data={this.state.records}
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
                <div className="input-field center-align">
                    <button onClick={this.createMaterial} className="btn">Create product</button>
                </div>
                {modal}
            </div>
        )
    }
}

export default Products
