import React, {Component} from 'react';
import '../css/Navbar.css'
import '../css/Cart.css'
import {CurrencyContext} from "../contexts/CurrencyContext";
import {CartContext} from "../contexts/CartContext";
import getSymbolFromCurrency from "currency-symbol-map";
import {Link} from "react-router-dom";
import MiniCartItem from "./MiniCartItem";

class MiniCart extends Component {

    constructor(props) {
        super(props);
        this.state={

        }
    }

    render() {
        return (
            <>
                <CurrencyContext.Consumer>
                    {currencyContext =>(
                        <CartContext.Consumer>
                            {
                                (cartContext) =>{
                                    const {productsToPurchase, totalPrice, clearCart} = cartContext
                                    const {selectedCurrency} = currencyContext

                                    if (productsToPurchase.length === 0){
                                        return(<h1>Cart is empty</h1>)
                                    }
                                    else {
                                        return(
                                            <div className='miniCart-wrapper'>
                                                <div>
                                                    <p><b>My bag</b>, {productsToPurchase.length} items</p>
                                                    <hr/>
                                                </div>

                                                {productsToPurchase && productsToPurchase.map((product, index) =>{
                                                    return(
                                                        <>
                                                            <MiniCartItem key = {product.itemId + " " + index}
                                                                      product = {product}
                                                                      cartContext = {cartContext}
                                                                      currencyContext = {currencyContext}
                                                                      itemIndex={index}/>
                                                        </>
                                                    )})}

                                                <div className='minicart-footer'>
                                                    <div className='top-footer'>

                                                        <div className='top-left-footer'>
                                                            <p>Total</p>
                                                        </div>

                                                        <div className='top-right-footer'>
                                                            <p className='totalPrice-mini'>{ totalPrice && totalPrice.map(price =>{
                                                                if (price.currency == selectedCurrency){
                                                                    return( <> { getSymbolFromCurrency(selectedCurrency) +  price.amount.toLocaleString() }</> )
                                                                }
                                                            })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='bottom-footer'>
                                                        <div className='bottom-left-footer'>
                                                            <Link to='/cart'>
                                                                <button className='viewBagBtn'>VIEW BAG</button>
                                                            </Link>
                                                        </div>

                                                        <div className='bottom-right-footer'>
                                                            <Link to='/thank-you'>
                                                                <button className='checkOutBtn-mini' onClick={()=>clearCart()}>CHECK OUT</button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            }
                        </CartContext.Consumer>
                    )}
                </CurrencyContext.Consumer>

                {/*<Cart/>*/}
            </>
        );
    }
}

export default MiniCart;