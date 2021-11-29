import React from 'react'
import {CurrencyContext} from "../contexts/CurrencyContext";
import getSymbolFromCurrency from 'currency-symbol-map'
import {Link} from "react-router-dom";
import '../css/ProductsPage.css'
import { AiOutlineShoppingCart} from "react-icons/ai";

export class ItemCard extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            cartButtonIsVisible: false
        }
    }


    render() {
        return (
            <CurrencyContext.Consumer>
                {(currencyContext) => {
                    const {selectedCurrency} = currencyContext
                    return (
                        <Link to ={`/product/${this.props.product.id}`} style={{textDecoration:"none", color: "black"}}>
                            <div className="card" >
                                <div
                                    className="card-body"
                                    onMouseOver={()=>this.setState({cartButtonIsVisible: true})}
                                    onMouseOut={()=>this.setState({cartButtonIsVisible: false})}>

                                    <img src={this.props.product.gallery[0]}
                                         // className="card-image"
                                         className={this.props.product.inStock? 'card-image': 'card-image-out-of-stock'}/>

                                    <p className='outOfStock-txt'>{this.props.product.inStock? '': 'OUT OF STOCK'}</p>
                                    <Link to={"/cart"}>
                                        <div className={this.state.cartButtonIsVisible? 'cart-icon-in-card-div': 'hidden'}>
                                            <button className={this.state.cartButtonIsVisible? 'cart-icon-in-card': 'hidden'}>
                                                <AiOutlineShoppingCart/>
                                            </button>
                                        </div>
                                    </Link>
                                    <p className="card-title">{this.props.product.brand + " " + this.props.product.name}</p>
                                    <h5 className="card-price">
                                        {this.props.product.prices && this.props.product.prices.map(price =>{
                                            if (price.currency == selectedCurrency){
                                                return( <> { getSymbolFromCurrency(selectedCurrency) +" "+ price.amount.toLocaleString() }</> )
                                            }
                                        })}
                                    </h5>
                                </div>
                            </div>
                        </Link>
                    )
                }}
            </CurrencyContext.Consumer>

        )
    }
}