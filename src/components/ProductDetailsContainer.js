import React, {Component} from 'react'
import getSymbolFromCurrency from "currency-symbol-map"
import {CartContext} from "../contexts/CartContext"
import {CurrencyContext} from "../contexts/CurrencyContext"
import '../css/PDP.css'

class ProductDetailsContainer extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedAttributes:[]
        }
    }

    isEverythingClicked(){
        return this.state.selectedAttributes.length === this.props.product.attributes.length
    }

    setSelectedAttr(at, item){

        let index = -1
        let newAttribute = {id: at.id, name: at.name, type: at.type, item: item}

        // get the index
        for (let i=0; i<this.state.selectedAttributes.length; i++){
            if (this.state.selectedAttributes[i].id === at.id){
                index = i
            }
        }


        if (index == -1) {
            // item is not availble. Push new item
            this.setState({selectedAttributes: [...this.state.selectedAttributes, newAttribute]})
        }
        else {
            // item is availble. Make the changes
            this.setState({selectedAttributes: [
                    ...this.state.selectedAttributes.slice(0,index),
                    newAttribute,
                    ...this.state.selectedAttributes.slice(index+1)
                ]})
        }
    }

    render() {
        return (
            <>
                <CartContext.Consumer>
                    {cartContext=>{
                        return(
                            <CurrencyContext.Consumer>
                                {currencyContext=>{
                                    const {selectedCurrency} = currencyContext
                                    const {addProduct} = cartContext
                                    return(
                                        <>
                                            <p className='brand-pdp'> {this.props.product.brand}</p>
                                            <p className='product-name-pdp'>{this.props.product.name}</p>

                                            {this.props.product.attributes.map(attribute=>{
                                                return (
                                                    <>
                                                        <p className='attribute-name-pdp'>{attribute.name.toUpperCase() + ":"}</p>
                                                        <div className='radio-group-container'>
                                                            {attribute.items.map(item =>{
                                                                return (
                                                                    <div className='radio-container'>
                                                                        <input  className='radio-btn'

                                                                                type="radio" id={item.id + " " + attribute.name}
                                                                                name={attribute.name + " "+ this.props.product.name} value={item.value}
                                                                               onClick={()=>{
                                                                                   this.setSelectedAttr(attribute, item)
                                                                               }}
                                                                                checked={this.isAttributeSelected(attribute, item.value)}
                                                                        />
                                                                        <label className={attribute.type === 'swatch'? 'colored-label-pdp': 'radio-label'}
                                                                               htmlFor={item.id + " " + attribute.name}
                                                                               onClick={()=>{this.setSelectedAttr(attribute, item)}}
                                                                               style={{backgroundColor: `${item.value}`}}>
                                                                            {attribute.type === 'swatch'? '' : `${item.displayValue}`}
                                                                        </label>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </>
                                                )
                                            })}

                                            <p className='price-title-pdp'>PRICE:</p>
                                            <p className='price-number-pdp'>
                                                {this.props.product.prices.map(
                                                    price =>{
                                                        if (price.currency == selectedCurrency){
                                                            return( <> { getSymbolFromCurrency(selectedCurrency) +" "+ price.amount }</> )
                                                        }
                                                    }
                                                )}
                                            </p>

                                            <button disabled={!this.props.product.inStock} className={!this.props.product.inStock? 'outOfStock-btn': 'addToCart-btn'} onClick={()=>{
                                                if (this.isEverythingClicked()){
                                                    addProduct(this.props.id, this.props.product.prices, JSON.parse(JSON.stringify(this.state.selectedAttributes)))
                                                } else {
                                                    alert("You must choose your preferred attribute")
                                                }
                                            }}>  {!this.props.product.inStock? 'OUT OF STOCK': 'ADD TO CART'}</button>

                                            <div dangerouslySetInnerHTML={{ __html: this.props.product.description }} />
                                        </>
                                    )
                                }}
                            </CurrencyContext.Consumer>
                        )
                    }}
                </CartContext.Consumer>
            </>
        )
    }

    isAttributeSelected(attribute, value) {
        if (this.state.selectedAttributes.length == 0){
            return false;
        }
        // get the index
        let index = -1
        for (let i=0; i<this.state.selectedAttributes.length; i++){
            if (this.state.selectedAttributes[i].id === attribute.id){
                index = i
                break;
            }
        }
        if (index == -1){
            return false;
        }
        return this.state.selectedAttributes[index].item.value == value;
    }
}

export default ProductDetailsContainer