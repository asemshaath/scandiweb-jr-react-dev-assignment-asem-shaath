import React, {Component, createContext} from "react"
import _ from 'lodash';

export const CartContext = createContext()

class CartContextProvider extends Component {

    state = {
        productsToPurchase: [],
        totalPrice:[]
    }

    clearCart = ()=>{
        this.setState({productsToPurchase:[]})
    }

    addProduct = (itemId, prices, givenAttributes) => {
        let index = -1

        // find the index of the existing product
        for (let i = 0; i < this.state.productsToPurchase.length; i++) {
            let product = this.state.productsToPurchase[i]
            if (product.itemId === itemId && _.isEqual(product.attributes, givenAttributes)) {
                index = i;
                break;
            }
        }

        if (index === -1){
            let newProduct = { itemId:itemId, qty: 1, price: prices, attributes: givenAttributes }
            this.setState({
                productsToPurchase: [...this.state.productsToPurchase, newProduct]
            }, ()=>{
                this.setState({totalPrice: getTotalAmount(this.state.productsToPurchase)})
            })
        } else {
            let productToModify = this.state.productsToPurchase[index]
            productToModify['qty'] += 1
            this.setState({
                productsToPurchase: [
                    ...this.state.productsToPurchase.slice(0,index),
                    productToModify,
                    ...this.state.productsToPurchase.slice(index+1)
                ]
            }, ()=>{
                this.setState({totalPrice: getTotalAmount(this.state.productsToPurchase)})
            })
        }
    }

    decreaseProduct = (itemId, givenAttributes) =>{
        let index = -1
        // find the index of the existing product
        for (let i = 0; i < this.state.productsToPurchase.length; i++) {
            let product = this.state.productsToPurchase[i]
            if (product.itemId === itemId && JSON.stringify(product.attributes) === JSON.stringify(givenAttributes)) {
                index = i;
                break;
            }
        }

        if (index === -1){
            // item doesn't exist
        }else {
            let productToModify = this.state.productsToPurchase[index]

            if (productToModify.qty <= 1){
                //remove product
                this.setState({productsToPurchase: [ ...this.state.productsToPurchase.slice(0,index),
                        ...this.state.productsToPurchase.slice(index+1)] },()=>{
                    this.setState({totalPrice: getTotalAmount(this.state.productsToPurchase)})
                })
            }else {
                // -1 from qty
                productToModify['qty'] -= 1
                this.setState({
                    productsToPurchase: [
                        ...this.state.productsToPurchase.slice(0,index),
                        productToModify,
                        ...this.state.productsToPurchase.slice(index+1)
                    ]
                },()=>{
                    this.setState({totalPrice: getTotalAmount(this.state.productsToPurchase)})
                })
            }
        }
    }

    render() {
        return (
            <CartContext.Provider value={{...this.state, addProduct: this.addProduct, decreaseProduct: this.decreaseProduct, clearCart: this.clearCart}}>
                {this.props.children}
            </CartContext.Provider>
        )
    }
}

function getTotalAmount(productsToPurchase) {

    const totalPrice = []

    productsToPurchase.map((product, productIndex) =>{
        product.price.map((price, priceIndex)=>{
            if (productIndex === 0){
                totalPrice.push({currency: price.currency, amount: price.amount * product.qty})
            } else {
                totalPrice.map(total=>{
                    if (total.currency === price.currency){
                        total.amount = total.amount + (price.amount * product.qty)
                    }
                })
            }
        })
    })

    return totalPrice
}

export default CartContextProvider;
