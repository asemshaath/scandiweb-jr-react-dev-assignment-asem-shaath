import React, {Component} from 'react';
import {fetchTheQuery} from "../fetching";
import getSymbolFromCurrency from "currency-symbol-map";
import '../css/Cart.css'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PropTypes from "prop-types";



export class CartItem extends Component {

    constructor(props) {
        super(props);
        this.state={
            product: null,
            failedToLoad: false,
            imageIndex: 0
        }
    }

    // eslint requires me to change it to UNSAFE_componentWillMount() which is unsafe
    // eslint-disable-next-line react/no-deprecated
    async componentWillMount(){
        let data = await this.getProduct(this.props.product.itemId);
        if (data.data.product) {
            this.setState({product: data.data.product});
        } else {
            this.setState({failedToLoad: true});
        }
    }

    async getProduct(id){
        return await fetchTheQuery(
            `query getProduct($id: String!){
                      product(id: $id){
                        name
                        brand
                        gallery
                        prices{
                          currency
                          amount
                        }
                        attributes{
                          id
                          name
                          type
                          items{
                            displayValue
                            value
                            id
                          }
                        }
                      }
                    }`, {id: id}
        )
    }

    renderAttributes(attribute, productId) {

        let selectedAttributeItem = ''

        for (let i = 0; i<this.props.product.attributes.length; i++){
            if (this.props.product.attributes[i].id === attribute.id){
                selectedAttributeItem = this.props.product.attributes[i].item.id
                break
            }
        }

        return (
            <>
                <h5>{attribute.name.toUpperCase() + ":"}</h5>

                <div className='radio-btn-cart-group-container'>
                {attribute.items.map(item=> {
                    return (
                        <div key={item.id + " " + attribute.name} className='radio-cart'>
                            <input className= 'radio-btn-cart' type='radio' id={item.id + " " + attribute.name}
                                   value={item.value} name={attribute.name + " " + productId+ " " + JSON.stringify(this.props.product.attributes)}
                                   checked={selectedAttributeItem==item.id}
                            />
                            <label
                                className={attribute.type === 'swatch'? 'colored-label-cart': 'radio-label-cart'}
                                htmlFor={item.id + " " + attribute.name} style={{backgroundColor: `${item.value}`}}>
                                {attribute.type === 'swatch'? '' : `${item.id}`}
                            </label>
                        </div>
                    )
                })}
                </div>
            </>
        )
    }

    nextImage(){
        if (this.state.product.gallery.length - 1 === this.state.imageIndex ){
            this.setState({imageIndex: 0})
        }else {
            this.setState({imageIndex: this.state.imageIndex + 1})
        }
    }

    prevImage(){
        if (this.state.imageIndex === 0){
            this.setState({imageIndex: this.state.product.gallery.length - 1})
        }else {
            this.setState({imageIndex: this.state.imageIndex - 1})
        }
    }


    render() {
        const {addProduct, decreaseProduct, productsToPurchase} = this.props.cartContext
        const {selectedCurrency} = this.props.currencyContext

        let productFetched = this.state.product

        if (this.state.failedToLoad){
            return (<div>Something went wrong</div>)
        }
        else if (productFetched){

            return(
                <>
                <div className='cart-item-container'>

                    <div className='leftSide'>
                        <p className='brand-txt'> {this.state.product.brand} </p>
                        <p className='name-txt'> {this.state.product.name} </p>

                        <p className='price-txt'>
                            { this.state.product.prices && this.state.product.prices.map(
                                price =>{
                                    if (price.currency == selectedCurrency){
                                        return( <> { getSymbolFromCurrency(selectedCurrency) +" "+ price.amount.toLocaleString() }</> )
                                    }
                                }
                            )}
                        </p>

                        {this.state.product.attributes.map(attribute=>{
                            return this.renderAttributes(attribute, this.props.product.itemId)
                        })}
                    </div>
                    <div className='rightSide'>
                        <div className='img-wrapper'>
                            <button className='plusBtn' onClick={() => addProduct(this.props.product.itemId, this.state.product.prices, this.props.product.attributes)}> + </button>
                            <p className='item-qty'>{productsToPurchase[this.props.itemIndex].qty}</p>
                            <button className='minusBtn' onClick={()=> decreaseProduct(this.props.product.itemId, this.props.product.attributes)}> - </button>

                            <div className= {this.state.product.gallery.length ===1? 'hidden':'left-arrow-img'} onClick={()=> this.prevImage()}> <IoIosArrowBack/> </div>
                            <img className='product-img' src={this.state.product.gallery[this.state.imageIndex]}/>
                            <div className= {this.state.product.gallery.length ===1? 'hidden':'right-arrow-img'} onClick={()=> this.nextImage()}> <IoIosArrowForward/> </div>
                        </div>
                    </div>
                </div>
                    <hr/>
                </>
            )
        }
        else {
            return <p>Loading............</p>
        }
    }
}

CartItem.propTypes = {
    product: PropTypes.object,
    cartContext: PropTypes.any,
    currencyContext: PropTypes.any,
    itemIndex: PropTypes.number
}
