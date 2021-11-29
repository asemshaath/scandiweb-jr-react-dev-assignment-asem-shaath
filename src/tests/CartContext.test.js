import React from 'react'
import {render, fireEvent, screen} from "@testing-library/react";
import {CartContext} from '../contexts/CartContext';
import CartContextProvider from '../contexts/CartContext'

// A test component for unit testing purposes
class CartContextTest extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            productName: '',
            priceInUSD: 0,
            priceInEUR: 0,
            attribute: ''
        }
    }
    render() {
        return (
            <CartContextProvider>
                <CartContext.Consumer>
                    {context=>{
                        const {productsToPurchase, totalPrice, addProduct, decreaseProduct} = context

                        return(<>
                            <input type='text' title='product-name'
                                   onChange={ (e)=>{this.setState({productName: e.target.value})} }
                            />
                            <input type='text' title='price-in-usd'
                                   onChange={ (e)=>{this.setState({priceInUSD: e.target.value})} }
                            />
                            <input type='text' title='price-in-eur'
                                   onChange={ (e)=>{this.setState({priceInEUR: e.target.value})} }
                            />
                            <input type='text' title='attribute'
                                   onChange={ (e)=>{this.setState({attribute: e.target.value})} }
                            /> {/*There will be only ONE attribute for simplicity purposes*/}

                            <button title='add-product' onClick={()=>{
                                addProduct(this.state.productName,[{currency: 'USD', amount: this.state.priceInUSD},{currency: 'EUR', amount: this.state.priceInEUR}] , this.state.attribute)
                            }}>Add</button>

                            {/*This is should be changed once the Add button is clicked*/}
                            {productsToPurchase.map(product=>{
                                return(<div>
                                    <h1 title={"Name " + product.itemId}>{product.itemId}</h1>
                                    <button title={"Plus " + product.itemId} onClick={()=>{addProduct(product.itemId, product.price, product.attributes)}}>+</button>
                                    <h1 title={"qty " + product.itemId}>{product.qty}</h1>
                                    <button title={"Minus " + product.itemId} onClick={()=>{decreaseProduct(product.itemId, product.attributes)}}>-</button>
                                    <>{product.price.map(price=>{
                                        return(<h1 title={price.currency + " " + product.itemId}>{price.amount}</h1>)
                                    })}</>
                                    <h1>{product.attributes}</h1>
                                </div>)
                            })}
                        </>)

                    }}
                </CartContext.Consumer>
            </CartContextProvider>
        );
    }
}

describe("Testing the ability to add and remove products from the cart", ()=>{

    it('Should add and remove products successfully', async ()=>{

        render(<CartContextTest/>)
        const nameInput = screen.getByTitle("product-name")
        const usdInput = screen.getByTitle("price-in-usd")
        const eurInput = screen.getByTitle("price-in-eur")
        const attributeInput = screen.getByTitle("attribute")
        const addProductBtn = screen.getByTitle("add-product")

        // Add iPhone XR
        fireEvent.change(nameInput, {target:{value: "iphone-xr"}})
        expect(nameInput.value).toBe("iphone-xr")

        fireEvent.change(usdInput, {target:{value: "600"}})
        expect(usdInput.value).toBe("600")

        fireEvent.change(eurInput, {target:{value: "500"}})
        expect(eurInput.value).toBe("500")

        fireEvent.change(attributeInput, {target:{value: "blue"}})
        expect(attributeInput.value).toBe("blue")

        fireEvent.click(addProductBtn)

        expect(screen.getByTitle("Name iphone-xr").innerHTML).toBe("iphone-xr")
        expect(screen.getByTitle("qty iphone-xr").innerHTML).toBe("1")

        fireEvent.click(screen.getByTitle("Plus iphone-xr"))
        expect(screen.getByTitle("qty iphone-xr").innerHTML).toBe("2")

        // Add iPhone 13
        fireEvent.change(nameInput, {target:{value: "iphone-13"}})
        expect(nameInput.value).toBe("iphone-13")

        fireEvent.change(usdInput, {target:{value: "1000"}})
        expect(usdInput.value).toBe("1000")

        fireEvent.change(eurInput, {target:{value: "900"}})
        expect(eurInput.value).toBe("900")

        fireEvent.change(attributeInput, {target:{value: "pro"}})
        expect(attributeInput.value).toBe("pro")

        fireEvent.click(addProductBtn)

        expect(screen.getByTitle("Name iphone-13").innerHTML).toBe("iphone-13")
        expect(screen.getByTitle("qty iphone-13").innerHTML).toBe("1")

        // remove all the products by (-) button
        fireEvent.click(screen.getByTitle("Minus iphone-13"))
        expect(screen.queryByText("Name iphone-13")).toBeNull()

        fireEvent.click(screen.getByTitle("Minus iphone-xr"))
        expect(screen.getByTitle("qty iphone-xr").innerHTML).toBe("1")

        fireEvent.click(screen.getByTitle("Minus iphone-xr"))
        expect(screen.queryByText("Name iphone-xr")).toBeNull()
    })
})

