import React from 'react';
import {CartContext} from "../contexts/CartContext";
import {CartItem} from "../components/CartItem";
import {CurrencyContext} from "../contexts/CurrencyContext";
import getSymbolFromCurrency from "currency-symbol-map";
import '../css/Cart.css'
import {Link} from 'react-router-dom'

export class Cart extends React.Component {

    constructor(props) {
        super(props);
    }


    render(){
        return (
            <div className='cart-wrapper'>
                <div>
                    <h1>CART</h1>
                    <br/>
                    <hr/>
                </div>

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
                                        <>
                                        {productsToPurchase && productsToPurchase.map((product, index) =>{
                                        return(
                                            <>
                                            <CartItem key = {product.itemId + " " + index}
                                                      product = {product}
                                                      cartContext = {cartContext}
                                                      currencyContext = {currencyContext}
                                                      itemIndex={index}/>
                                            </>
                                        )})}

                                            <div className='cart-footer'>

                                                <div className='left-cart-footer'>
                                                    <h3>Your Total is { totalPrice && totalPrice.map(price =>{
                                                        if (price.currency == selectedCurrency){
                                                            return( <> { getSymbolFromCurrency(selectedCurrency) +  price.amount.toLocaleString() }</> )
                                                        }
                                                    })}
                                                    </h3>
                                                </div>

                                                <div className='right-cart-footer'>
                                                    <Link className='check-out-btn-link' to={"/thank-you"}>
                                                        <button className='check-out-btn' onClick={()=> clearCart()}>CHECK OUT</button>
                                                    </Link>
                                                </div>

                                            </div>


                                        </>
                                    )
                                }
                            }
                        }
                    </CartContext.Consumer>
                    )}
                </CurrencyContext.Consumer>
            </div>
        )
    }
}

