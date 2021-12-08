import React, {Component} from 'react';
import '../css/ProductsPage.css'
import {CartContext} from "../contexts/CartContext";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";



class PlpPopup extends Component {

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

    render() {
        return (
            <>
                <div className='plp-popup-container'>
                    <div className='plp-popup-left'>
                        <img className='popup-img' src={this.props.product.gallery[0]}/>
                    </div>

                    <div className='plp-popup-right'>

                        <CartContext.Consumer>
                            {cartContext=>{

                                const {addProduct} = cartContext
                                return(
                                    <>
                                        <h1>{this.props.product.name}</h1>
                                        {this.props.product.attributes.map(attribute=>{
                                            return (
                                                <>
                                                    <p className='attribute-name-pdp'>{attribute.name.toUpperCase() + ":"}</p>
                                                    <div className='radio-group-container'>
                                                        {attribute.items.map(item =>{
                                                            return (
                                                                <div key={"plp-popup-" + attribute.name + "-" + item.id} className='radio-container'>
                                                                    <input  className='radio-btn'
                                                                            type="radio" id={item.id + " " + attribute.name}
                                                                            name={attribute.name + " "+ this.props.product.name} value={item.value}
                                                                            onClick={()=>{
                                                                                this.setSelectedAttr(attribute, item)
                                                                            }}
                                                                            checked={this.isAttributeSelected(attribute, item.value)}
                                                                    />
                                                                    <label className={attribute.type === 'swatch'? 'colored-label-pdp': 'radio-label'}
                                                                           id={attribute.type === 'swatch'? 'colored-label-popup': 'radio-label-popup'}
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


                                        <div className='plp-popup-btns'>

                                            <div className='plp-popup-btns-left'>

                                                <Link to={`/product/${this.props.product.id}`}>
                                                    <button className='view-details-btn-popup'> VIEW DETAILS </button>
                                                </Link>

                                            </div>

                                            <div className='plp-popup-btns-right' >
                                                <button disabled={!this.props.product.inStock} className={!this.props.product.inStock? 'outOfStock-btn': 'addToCart-btn'} onClick={()=>{
                                                    if (this.isEverythingClicked()){
                                                        addProduct(this.props.product.id, this.props.product.prices, JSON.parse(JSON.stringify(this.state.selectedAttributes)))
                                                    } else {
                                                        alert("You must choose your preferred attribute")
                                                    }
                                                }}>
                                                    {!this.props.product.inStock? 'OUT OF STOCK': 'ADD TO CART'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )
                            }}
                        </CartContext.Consumer>
                    </div>
                </div>
            </>
        );
    }
}

PlpPopup.propTypes = {
    product: PropTypes.object
}

export default PlpPopup;