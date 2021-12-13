import React from 'react'
import {CurrencyContext} from "../contexts/CurrencyContext";
import getSymbolFromCurrency from 'currency-symbol-map'
import {Link} from "react-router-dom";
import '../css/ProductsPage.css'
import { AiOutlineShoppingCart} from "react-icons/ai";
import { BiXCircle } from "react-icons/bi";
import PlpPopup from "./PlpPopup";
import PropTypes from "prop-types";



export class ItemCard extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            cartButtonIsVisible: false,
            popupIsVisible: false
        }
    }


    render() {
        return (
            <CurrencyContext.Consumer>
                {(currencyContext) => {
                    const {selectedCurrency} = currencyContext
                    return (
                        <>
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

                                        <div>
                                            <Link to={this.props.category}>
                                                <div className={this.state.cartButtonIsVisible? 'cart-icon-in-card-div': 'hidden'}>
                                                    <button className={this.state.cartButtonIsVisible? 'cart-icon-in-card': 'hidden'}
                                                            onClick={()=>{this.setState({popupIsVisible: !this.state.popupIsVisible})}}>
                                                        <AiOutlineShoppingCart/>
                                                    </button>
                                                </div>
                                            </Link>
                                        </div>

                                        <p className="card-title">{this.props.product.brand + " " + this.props.product.name}</p>
                                        <div className="card-price">
                                            {this.props.product.prices && this.props.product.prices.map(price =>{
                                                if (price.currency == selectedCurrency){
                                                    return( <h5 key={price.currency+'-item-card-price'}> { getSymbolFromCurrency(selectedCurrency) +" "+ price.amount.toLocaleString() }</h5> )
                                                }
                                            })}
                                        </div>

                                    </div>
                                </div>
                            </Link>

                            <div id={this.state.popupIsVisible? 'popup-cover': 'hidden'} onClick={()=>this.setState({popupIsVisible:false})} ></div>
                            <div id={this.state.popupIsVisible? 'plp-popup': 'hidden'}>
                                <div className='plp-popup-header'>
                                    <div className='plp-x-btn' onClick={()=>this.setState({popupIsVisible: false})}>
                                        <BiXCircle/>
                                    </div>
                                </div>
                                <PlpPopup key={this.props.product.id + "-plp popup"} product = {this.props.product}/>
                            </div>
                        </>
                    )
                }}
            </CurrencyContext.Consumer>

        )
    }
}

ItemCard.propTypes = {
    product: PropTypes.object,
    category: PropTypes.string
}