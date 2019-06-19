import React,{Component} from 'react';
import { BrowserRouter,Switch,Route } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

import Navbar from './components/navigation/Navbar'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import StocksNavigation from './components/stocks/StocksNavigation'
import Stocks from './components/stocks/Stocks'
import PartsStocks from './components/stocks/PartsStocks'
import ProductStocks from './components/stocks/ProductStocks'
import ProductsNavigation from './components/products/ProductsNavigation'
import CreateProduct from './components/products/CreateProduct'
import GetBOM from './components/products/GetBOM'
import OrderNavigation from './components/orders/OrderNavigation'
import PurchasedParts from './components/parts/PurchasedParts'
import CreateOrder from './components/orders/CreateOrder'
import GetOrders from './components/orders/GetOrders'
import ExecuteOrder from './components/orders/ExecuteOrder'
import DeleteProduct from './components/products/DeleteProduct'
import GetProducts from './components/products/GetProducts'
import GetParts from './components/parts/GetParts'
import PartsNavigation from './components/parts/PartsNavigation'

class App extends Component {
  constructor(){
        super()
        this.state={}
    }

  componentDidMount(){
      M.AutoInit()
  }

  render(){
      return (
          <BrowserRouter>
            <div className="App">
              <Navbar />
              <Switch>
                  <Route path="/login" component={SignIn}/>
                  <Route path="/signup" component={SignUp}/>
                  <Route path="/stocks" component={StocksNavigation} exact/>
                  <Route path="/stocks/updatePartsStocks" component={Stocks}/>
                  <Route path="/stocks/checkPartsStocks" component={PartsStocks}/>
                  <Route path="/stocks/ProductStocks" component={ProductStocks}/>
                  <Route path="/products" component={ProductsNavigation} exact/>
                  <Route path="/products/createProduct" component={CreateProduct}/>
                  <Route path="/products/getBOM" component={GetBOM}/>
                  <Route path="/products/deleteProduct" component={DeleteProduct}/>
                  <Route path="/orders" component={OrderNavigation} exact/>
                  <Route path="/parts" component={PartsNavigation} exact/>
                  <Route path="/parts/purchasedMaterials" component={PurchasedParts}/>
                  <Route path="/parts/getParts" component={GetParts}/>
                  <Route path="/orders/createOrder" component={CreateOrder}/>
                  <Route path="/orders/getOrders" component={GetOrders}/>
                  <Route path="/orders/executeOrder" component={ExecuteOrder}/>
                  <Route path="/products/getProducts" component={GetProducts}/>
              </Switch>
            </div>
          </BrowserRouter>
        );
  }

}

export default App;
