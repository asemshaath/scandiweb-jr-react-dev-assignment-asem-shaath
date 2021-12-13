import React, {Component} from 'react';
import {CurrencySelector} from "./CurrencySelector";
import {Link} from "react-router-dom";
import '../css/Navbar.css'
import MiniCart from "./MiniCart";
import { AiOutlineShoppingCart} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CgMenuBoxed } from "react-icons/cg";
import {CartContext} from "../contexts/CartContext";
import {NavItem} from "./NavItem";
import logo from '../logo.png'
import {CurrencyContext} from "../contexts/CurrencyContext";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";


export default class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state={
            cartOverlayIsOpen: false,
            currencySelectorIsOpen: false,
            phoneScreenMenuIsOpen: true
        }
    }

    render() {
        return (
                <nav>
                    <div className='LeftSide'>
                        <div className='all-tabs-contanier' id={this.state.phoneScreenMenuIsOpen? 'not-hidden-links': 'hidden-links'} >
                            {this.props.categories.map(
                                (category,index) => {
                                    return (
                                        <div key={'nav-tabs-container-div-'+index}>
                                            <div key={'nav-tabs-container-'+index} className='nav-tabs-container' onClick={()=> {
                                                this.setState({phoneScreenMenuIsOpen: true})
                                            }}>
                                                <NavItem key={category.name+'-nav-item'} name={category.name} path={"/"+category.name.toLowerCase()} />
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>

                        <div className='nav-menu-icon' onClick={()=>this.setState({phoneScreenMenuIsOpen: !this.state.phoneScreenMenuIsOpen})}>
                            <CgMenuBoxed/>
                        </div>
                    </div>

                    <div className='MiddleSide'>
                        <Link style={{width: "100%", justifyContent:"center", alignItems:"center", display:"flex"}} to = {"/"}>
                            <img className='logo' src={logo}/>
                        </Link>
                    </div>

                    <div className='RightSide'>

                        <CurrencyContext.Consumer>
                            {currencyContext=>{
                                const {selectedCurrency} = currencyContext

                                return(
                                    <div className='currency-selector-btn-contanier'>
                                        <div className='currency-selector' onClick={()=>{this.setState({currencySelectorIsOpen: !this.state.currencySelectorIsOpen})}}>
                                            <h2> { getSymbolFromCurrency(selectedCurrency) }{this.state.currencySelectorIsOpen? <IoIosArrowUp/> : <IoIosArrowDown/>}  </h2>
                                        </div>

                                        <div id={this.state.currencySelectorIsOpen? "currency-selector-box": "hidden"}
                                             onMouseOut={()=>{this.setState({currencySelectorIsOpen: false})}}
                                             onMouseOver={()=>{this.setState({currencySelectorIsOpen: true})}}>
                                            {/*<h1>Currency Selector</h1>*/}
                                            <CurrencySelector/>
                                        </div>
                                    </div>
                                )
                            }}
                        </CurrencyContext.Consumer>

                        <CartContext.Consumer>
                            {cartContext=>{
                                const {productsToPurchase, getTotalQty} = cartContext

                                return(
                                    <div className='MiniCart-btn' onClick={()=>{this.setState({cartOverlayIsOpen: !this.state.cartOverlayIsOpen})}}>
                                        <AiOutlineShoppingCart/>
                                        <div className='cart-btn-badge' style={ productsToPurchase.length ==0? {display: "none"}: {}}>
                                            <h4 className='cart-btn-badge-text'>
                                                {getTotalQty()}
                                            </h4>
                                        </div>
                                    </div>
                                )
                            }}
                        </CartContext.Consumer>

                    </div>

                    <div className="cart-overlay-cover" id={this.state.cartOverlayIsOpen? "": "hidden"} onClick={()=>this.setState({cartOverlayIsOpen:false})} > </div>

                    <div id={this.state.cartOverlayIsOpen? "cart-overlay": "hidden"}
                         onMouseOut={()=>{this.setState({cartOverlayIsOpen: false})} }
                         onMouseOver={()=>{this.setState({cartOverlayIsOpen: true})} }
                    >
                        <MiniCart/>
                    </div>
                </nav>
        )
    }
}


Navbar.propTypes = {
    categories: PropTypes.array
}
