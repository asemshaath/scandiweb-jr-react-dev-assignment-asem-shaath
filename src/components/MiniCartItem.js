import React, {Component} from 'react';
import {fetchTheQuery} from "../fetching";
import getSymbolFromCurrency from "currency-symbol-map";
import '../css/MiniCartItem.css'
import PropTypes from "prop-types";


class MiniCartItem extends Component {

    constructor(props) {
        super(props);
        this.state={
            product: null,
            failedToLoad: false,

        }
    }

    // This requires to change it to UNSAFE_componentWillMount() which is unsafe
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

                <div className='radio-btn-cart-group-container-mini'>
                    {attribute.items.map(item=> {
                        return (
                            <div key={item.id + " " + attribute.name + " mini"} className='radio-cart-mini'>
                                <input className= 'radio-btn-cart-mini' type='radio' id={item.id + " " + attribute.name + " mini"}
                                       value={item.value} name={attribute.name + " " + productId+ " " + JSON.stringify(this.props.product.attributes) + " mini"}
                                       checked={selectedAttributeItem==item.id}
                                />
                                <label
                                    className={attribute.type === 'swatch'? 'colored-label-mini': 'radio-label-mini'}
                                    htmlFor={item.id + " " + attribute.name + " mini"} style={{backgroundColor: `${item.value}`}}>
                                    {attribute.type === 'swatch'? '' : `${item.displayValue}`}
                                </label>
                            </div>
                        )
                    })}
                </div>
            </>
        )
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
                    <div className='cart-item-container-mini'>

                        <div className='leftSide-mini'>
                            <p className='brand-txt-mini'> {this.state.product.brand} </p>
                            <p className='name-txt-mini'> {this.state.product.name} </p>

                            <p className='price-txt-mini'>
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

                        <div className='rightSide-mini'>

                            <div className='img-wrapper-mini'>
                                <button className='plusBtn-mini' onClick={() => addProduct(this.props.product.itemId, this.state.product.prices, this.props.product.attributes)}> + </button>
                                <p className='item-qty-mini'>{productsToPurchase[this.props.itemIndex].qty}</p>
                                <button className='minusBtn-mini' onClick={()=> decreaseProduct(this.props.product.itemId, this.props.product.attributes)}> - </button>

                                <img className='product-img-mini' src={this.state.product.gallery[0]}/>
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


MiniCartItem.propTypes = {
    product: PropTypes.object,
    cartContext: PropTypes.any,
    currencyContext: PropTypes.any,
    itemIndex: PropTypes.number
}

export default MiniCartItem;